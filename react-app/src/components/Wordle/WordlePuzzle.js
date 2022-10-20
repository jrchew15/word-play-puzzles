import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import WordleRow from "./WordleRow";
import './wordle-puzzle.css';

export default function WordlePuzzle() {
    const puzzleId = useParams().wordleId
    let history = useHistory();

    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    const [showInvalidWord, setShowInvalidWord] = useState(false)

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

            // NEED TO CHECK WORD VALIDITY

            // update session
            const res = await fetch(`/api/wordles/${puzzleId}/sessions/${session.id}`, {
                method: 'PUT',
                header: { 'Content-Type': 'application/json' },
                body: { newGuess: currentGuess.toLowerCase() }
            })

            if (res.ok) {
                setGuesses(arr => arr.push(currentGuess.toLowerCase()))
                setCurrentGuess('')
            }
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

    return session ? (
        <div id='wordle-page'>
            <div id='wordle-topbar'>

            </div>
            <div id='wordle-rows'>
                {guesses.map(guess => <WordleRow guess={guess} word={puzzle.word} />)}
                <WordleRow word={puzzle.word} />
                <WordleRow word={puzzle.word} />
                <WordleRow word={puzzle.word} />
                <WordleRow word={puzzle.word} />
                <WordleRow word={puzzle.word} />
                <WordleRow word={puzzle.word} />
            </div>
            <form id='wordle-form' onSubmit={handleSubmit}>
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
            </form>
        </div>
    ) : null
}
