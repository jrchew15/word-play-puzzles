import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import './wordgon.css';

export default function Puzzle() {
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


    if (!puzzle) return null

    const { up, left, right, down } = letters_parse(puzzle.letters);

    return (
        <div id='puzzle-container'>
            <div id='up-letters' className="letters">{up.map(x => <span>{x}</span>)}</div>
            <div id='puzzle-middle'>
                <div id='left-letters' className="letters">{left.map(x => <span>{x}</span>)}</div>
                <div id='puzzle-square'>I'm a puzzle</div>
                <div id='right-letters' className="letters">{right.map(x => <span>{x}</span>)}</div>
            </div>
            <div id='down-letters' className="letters">{down.map(x => <span>{x}</span>)}</div>
        </div>
    )
}

function letters_parse(letters) {
    const lettersArr = letters.split('');
    const up = lettersArr.slice(0, 3);
    const right = lettersArr.slice(3, 6);
    const down = lettersArr.slice(6, 9).reverse();
    const left = lettersArr.slice(9).reverse();

    return { up, left, right, down }
}
