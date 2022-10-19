import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

export default function WordlePuzzle() {
    const puzzleId = useParams().wordleId
    console.log(puzzleId)
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
                setGuesses(data.guesses)
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

    return session ? (
        <h1>
            {JSON.stringify(session)}
        </h1>
    ) : null
}
