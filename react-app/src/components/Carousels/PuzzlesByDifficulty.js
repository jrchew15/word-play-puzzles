import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters, DetailsByStatus } from "../WordGon/WordGonBox";
import { color_dict } from '../../utils/puzzleFunctions';

export default function PuzzlesByDifficulty({ difficulty, loaded, setLoaded }) {
    const [puzzles, setPuzzles] = useState([]);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordgons/difficulty/${difficulty}`);
            const data = await res.json()

            if (res.ok) {
                setPuzzles(data.puzzles)
                setLoaded(true)
            }
        })()
    }, [setPuzzles])

    return (
        <>
            <h2>{difficulty[0].toUpperCase() + difficulty.slice(1)} Puzzles</h2>
            <div id='pod-carousel' className="carousel">
                {puzzles.map(puzzle => (
                    <div className='puzzle-card' onClick={() => history.push(`/wordgons/${puzzle.id}`)} >
                        <div className='puzzle-title' style={{ backgroundColor: color_dict[difficulty] }}>Word-Gon #{puzzle.id}</div>
                        <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} difficulty={difficulty} />
                            <span style={{ margin: '5px 0 0 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '180px' }}>Puzzle made by {puzzle.user.username}</span>
                            <DetailsByStatus puzzleId={puzzle.id} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
