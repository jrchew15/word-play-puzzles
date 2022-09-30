import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { thunkAddWordgonSession, thunkUpdateWordgonSession } from "../../store/wordgon";
import { checkWordsTable } from "../../utils/wordChecks";

import './wordgon.css';

export default function Puzzle() {
    const dispatch = useDispatch()
    const puzzleId = useParams().wordgonId
    const [puzzle, setPuzzle] = useState(null)
    const [connections, setConnections] = useState([])
    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    const [completed, setCompleted] = useState(false)
    const [session, setSession] = useState(null)

    const currentUser = useSelector(state => state.session.user)
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
    }, [])

    useEffect(() => {
        (async () => {
            if (!puzzle) return
            let foundSession
            for (let key in sessions) {
                if (sessions[key].puzzleId == puzzleId) {
                    foundSession = sessions[key]
                }
            }
            if (foundSession) {
                // set current session using sessions store
                setSession(foundSession)
            } else {
                let newSession = await dispatch(thunkAddWordgonSession(puzzleId))
                if (newSession.errors) {
                    return
                }
                setSession(newSession)
            }
        })()
    }, [puzzle, sessions])

    useEffect(() => {
        if (session && session.guesses.length) {
            setGuesses(session.guesses.split(','))
            setCurrentGuess(session.guesses[session.guesses.length - 1])
        }
    }, [session])



    if (!puzzle) return null

    const { up, left, right, down } = letters_parse(puzzle.letters);

    async function handleFormSubmit(e) {
        e.preventDefault()
        // check guess
        const valid = await checkWordsTable(currentGuess)

        if (valid) {
            const res = await dispatch(thunkUpdateWordgonSession({
                puzzleId,
                sessionId: session.id,
                guesses: [...guesses, currentGuess],
                completed: false
            }))
            // if (res) {
            //     setCurrentGuess(word => word[word.length - 1])
            // }
            return
        }
        // inform user that they have an invalid word
    }

    function handleFormKeyDown(e) {
        console.log('KEYDOWN', e.key)
        const allowedKeys = new Set(puzzle.letters)
        allowedKeys.add('enter')
        allowedKeys.add('backspace')
        if (!allowedKeys.has(e.key.toLowerCase())) {
            e.preventDefault()
        }
        if (e.key === 'Backspace' && currentGuess.length <= 1 && guesses.length > 0) {
            e.preventDefault()
        }
        if (currentGuess.length >= 1 && [up, left, right, down].some(span => span.includes(e.key.toUpperCase()) && span.includes(currentGuess[currentGuess.length - 1].toUpperCase()))) {
            e.preventDefault()
        }
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
            </div>
            <div id='puzzle-container'>
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
                        {/* <PuzzleDrawing connections={connections}/> */}
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
            </div>
        </div>
    )
}

function letters_parse(letters) {
    const lettersArr = letters.toUpperCase().split('');
    const up = lettersArr.slice(0, 3);
    const right = lettersArr.slice(3, 6);
    const down = lettersArr.slice(6, 9).reverse();
    const left = lettersArr.slice(9).reverse();

    return { up, left, right, down }
}
