import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters, DetailsByStatus } from "../WordGon/WordGonBox";
import { color_dict, puzzleDifficulty } from "../../utils/puzzleFunctions";
import '../WordGon/wordgon-list.css';

export default function PuzzlesOfTheDay({ setLoaded }) {
    const [puzzles, setPuzzles] = useState([])
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/wordgons/puzzles_of_the_day');
            const data = await res.json()

            if (res.ok) {
                setPuzzles(data.puzzles)
                setLoaded(true)
            }
        })()
    }, [setPuzzles])

    return (
        <>
            {puzzles.length > 0 && <div id='the-pod'>
                <h2 style={{ color: 'whitesmoke' }}>Today's Puzzle:</h2>
                <div className="puzzle-card" onClick={() => history.push(`/wordgons/${puzzles[0].id}`)} >
                    <div className='puzzle-title' >
                        <span style={{ margin: '5px 0' }}>{parseDate(puzzles[0].puzzleDay)}</span>
                    </div>
                    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ListableBoxAndLetters letters={puzzles[0].letters} puzzleId={puzzles[0].id} />
                        <DetailsByStatus puzzleId={puzzles[0].id} />
                    </div>
                </div>
            </div>}
            <h2>Past Puzzles of the Day</h2>
            <div id='pod-carousel' className="carousel">
                {puzzles.slice(1).map(puzzle => (
                    <div className='puzzle-card' onClick={() => history.push(`/wordgons/${puzzle.id}`)} >
                        {/* <h3>{puzzle.puzzleDay}</h3> */}
                        <div className='puzzle-title' style={{ backgroundColor: color_dict[puzzleDifficulty(puzzle)] }}>
                            <span style={{ margin: '5px 0' }}>{parseDate(puzzle.puzzleDay)}</span>
                        </div>
                        <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} difficulty={puzzleDifficulty(puzzle)} />
                            <DetailsByStatus puzzleId={puzzle.id} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )

}

export function parseDate(date) {
    const dateObj = new Date(...date.split('-'));
    const months = {
        '1': 'Jan',
        '2': 'Feb',
        '3': 'Mar',
        '4': 'Apr',
        '5': 'May',
        '6': 'Jun',
        '7': 'Jul',
        '8': 'Aug',
        '9': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    }
    // return dateObj.toUTCString().slice(0, 17)
    return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}
