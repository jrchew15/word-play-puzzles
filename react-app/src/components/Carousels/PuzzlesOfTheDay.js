import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters } from "../WordGon/WordGonBox";

export default function PuzzlesOfTheDay() {
    const [puzzles, setPuzzles] = useState([])
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/wordgons/puzzles_of_the_day');
            const data = await res.json()

            if (res.ok) {
                setPuzzles(data.puzzles)
            }
        })()
    }, [])

    return (
        <>
            <h2>Today's Puzzle:</h2>
            {puzzles.length > 0 && <div id='the-pod' onClick={() => history.push(`/wordgons/${puzzles[0].id}`)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3>{puzzles[0].puzzleDay}</h3>
                <ListableBoxAndLetters letters={puzzles[0].letters} puzzleId={puzzles[0].id} />
            </div>}
            <h2>Past Puzzles of the Day</h2>
            <div id='pod-carousel' className="carousel">
                {puzzles.slice(1).map(puzzle => (
                    <div onClick={() => history.push(`/wordgons/${puzzle.id}`)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>{puzzle.puzzleDay}</h3>
                        <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} />
                    </div>
                ))}
            </div>
        </>
    )
}
