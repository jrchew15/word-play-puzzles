import { useState, useEffect } from "react"

export default function AllWordGons() {
    const [puzzles, setPuzzles] = useState([]);

    useEffect(() => {
        (async () => {
            let res = await fetch('/api/wordgons');
            if (res.ok) {
                let data = await res.json()
                setPuzzles(data)
            }
        })()
    })

    return (
        <ul>
            {puzzles.map((puzzle) => (<li>
                {puzzle.id} {puzzle.letters}
            </li>))}
        </ul>
    )
}
