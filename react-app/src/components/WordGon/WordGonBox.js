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
                <div id='puzzle-square' />
            </div>
        </>
    )
}

export function ListableBoxAndLetters({ letters, puzzleId }) {
    let letterClasses = ['u1', 'u2', 'u3', 'r1', 'r2', 'r3', 'd1', 'd2', 'd3', 'l1', 'l2', 'l3'];

    const color_dict = {
        '0': '#f06868',
        '1': '#fab57a',
        '2': '#edf798',
        '3': '#80d6ff',
        '4': '#118a73',
        '5': '#7c73e6'
    }

    return (
        <>
            <div id='puzzle-container' style={{ fontSize: '3.5px', backgroundColor: color_dict[puzzleId % 6], margin: '5px' }}>
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
}
