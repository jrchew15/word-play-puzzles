import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { checkWordsTable } from "../../utils/wordChecks";
import { lettersParse } from "../../utils/puzzleFunctions";
import StartPuzzleModal from "./StartPuzzleModal";
import { BoxAndLetters } from "./WordGonBox";
import CompleteModal from "./CompletedModal";
import CommentsContainer from "../Comments/CommentsContainer";

import './wordgon.css';

export default function UnregisteredPuzzle() {
    const puzzleId = useParams().wordgonId
    const history = useHistory();
    const [puzzle, setPuzzle] = useState(null)

    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState('')
    const [completed, setCompleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const today_date = new Date();

    console.log('UNREGISTERED')
    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/wordgons/${puzzleId}`);
            let data = await res.json();

            if (res.ok) {
                let puzzleDate = data.puzzleDay

                let [year, month, day] = puzzleDate.split('-')
                let isToday = day != today_date.getDate() || month != today_date.getMonth() + 1 || year != today_date.getFullYear();
                if (isToday) {
                    history.push('/')
                }

                setPuzzle(data)
                return
            }
        })()
    }, [puzzleId])

    // Submission of new guess happens in useEffect triggered by submitting boolean
    useEffect(() => {
        // break useEffect if running on initial render
        if (!submitting) {
            if (completed) { /* Tell a user they won */ }
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
                setGuesses(allGuesses)
                setCurrentGuess(word => word[word.length - 1])
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
            <div id='session-container'>
                {/* <StartPuzzleModal showModal={showModal} setShowModal={setShowModal} puzzleId={puzzleId} />
                {session && <CompleteModal numGuesses={guesses.length} numAttempts={puzzle.numAttempts} commentsRef={commentsRef} showModal={showModal} setShowModal={setShowModal} completed={session.completed} />} */}
                <div id='guesses-container'>
                    <div>
                        <img src={puzzle.user.profilePicture} alt={puzzle.user.username} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                        Made By {puzzle.user.username}
                        <div>
                            {puzzle.numAttempts - guesses.length} words remaining
                        </div>
                    </div>
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
                            id='guess-box'
                            autoFocus
                        >
                        </input>
                    </form>
                    <div style={{ display: submitting ? 'flex' : 'none' }}> Submitting ...</div>
                    {
                        guesses.map((word, idx) => (
                            word.length > 0 && <div key={word}>
                                {word}
                            </div>
                        ))
                    }
                    <button onClick={deleteHandler}>Start Over?</button>
                </div>
                <BoxAndLetters letters={puzzle.letters} guesses={guesses} currentGuess={currentGuess} />
            </div >
            {/* <div style={{ display: (session && session.completed) ? 'flex' : 'none' }}>
                <CommentsContainer puzzleId={puzzleId} commentsRef={commentsRef} />
            </div> */}
        </>
    )
}