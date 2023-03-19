import { useState, useEffect } from 'react'
import { checkWordleGuess } from './wordleFunctions'
import './row.css'
import './wordle-animation.css'

export function EmptyRow() {

    return <div className="wordle-row" >
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
    </div >
}

export function CurrentRow({ guess }) {

    // squares extends guess to create empty slots when fewer than 5 characters in guess
    let squares = new Array(5).fill(null);
    for (let i = 0; i < guess.length; i++) {
        squares[i] = guess[i]
    }
    return <div className='wordle-row'>
        {squares.map((char, i) => (
            <div className='wordle-letter blank' key={`empty,current,${i}`}>{char}</div>
        ))}
    </div>
}

export function AnimatedRow({ guess, word, row }) {
    let colors = checkWordleGuess(word, guess);
    const [aninumber, setAninumber] = useState(-1);

    // will be called onAnimationEnd of previous letter
    function sequenceAnimation(e) {
        if (aninumber <= 3) {
            setAninumber(num => num + 1)
            return
        }
    }

    useEffect(() => {
        setAninumber(0)
    }, [])

    return <div className='wordle-row' >
        {guess.split('').map((char, i) => (i <= aninumber ?
            <div
                className={`wordle-letter ${colors[i]} animated`}
                onAnimationEnd={sequenceAnimation}
                key={`${row},${i}`}
            >
                {char.toUpperCase()}
            </div>
            : <div className='wordle-letter blank' key={`empty${row},${i}`} />
        ))}
    </div>
}
