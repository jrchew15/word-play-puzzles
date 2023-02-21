import { useState, useEffect } from 'react';
import PuzzleCarousel from './PuzzleCarousel';

export default function PuzzlesByDifficulty({ difficulty, loaded, setLoaded }) {
    const [puzzles, setPuzzles] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordgons/difficulty/${difficulty}`);
            const data = await res.json()

            if (res.ok) {
                setPuzzles(data.puzzles)
                setLoaded(true)
            }
        })()
    }, [setPuzzles, difficulty, setLoaded])

    return (
        <>
            <h2>{difficulty[0].toUpperCase() + difficulty.slice(1)} Puzzles</h2>
            <PuzzleCarousel puzzles={puzzles} />
        </>
    )
}
