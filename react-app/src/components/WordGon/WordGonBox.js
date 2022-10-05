import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { color_dict } from "../../utils/puzzleFunctions";

import LetterLine from "./LetterLine";

import './lines.css';

export function BoxAndLetters({ letters, guesses, currentGuess }) {
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

    return (
        <>
            <div id='puzzle-container'>
                {letters.split('').map((x, idx) => (
                    <>
                        <span className={letterClasses[idx] + ' letter ' + letterColor(x)} key={'letter' + x + idx}>{x.toUpperCase()}</span>
                        <div className={letterClasses[idx] + ' circle ' + usedLetter(x)} key={'circle' + x + idx} />
                    </>
                ))}
                <div id='puzzle-square'>
                    {currentGuess.length > 1 && <LetterLine letters={letters} twoLetters={currentGuess.slice(currentGuess.length - 2)} />}
                </div>
            </div>
        </>
    )
}

export function ListableBoxAndLetters({ letters, puzzleId, difficulty }) {
    let letterClasses = ['u1', 'u2', 'u3', 'r1', 'r2', 'r3', 'd1', 'd2', 'd3', 'l1', 'l2', 'l3'];
    const history = useHistory()

    const wordgons = useSelector(state => state.wordgon)

    return (
        <>
            <div id='puzzle-container' className="puzzle-list" onClick={PuzzleRedirect} style={{ fontSize: '3.5px', backgroundColor: color_dict[difficulty], cursor: 'pointer' }}>
                {letters.split('').map((x, idx) => (
                    <>
                        <span className={letterClasses[idx] + ' letter'} key={'letter' + x + idx} style={{ color: 'black' }}>{x.toUpperCase()}</span>
                        <div className={letterClasses[idx] + ' circle'} key={'circle' + x + idx} />
                    </>
                ))}
                <div id='puzzle-square' />
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
    const status = wordgons[puzzleId]?.completed
    if (status === undefined || status === null) {
        return <button className="list-button" onClick={PuzzleRedirect}>
            Start
        </button>
    }
    if (status === 'complete') {
        return <button className="list-button" onClick={PuzzleRedirect}>
            See Comments or Retry
        </button>
    }
    return <button className="list-button" onClick={PuzzleRedirect}>
        Continue Puzzle
    </button>
    function PuzzleRedirect(e) {
        history.push(`/wordgons/${puzzleId}`)
    }
}
