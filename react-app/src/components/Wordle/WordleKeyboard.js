import './wordle-keyboard.css';

export default function WordleKeyboard({ word, guesses }) {
    let row1 = 'qwertyuiop'.toUpperCase();
    let row2 = 'asdfghjkl'.toUpperCase();
    let row3 = 'zxcvbnm'.toUpperCase();

    let colorObj = {};

    for (let guess of guesses) {
        let mutableWordArr = word.split('');
        for (let i = 0; i < 5; i++) {
            if (mutableWordArr[i] === guess[i]) {
                colorObj[guess[i]] = 'green';
                mutableWordArr[i] = null;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (colorObj[guess[i]]) continue
            if (mutableWordArr[i] !== 'green' || mutableWordArr[i] !== 'yellow') {
                colorObj[guess[i]] = mutableWordArr.includes(guess[i]) ? 'yellow' : 'gray';
            }
        }
    }

    console.log(colorObj)

    return <div id='wordle-keyboard'>
        <div className="row 1">
            {row1.split('').map(char => (
                <div className={`keyboard-letter ${colorObj[char.toLowerCase()]}`}>
                    {char}
                </div>
            ))}
        </div>
        <div className="row 2">
            {row2.split('').map(char => (
                <div className={`keyboard-letter ${colorObj[char.toLowerCase()]}`}>
                    {char}
                </div>
            ))}
        </div>
        <div className="row 3">
            <div className="keyboard-letter special-key">Enter</div>
            {row3.split('').map(char => (
                <div className={`keyboard-letter ${colorObj[char]}`}>
                    {char}
                </div>
            ))}
            <div className="keyboard-letter special-key">Backspace</div>
        </div>
    </div>
}
