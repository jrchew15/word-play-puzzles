import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { color_dict } from "../../utils/puzzleFunctions";

import LineMaker, { AnimatedLineMaker2 } from "./LineMaker";

import './lines.css';
import './gridareas.css';
import './wordgon.css';

export function BoxAndLetters({ letters, guesses, currentGuess, backgroundColor, animating, setAnimating }) {
    let letterClasses = ['u1', 'u2', 'u3', 'r1', 'r2', 'r3', 'd1', 'd2', 'd3', 'l1', 'l2', 'l3'];

    function usedLetter(char) {
        return guesses.join('').includes(char) || currentGuess.includes(char) ? 'used' : ''
    }

    function activeLetter(char) {
        let n = currentGuess.length
        return n > 0 && currentGuess[n - 1] === char ? 'active-letter' : ''
    }

    function letterColor(char) {
        return activeLetter(char) || usedLetter(char)
    }

    // const [animating, setAnimating] = useState(false)

    return (
        <div id='puzzle-container'>
            {letters.split('').map((x, idx) => (
                <span className={letterClasses[idx] + ' letter ' + letterColor(x)} key={'letter' + x + idx}>{x.toUpperCase()}</span>
            ))}
            {letters.split('').map((x, idx) => (
                <div className={letterClasses[idx] + ' circle ' + usedLetter(x)} key={'circle' + x + idx} style={{ backgroundColor: usedLetter(x) ? backgroundColor : 'white' }} />
            ))}
            <div id='puzzle-square'>
                <LineMaker allLetters={letters} guesses={guesses} currentGuess={currentGuess} backgroundColor={backgroundColor} />
                {animating && <AnimatedLineMaker2 allLetters={letters} currentGuess={currentGuess} setAnimating={setAnimating} />}
            </div>
        </div>
    )
}

export function ListableBoxAndLetters({ letters, puzzleId, difficulty }) {
    let letterClasses = ['u1', 'u2', 'u3', 'r1', 'r2', 'r3', 'd1', 'd2', 'd3', 'l1', 'l2', 'l3'];
    const history = useHistory();
    let showLines = false;
    let session = null;

    const wordgons = useSelector(state => state.wordgon)
    for (let sessionId in wordgons) {
        if (wordgons[sessionId].puzzleId === puzzleId) {
            showLines = true;
            session = wordgons[sessionId]
            break
        }
    }

    return (
        <>
            <div id='puzzle-container' className="puzzle-list" onClick={PuzzleRedirect} style={{ fontSize: '3.5px', backgroundColor: color_dict[difficulty], cursor: 'pointer' }}>
                {letters.split('').map((x, idx) => (
                    <span className={letterClasses[idx] + ' letter'} key={puzzleId + 'letter' + x} style={{ color: 'black' }}>{x.toUpperCase()}</span>
                ))}
                {letters.split('').map((x, idx) => (
                    <div className={letterClasses[idx] + ' circle'} key={puzzleId + 'circle' + x} />
                ))}
                <div id='puzzle-square' >
                    {showLines && <LineMaker allLetters={letters} guesses={session.guesses.split(',')} currentGuess={''} backgroundColor={color_dict[difficulty]} />}
                </div>
            </div>
        </>
    )

    function PuzzleRedirect(e) {
        history.push(`/wordgons/${puzzleId}`)
    }
}

export function DetailsByStatus({ puzzleId }) {
    const wordgons = useSelector(state => state.wordgon);
    const history = useHistory()

    const [session, setSession] = useState(null);

    useEffect(() => {
        setSession(Object.values(wordgons).find(ele => ele.puzzleId === puzzleId));
    }, [puzzleId, wordgons])

    if (!session) {
        return <button className="list-button" onClick={PuzzleRedirect}>
            Start
        </button>
    }

    if (session.completed) {
        return <button className="list-button" onClick={PuzzleRedirect}>
            Play Again
        </button>
    }
    return <button className="list-button" onClick={PuzzleRedirect}>
        Continue Puzzle
    </button>
    function PuzzleRedirect(e) {
        history.push(`/wordgons/${puzzleId}`)
    }
}
