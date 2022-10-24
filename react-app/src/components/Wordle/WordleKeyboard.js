import './wordle-keyboard.css';

export default function WordleKeyboard({ word, guesses, currentGuess, setCurrentGuess, setSubmitting }) {
    let row1 = 'QWERTYUIOP';
    let row2 = 'ASDFGHJKL';
    let row3 = 'ZXCVBNM';

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

    function keyboardClickHandle(e) {
        if (e.target.className.includes('keyboard-letter') && currentGuess.length < 5) {
            setCurrentGuess(word => word + e.target.innerText)
        }
    }

    function enterKey(e) {
        if (currentGuess.length < 5) return
        setSubmitting(true)
    }

    function backspaceKey(e) {
        if (currentGuess.length > 0) setCurrentGuess(word => word.slice(0, word.length - 1))
    }

    return <div id='wordle-keyboard' onClick={keyboardClickHandle}>
        <div className="row 1">
            {row1.split('').map(char => (
                <div key={char.toLowerCase() + ',keyboard'} className={'keyboard-letter ' + (colorObj[char.toLowerCase()] || '')}>
                    {char}
                </div>
            ))}
        </div>
        <div className="row 2">
            {row2.split('').map(char => (
                <div key={char.toLowerCase() + ',keyboard'} className={'keyboard-letter ' + (colorObj[char.toLowerCase()] || '')}>
                    {char}
                </div>
            ))
            }
        </div >
        <div className="row 3">
            <div className="special-key" onClick={enterKey}>Enter</div>
            {row3.split('').map(char => (
                <div key={char.toLowerCase() + ',keyboard'} className={'keyboard-letter ' + (colorObj[char.toLowerCase()] || '')}>
                    {char}
                </div>
            ))}
            <div className="special-key" onClick={backspaceKey}><i className="fas fa-backspace" /></div>
        </div >
    </div >
}
