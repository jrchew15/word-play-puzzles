import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function OneWordGon() {
    const puzzleId = useParams().wordgonId
    const [puzzle, setPuzzle] = useState(null)

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

    if (!puzzle) {
        return null
    }

    return (
        <>
            <h2>Made By {puzzle.user.username}</h2>
            {puzzle.letters.split('').map(char => (
                <div style={{ fontSize: 20 }}>
                    {char.toUpperCase()}
                </div>
            ))}
        </>
    )
}
