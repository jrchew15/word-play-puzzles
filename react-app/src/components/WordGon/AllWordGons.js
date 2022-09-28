import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function AllWordGons() {
    const [puzzles, setPuzzles] = useState([]);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            let res = await fetch('/api/wordgons');
            if (res.ok) {
                let data = await res.json()
                setPuzzles(data.puzzles)
            }
        })()
    }, [])

    return (
        <ul>
            {puzzles.map((puzzle) => (<li>
                <span onClick={() => history.push(`/wordgons/${puzzle.id}`)} style={{ cursor: 'pointer' }}>{puzzle.id} {puzzle.letters}</span>
            </li>))}
        </ul>
    )
}
