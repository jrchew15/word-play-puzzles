export function checkWordleGuess(word, guess) {
    let mutableWordArr = word.split('');
    let colors = new Array(5)
    for (let i = 0; i < 5; i++) {
        if (mutableWordArr[i] === guess[i]) {
            colors[i] = 'green';
            mutableWordArr[i] = null;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (!colors[i]) {
            if (mutableWordArr.includes(guess[i])) {
                colors[i] = 'yellow';
                mutableWordArr[mutableWordArr.indexOf(guess[i])] = null;
                continue
            }
            colors[i] = 'gray'
        }
    }
    return colors
}

export async function makeRandomWordle(history, setGuesses, setSession) {
    // first try table of wordles for an unopened puzzle
    const existingRes = await fetch('/api/wordles/random')
    if (existingRes.ok) {
        if (setSession) setSession(null)
        if (setGuesses) setGuesses([])
        const { id: wordleId } = await existingRes.json();
        history.push(`/wordles/${wordleId}`)
        return
    }

    const wordRes = await fetch('/api/words/random-wordle')

    if (wordRes.ok) {
        const { word } = await wordRes.json()

        const wordleRes = await fetch(`/api/wordles`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ newGuess: word })
        })

        if (wordleRes.ok) {
            if (setSession) setSession(null)
            if (setGuesses) setGuesses([])
            const { id: wordleId } = await wordleRes.json();
            history.push(`/wordles/${wordleId}`)
            return
        }
        history.push('/')
    }
    history.push('/')
}
