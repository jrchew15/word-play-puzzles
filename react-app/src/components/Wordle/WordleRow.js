import('./row.css')

export default function WordleRow({ guess, word }) {
    let mutableWordArr = word.split('');
    let colors = new Array(5)
    if (guess) {
        for (let i = 0; i < 5; i++) {
            if (mutableWordArr[i] === guess[i]) {
                colors[i] = 'green';
                mutableWordArr[i] = null;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (mutableWordArr[i]) {
                colors[i] = mutableWordArr.includes(guess[i]) ? 'yellow' : 'gray'
            }
        }
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
