import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { thunkUpdateWordgonSession, thunkDeleteWordgonSession } from "../../store/wordgon";
import { checkWordsTable } from "../../utils/wordChecks";
import { lettersParse } from "../../utils/puzzleFunctions";
import StartPuzzleModal from "./StartPuzzleModal";
import { BoxAndLetters } from "./WordGonBox";

import './wordgon.css';

export default function Puzzle() {
    const dispatch = useDispatch()
    const puzzleId = useParams().wordgonId
    const [puzzle, setPuzzle] = useState(null)
    // const [connections, setConnections] = useState([])
    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    // const [completed, setCompleted] = useState(false)
    const [session, setSession] = useState(null)
    const [showModal, setShowModal] = useState(false)

    // const currentUser = useSelector(state => state.session.user)
    const sessions = useSelector(state => state.wordgon)


    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/wordgons/${puzzleId}`);
            let data = await res.json();

            if (res.ok) {
                setPuzzle(data)
                return
            }
        })()
    }, [puzzleId])

    // find session
    useEffect(() => {
        (async () => {
            if (!puzzle) return
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
        })()
    }, [puzzle, sessions, dispatch, puzzleId])

    useEffect(() => {
        if (session && session.guesses.length) {
            setGuesses(session.guesses.split(','))
            setCurrentGuess(session.guesses[session.guesses.length - 1])
        }
    }, [session])



    if (!puzzle) return null


    const allowedKeys = new Set(puzzle.letters)
    allowedKeys.add('enter')
    allowedKeys.add('backspace')

    const { up, left, right, down } = lettersParse(puzzle.letters);

    async function handleFormSubmit(e) {
        e.preventDefault()
        // Disable further submits

        // check guess is word
        const valid = await checkWordsTable(currentGuess)

        if (valid) {
            const allGuesses = [...guesses, currentGuess];
            let completed = true;

            // Check if puzzle complete
            for (let i = 0; i < puzzle.letters.length; i++) {
                let char = puzzle.letters[i];
                if (!allGuesses.join('').includes(char)) {
                    completed = false;
                    break
                }
            }
            await dispatch(thunkUpdateWordgonSession({
                puzzleId,
                sessionId: session.id,
                guesses: allGuesses,
                completed
            }))
            return
        }
        // inform user that they have an invalid word
    }

    function handleFormKeyDown(e) {
        if (!allowedKeys.has(e.key.toLowerCase())) {
            e.preventDefault()
        }

        if (e.key === 'Backspace' && currentGuess.length <= 1 && guesses.length > 0) {
            e.preventDefault()
            const last = guesses.pop()
            setCurrentGuess(last)
        }

        if (currentGuess.length >= 1) {
            for (let side of [up, left, right, down]) {
                if (side.includes(e.key.toUpperCase()) && side.includes(currentGuess[currentGuess.length - 1].toUpperCase())) {
                    e.preventDefault()
                }
            }
        }
    }

    async function deleteHandler(e) {
        setShowModal(true)
        const data = await dispatch(thunkDeleteWordgonSession(puzzleId, session.id))
    }

    function usedLetter(char) {
        return guesses.join('').includes(char.toLowerCase()) || currentGuess.includes(char.toLowerCase()) ? 'used' : ''
    }

    function activeLetter(char) {
        let n = currentGuess.length
        return n > 0 && currentGuess[n - 1] === char.toLowerCase() ? 'active-letter' : ''
    }

    return (
        <div id='session-container'>
            <StartPuzzleModal showModal={showModal} setShowModal={setShowModal} puzzleId={puzzleId} />
            <div id='guesses-container'>
                <form onSubmit={handleFormSubmit}>
                    <label htmlFor="guess">
                        Type a word:
                    </label>
                    <input
                        type="text"
                        name="guess"
                        value={currentGuess}
                        onKeyDown={handleFormKeyDown}
                        onChange={e => setCurrentGuess(e.target.value)}
                        autoComplete='off'
                    >
                    </input>
                </form>
                <h3>Guesses</h3>
                <ul>
                    {
                        guesses.map((word, idx) => (
                            word.length > 0 && <li key={idx}>
                                {word}
                            </li>
                        ))
                    }
                </ul>
                <button onClick={deleteHandler}>Start Over?</button>
            </div>
            {/* <div id='puzzle-container'>
                <div id='up-letters' className="letters">
                    {up.map((x, idx) => (
                        <span
                            key={'up' + idx}
                            className={'letter ' + (activeLetter(x) || usedLetter(x))}
                        >
                            {x}
                        </span>
                    ))}
                </div>
                <div id='puzzle-middle'>
                    <div id='left-letters' className="letters">
                        {left.map((x, idx) => (
                            <span
                                key={'left' + idx}
                                className={'letter ' + (activeLetter(x) || usedLetter(x))}
                            >
                                {x}
                            </span>
                        ))}
                    </div>
                    <div id='puzzle-square'>
                    </div>
                    <div id='right-letters' className="letters">
                        {right.map((x, idx) => (
                            <span
                                key={'right' + idx}
                                className={'letter ' + (activeLetter(x) || usedLetter(x))}
                            >
                                {x}
                            </span>
                        ))}
                    </div>
                </div>
                <div id='down-letters' className="letters">
                    {down.map((x, idx) => (
                        <span
                            key={'down' + idx}
                            className={'letter ' + (activeLetter(x) || usedLetter(x))}
                        >
                            {x}
                        </span>
                    ))}
                </div>
            </div> */}
            <BoxAndLetters letters={puzzle.letters} />
        </div>
    )
}
