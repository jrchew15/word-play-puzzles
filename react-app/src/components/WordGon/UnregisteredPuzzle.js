import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { color_dict, puzzleDifficulty } from "../../utils/puzzleFunctions";
import { checkWordsTable } from "../../utils/wordChecks";
import { lettersParse } from "../../utils/puzzleFunctions";
import StartPuzzleModal from "./StartPuzzleModal";
import { BoxAndLetters } from "./WordGonBox";
import CompleteModal from "./CompletedModal";
import FailModal from "./FailModal";
import { login } from "../../store/session";
import { defaultImg } from "../../store/utils/image_urls";
import { parseDate } from "../Carousels/PuzzlesOfTheDay";
import RulesModal from "./RulesModal";
import './puzzle-modal.css'

import './wordgon.css';

export default function UnregisteredPuzzle() {
    const puzzleId = useParams().wordgonId
    const history = useHistory();
    const dispatch = useDispatch();
    const [puzzle, setPuzzle] = useState(null)

    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    const [completed, setCompleted] = useState(false)
    const [showModal, setShowModal] = useState(true)
    const [showFailModal, setShowFailModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [showInvalidWord, setShowInvalidWord] = useState(false)
    const [showRulesModal, setShowRulesModal] = useState(false)

    const today_date = new Date();

    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/wordgons/${puzzleId}`);
            let data = await res.json();

            if (res.ok) {
                let puzzleDate = data.puzzleDay

                let [year, month, day] = puzzleDate.split('-')
                let notToday = day !== today_date.getDate() || month !== today_date.getMonth() + 1 || year !== today_date.getFullYear();
                if (notToday) {
                    history.push('/unauthorized')
                }

                setPuzzle(data)
                return
            }
        })()
    }, [puzzleId])

    async function demoLogin(e) {
        await dispatch(login('Demo', 'password'));
        history.push('/')
    }

    // Submission of new guess happens in useEffect triggered by submitting boolean
    useEffect(() => {
        // break useEffect if running on initial render
        if (!submitting) {
            if (completed) { setShowModal(true) }
            return
        }

        (async () => {
            // Check internal table, then if not found check WordsAPI.
            const valid = await checkWordsTable(currentGuess)

            if (valid) {
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
                if (completed) setCompleted(true)
                if (!completed && allGuesses.length >= puzzle.numAttempts) {
                    setShowFailModal(true)
                    setSubmitting(false)
                    return
                }
                setGuesses(allGuesses)
                setCurrentGuess(word => word[word.length - 1])
            } else {
                setShowInvalidWord(true)
                setTimeout(() => { setShowInvalidWord(false) }, 2500)
            }

            // Reset submitting status regardless of validity of word
            setSubmitting(false)
        })()
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
        setGuesses([])
        setCurrentGuess('')
    }



    return (
        <>
            <div id='session-container' style={{ backgroundColor: color_dict[puzzleDifficulty(puzzle)] }}>
                {completed ?
                    <CompleteModal numGuesses={guesses.length} numAttempts={puzzle.numAttempts} showModal={showModal} setShowModal={setShowModal} completed={completed} />
                    : <StartPuzzleModal showModal={showModal} setShowModal={setShowModal} puzzleId={puzzleId} />}
                <FailModal showModal={showFailModal} setShowModal={setShowFailModal} />
                <RulesModal showModal={showRulesModal} setShowModal={setShowRulesModal} />
                <div id='puzzle-topbar'>
                    <div id='puzzle-author'>
                        <img src={puzzle.user.profilePicture} alt={puzzle.user.username} onError={e => e.target.src = defaultImg} />
                        By {puzzle.user.username}
                        <div className="puzzle-topbar-sep" style={{ marginLeft: 15 }} />
                        <div onClick={() => setShowRulesModal(true)} id='rules-button'>Rules</div>
                        <div className="puzzle-topbar-sep" />
                    </div>
                    <div >{puzzle.puzzleDay === 'None' ? `Word-Gon #${puzzle.id}` : 'Puzzel of the Day: ' + parseDate(puzzle.puzzleDay)}</div>
                    <div style={{ height: '100%', display: 'flex', position: 'absolute', right: 0 }}>
                        <div className="puzzle-topbar-sep" />
                        <div id="restart-button" onClick={demoLogin}>Demo Login</div>
                        <div className="puzzle-topbar-sep" />
                        <div id='restart-button' onClick={deleteHandler}>Restart</div>
                    </div>
                </div>
                <div id='guesses-puzzles'>
                    <div id='guesses-container'>
                        {showInvalidWord && <div id='invalid-word'>Not a valid word...</div>}
                        {!completed ? <form id='guess-form' onSubmit={handleFormSubmit}>
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
                    <BoxAndLetters letters={puzzle.letters} guesses={guesses} currentGuess={currentGuess} backgroundColor={color_dict[puzzleDifficulty(puzzle)]} />
                </div>
            </div >
        </>
    )
}
