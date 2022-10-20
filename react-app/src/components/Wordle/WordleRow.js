import { checkWordleGuess } from './wordleFunctions'
import './row.css'

export default function WordleRow({ guess, word }) {
    let colors
    if (guess) {
        colors = checkWordleGuess(word, guess)
    }

    return <div className="wordle-row">
        {guess ? guess.split('').map((char, i) => (
            <div className={`wordle-letter ${colors[i]}`}>{char.toUpperCase()}</div>
        )) : (<>
            <div className="wordle-letter blank"></div>
            <div className="wordle-letter blank"></div>
            <div className="wordle-letter blank"></div>
            <div className="wordle-letter blank"></div>
            <div className="wordle-letter blank"></div>
        </>)
        }
    </div>
}

export function CurrentRow({ guess, word }) {
    let squares = new Array(5).fill(null);
    for (let i = 0; i < guess.length; i++) {
        squares[i] = guess[i]
    }
    return <div className='wordle-row'>
        {squares.map(char => (
            <div className='wordle-letter blank'>{char}</div>
        ))}
    </div>
}
