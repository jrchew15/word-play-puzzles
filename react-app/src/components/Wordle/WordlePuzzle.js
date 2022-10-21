import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import { checkWordsTable } from "../../utils/wordChecks";
import WordleRow, { CurrentRow } from "./WordleRow";
import WordleKeyboard from "./WordleKeyboard";
import WordleLoader from "./WordleLoader";
import { Modal } from "../../context/Modal";
import { makeRandomWordle } from "./wordleFunctions";
import './wordle-puzzle.css';

export default function WordlePuzzle() {
    const puzzleId = useParams().wordleId
    let history = useHistory();

    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')

    const [errors, setErrors] = useState([])
    const [completed, setCompleted] = useState(false)

    const [session, setSession] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [won, setWon] = useState(false)
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
                setCompleted(data.completed)
                return
            }

            if (data.errors.includes('session not found')) {

                // If no session found, create a session
                const newRes = await fetch(
                    `/api/wordles/${puzzle.id}/sessions`,
                    { method: 'POST' }
                );
                const newData = await newRes.json();
                setSession(newData)
                return
            }
            history.push('/404')

        })()
    }, [puzzle])

    useEffect(() => {
        if (session && session.guesses.length) {
            let guessArr = session.guesses.split(',')
            setGuesses(guessArr)
            console.log('won?', session.completed && guessArr[guessArr.length - 1] === puzzle.word)
            setWon(session.completed && guessArr[guessArr.length - 1] === puzzle.word)
        }
    }, [session])

    useEffect(() => {
        if (!submitting || !formRef) return

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
                    let data = await res.json()
                    setGuesses(arr => [...arr, currentGuess.toLowerCase()])
                    setCurrentGuess('')
                    if (data.completed) {
                        setCompleted(true)
                    }
                } else {
                    let errData = await res.json();
                    setErrors(errData.errors);
                    setTimeout(() => { setErrors([]) }, 2000);
                }
            } else {
                // if invalid word, display error for 3 seconds
                setErrors(['Not a valid word'])
                setTimeout(() => { setErrors([]) }, 2000)
            }

            // end submission timeout in all cases
            setSubmitting(false)
        })()

    }, [submitting])

    useEffect(() => {
        if (!completed) return
        setWon(guesses[guesses.length - 1] === puzzle.word);
        setShowModal(true)
    }, [completed])

    if (!puzzle) return null


    function handleSubmit(e) {
        e.preventDefault();

        setSubmitting(true)
    }

    function handleChange(e) {
        setCurrentGuess(e.target.value)
    }

    function handleKey(e) {
        if (e.ctrlKey) {
            if (e.key.toLowerCase() === 'v') e.preventDefault()
            return
        }
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

    function focusForm(e) {
        if (formRef?.current) {
            formRef.current.focus()
        }
    }

    let emptyRows = guesses.length < 6 ? new Array(5 - guesses.length).fill(null) : []

    return session ? (
        <div id='wordle-page' onClick={focusForm}>
            <h2 style={{ color: 'white', position: 'absolute', left: 50, top: 50 }}>Wordle</h2>
            <div id='wordle-rows'>
                {session.completed && !won && <div id='wordle-lost-display'>{puzzle.word.toUpperCase()}</div>}
                {guesses.map(guess => <WordleRow guess={guess} word={puzzle.word} />)}
                {guesses.length < 6 && <CurrentRow guess={currentGuess} word={puzzle.word} />}
                {emptyRows.map(empty => <WordleRow word={puzzle.word} />)}
            </div>
            <div id='wordle-message-container'>
                <div id='wordle-errors' className={errors.length > 0 ? 'on' : 'off'}>
                    {errors.map(err => <span>{err}</span>)}
                </div>
                {submitting && !errors.length && <WordleLoader />}
            </div>
            {!completed && <form id='wordle-form' onSubmit={handleSubmit}>
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
            <WordleKeyboard word={puzzle.word} guesses={guesses} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} setSubmitting={setSubmitting} />
            <EndModal />
        </div>
    ) : null

    function EndModal() {

        return showModal && (
            <Modal onClose={() => setShowModal(false)}>
                <div id='complete-modal'>
                    {won ? <>
                        <h2>Congratulations!</h2>
                        <span> {`You used ${guesses.length} out of 6 guesses!`}</span>
                    </> : <>
                        <h2>Sorry!</h2>
                        <span>{`you ran out of guesses. The word was "${puzzle.word.toUpperCase()}"`}</span>
                    </>}
                    <div id='wordle-buttons'>
                        <button className="modal-button" onClick={() => { history.push('/') }}>Back to puzzles</button>
                        <button className="modal-button" onClick={() => { setShowModal(false); makeRandomWordle(history, setGuesses, setSession) }}>Random Wordle</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
