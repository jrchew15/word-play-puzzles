import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { authenticate } from "../../store/session";
import { thunkUpdateWordgonSession, thunkDeleteWordgonSession } from "../../store/wordgon";
import { checkWordsTable } from "../../utils/wordChecks";
import { lettersParse } from "../../utils/puzzleFunctions";
import StartPuzzleModal from "./StartPuzzleModal";
import { BoxAndLetters } from "./WordGonBox";
import CompleteModal from "./CompletedModal";
import FailModal from "./FailModal";
import CommentsContainer from "../Comments/CommentsContainer";
import { color_dict, puzzleDifficulty } from '../../utils/puzzleFunctions';
import { defaultImg } from "../../store/utils/image_urls";
import { parseDate } from "../Carousels/PuzzlesOfTheDay";
import RulesModal from "./RulesModal";

import './wordgon.css';

export default function Puzzle() {
    const dispatch = useDispatch()
    const history = useHistory()
    const puzzleId = useParams().wordgonId
    const [puzzle, setPuzzle] = useState(null)

    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    const [showInvalidWord, setShowInvalidWord] = useState(false)

    const [animating, setAnimating] = useState(false)
    const [validWord, setValidWord] = useState(false)

    const [session, setSession] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showFailModal, setShowFailModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [showRulesModal, setShowRulesModal] = useState(false)

    const sessions = useSelector(state => state.wordgon)
    const currentUser = useSelector(state => state.session.user)

    const guessRef = useRef(null);

    useEffect(() => {
        setIsLoaded(false);
        (async () => {
            let res = await fetch(`/api/wordgons/${puzzleId}`);
            let data = await res.json();

            if (res.ok) {
                setPuzzle(data)
                return
            }
            history.push('/404')
        })()
    }, [puzzleId])

    // find session
    useEffect(() => {
        (async () => {
            if (!puzzle || !currentUser) return
            let foundSession
            for (let key in sessions) {
                if (sessions[key].puzzleId === +puzzleId) {
                    foundSession = sessions[key]
                }
            }
            if (foundSession) {
                // set current session using sessions store
                setSession(foundSession)
            } else {
                setShowModal(true)
            }
            setIsLoaded(true)
        })()
    }, [puzzle, sessions, dispatch, puzzleId])

    useEffect(() => {
        if (session && session.guesses.length) {
            setGuesses(session.guesses.split(','))
            session.completed ? setCurrentGuess('') && setShowComments(true) : setCurrentGuess(session.guesses[session.guesses.length - 1])
            return
        }

        setGuesses([])
        setCurrentGuess('')
    }, [session])

    useEffect(() => {
        if (!animating && !submitting) return
        if (animating) {
            (async () => {
                // Check internal table, then if not found check WordsAPI.
                // this operation should be concurrent with animation
                const valid = await checkWordsTable(currentGuess)
                setValidWord(valid)
            })()
            return
        }
        if (!animating && submitting) {
            // update session when animation finished
            (async () => {

                if (validWord) {
                    const allGuesses = [...guesses, currentGuess];
                    let completed = true;

                    // Check if puzzle complete
                    for (let i = 0; i < puzzle.letters.length; i++) {
                        let char = puzzle.letters[i];
                        if (!allGuesses.join('').includes(char)) {
                            completed = false;
                            // If any character is not among guesses, then break loop; no need to keep checking
                            break
                        }
                    }

                    if (!completed && allGuesses.length >= puzzle.numAttempts) {
                        setShowFailModal(true)
                        setSubmitting(false)
                        return
                    }
                    // Update the user's session
                    await dispatch(thunkUpdateWordgonSession({
                        puzzleId,
                        sessionId: session.id,
                        guesses: allGuesses,
                        completed
                    }))
                    await dispatch(authenticate())

                } else {
                    setShowInvalidWord(true)
                    setTimeout(() => { setShowInvalidWord(false) }, 3000)
                }
                // Reset submitting status regardless of validity of word
                setSubmitting(false)
            })()
        }
    }, [animating])

    // Submission of new guess happens in useEffect triggered by submitting boolean
    useEffect(() => {
        // break useEffect if running on initial render
        if (!submitting) {
            if (session && session.completed) { setShowModal(true); setShowComments(true) }
            return
        }
        setAnimating(true)
    }, [submitting])

    if (!puzzle) return null


    const allowedKeys = new Set(puzzle.letters)
    allowedKeys.add('Enter')
    allowedKeys.add('Backspace')

    const { up, left, right, down } = lettersParse(puzzle.letters);

    async function handleFormSubmit(e) {
        e.preventDefault()
        // no need to check if word length is too short
        if (currentGuess.length <= 1) return

        // Disable further submits
        setSubmitting(true);
    }


    function handleFormKeyDown(e) {
        // prevent any input if form is submitting or if any unallowed keys are pressed
        if (submitting || !allowedKeys.has(e.key)) {
            e.preventDefault()
            return
        }

        // backspace allows you to alter past guesses
        if (e.key === 'Backspace' && currentGuess.length <= 1 && guesses.length > 0) {
            e.preventDefault()
            const last = guesses.pop()
            setCurrentGuess(last)
        }

        //
        if (currentGuess.length >= 1) {
            for (let side of [up, left, right, down]) {
                if (side.includes(e.key) && side.includes(currentGuess[currentGuess.length - 1])) {
                    e.preventDefault()
                }
            }
        }
    }

    async function deleteHandler(e) {
        const data = await dispatch(thunkDeleteWordgonSession(puzzleId, session.id));
        await dispatch(authenticate())
        if (!data) {
            setShowModal(true)
            setSession(null)
        }
    }

    function giveFocus() {
        if (guessRef.current) guessRef.current.focus()
    }

    return (
        <>
            <div id='session-container' style={{ backgroundColor: color_dict[puzzleDifficulty(puzzle)] }}>
                {session && session.completed ?
                    <CompleteModal numGuesses={guesses.length} numAttempts={puzzle.numAttempts} showModal={showModal} setShowModal={setShowModal} completed={session.completed} />
                    : <StartPuzzleModal showModal={showModal} setShowModal={setShowModal} puzzleId={puzzleId} />}
                <FailModal guesses={guesses} setCurrentGuess={setCurrentGuess} showModal={showFailModal} setShowModal={setShowFailModal} deleteHandler={deleteHandler} />
                <RulesModal showModal={showRulesModal} setShowModal={setShowRulesModal} />
                <div id='puzzle-topbar'>
                    <div id='puzzle-author'>
                        <img src={puzzle.user.profilePicture} alt={puzzle.user.username} onError={e => e.target.src = defaultImg} />
                        By {puzzle.user.username}
                        <div className="puzzle-topbar-sep" style={{ marginLeft: 15 }} />
                        <div onClick={() => setShowRulesModal(true)} id='rules-button'>Rules</div>
                        <div className="puzzle-topbar-sep" />
                    </div>
                    <div >{puzzle.puzzleDay === 'None' ? `Word-Gon #${puzzle.id}` : 'Puzzle of the Day: ' + parseDate(puzzle.puzzleDay)}</div>
                    <div style={{ height: '100%', display: 'flex', position: 'absolute', right: 0 }}>
                        <div className="puzzle-topbar-sep" />
                        <div id='restart-button' onClick={deleteHandler}>Restart</div>
                    </div>
                </div>
                {isLoaded && <div id='guesses-puzzles' onClick={giveFocus}>
                    <div id='guesses-container'>
                        {showInvalidWord && <div id='invalid-word'>Not a valid word...</div>}
                        {!session?.completed ? <form id='guess-form' onSubmit={handleFormSubmit}>
                            <input
                                style={{ backgroundColor: color_dict[puzzleDifficulty(puzzle)] }}
                                type="text"
                                name="guess"
                                value={currentGuess.toUpperCase()}
                                onKeyDown={handleFormKeyDown}
                                onChange={e => setCurrentGuess(e.target.value.toLowerCase())}
                                autoComplete='off'
                                id='guess-box'
                                autoFocus
                                ref={guessRef}
                            >
                            </input>
                            <div id='attempts-box'>
                                Try to solve in {puzzle.numAttempts} words
                            </div>

                        </form> : <div> Your Words:</div>}
                        <div style={{ display: submitting ? 'flex' : 'none' }}> Submitting ...</div>
                        <div id='past-guesses'>
                            {guesses.map(x => x.toUpperCase()).join('-')}
                        </div>
                    </div>
                    <BoxAndLetters letters={puzzle.letters} guesses={guesses} currentGuess={currentGuess} backgroundColor={color_dict[puzzleDifficulty(puzzle)]} animating={animating} setAnimating={setAnimating} />
                </div>}
                {/* <div style={{ display: (session && session.completed) ? 'flex' : 'none' }}> */}
                <CommentsContainer puzzleId={puzzleId} setShowComments={setShowComments} showComments={showComments} />
                {/* </div> */}
            </div >
        </>
    )
}
