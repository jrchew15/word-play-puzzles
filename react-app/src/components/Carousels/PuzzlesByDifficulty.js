import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters } from "../WordGon/WordGonBox";

export default function PuzzlesByDifficulty({ difficulty }) {
    const [puzzles, setPuzzles] = useState([]);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordgons/difficulty/${difficulty}`);
            const data = await res.json()

            if (res.ok) {
                setPuzzles(data.puzzles)
            }
        })()
    }, [setPuzzles])

    return (
        <>
            <h2>{difficulty[0].toUpperCase() + difficulty.slice(1)} Puzzles</h2>
            <div id='pod-carousel' className="carousel">
                {puzzles.map(puzzle => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{puzzle.id} by {puzzle.user.username}</h3>
                        <div onClick={() => history.push(`/wordgons/${puzzle.id}`)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
