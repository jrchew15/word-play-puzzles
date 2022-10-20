import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import { checkWordsTable } from "../../utils/wordChecks";
import WordleRow, { CurrentRow } from "./WordleRow";
import WordleKeyboard from "./WordleKeyboard";
import './wordle-puzzle.css';

export default function WordlePuzzle() {
    const puzzleId = useParams().wordleId
    let history = useHistory();

    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    const [showInvalidWord, setShowInvalidWord] = useState(false)

    const [errors, setErrors] = useState([])

    const [session, setSession] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showFailModal, setShowFailModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const formRef = useRef(null);

    const [puzzle, setPuzzle] = useState(null)

    //find puzzle
    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/wordles/${puzzleId}`);

            if (res.ok) {
                let data = await res.json()
                setPuzzle(data)
                return
            }
            history.push('/404')
        })()
    }, [puzzleId, setPuzzle])

    //find session
    useEffect(() => {
        (async () => {
            if (!puzzle) return
            const res = await fetch(`/api/wordles/${puzzleId}/sessions/current`)
            const data = await res.json()

            if (res.ok) {
                setSession(data)
                return
            }

            if (data.errors.includes('session not found')) {

                // If no session found, create a session
                const newRes = await fetch(
                    `/api/wordles/${puzzleId}/sessions`,
                    { method: 'POST' }
                );
                const newData = await newRes.json();
                setSession(newData)
                return
            }
            history.push('/404')

        })()
    }, [puzzle, puzzleId])

    useEffect(() => {
        if (session && session.guesses.length) {
            setGuesses(session.guesses.split(','))
        }
    }, [session])

    useEffect(() => {
        if (!submitting) return

        (async () => {

            // check word validity
            const valid = await checkWordsTable(currentGuess)

            if (valid) {
                // update session
                const res = await fetch(`/api/wordles/${puzzleId}/sessions/${session.id}`, {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ newGuess: currentGuess.toLowerCase() })
                })

                if (res.ok) {
                    setGuesses(arr => [...arr, currentGuess.toLowerCase()])
                    setCurrentGuess('')
                } else {
                    let errData = await res.json();

                    setErrors(errData.errors);
                    setTimeout(() => { setErrors([]) }, 3000);
                }
            } else {
                // if invalid word, display error for 3 seconds
                setShowInvalidWord(true)
                setTimeout(() => { setShowInvalidWord(false) }, 3000)
            }

            // end submission timeout in all cases
            setSubmitting(false)
        })()

    }, [submitting])

    if (!puzzle) return null


    function handleSubmit(e) {
        e.preventDefault();

        setSubmitting(true)
    }

    function handleChange(e) {
        setCurrentGuess(e.target.value)
    }

    function handleKey(e) {
        if (e.key === 'Enter' && currentGuess.length === 5) return
        e.preventDefault();

        if (e.key.length === 1 && e.key.match(/[a-z]/i) && currentGuess.length < 5) {
            setCurrentGuess(currentGuess + e.key.toUpperCase());
            return
        }
        if (e.key === 'Backspace' && currentGuess.length > 0) {
            setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
        }
    }

    let emptyRows = guesses.length < 6 ? new Array(5 - guesses.length).fill(null) : []

    return session ? (
        <div id='wordle-page'>
            <div id='wordle-topbar'>

            </div>
            <div id='wordle-rows'>
                {guesses.map(guess => <WordleRow guess={guess} word={puzzle.word} />)}
                <CurrentRow guess={currentGuess} word={puzzle.word} />
                {emptyRows.map(empty => <WordleRow word={puzzle.word} />)}
            </div>
            {!session.completed && <form id='wordle-form' onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='wordle'
                    onChange={handleChange}
                    onKeyDown={handleKey}
                    autoFocus
                    autoComplete="off"
                    ref={formRef}
                    value={currentGuess}
                />
            </form>}
            {errors.length > 0 && <div>
                {errors.map(err => <span>{err}</span>)}
            </div>
            }
            <WordleKeyboard word={puzzle.word} guesses={guesses} />
        </div>
    ) : null
}
