export async function checkWordsAPI(word, key, host) {
    const res = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/frequency`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': host
        }
    });

    if (res.ok) {
        await fetch(`/api/words`, {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({ word: word })
        })
        return true
    }
    return false
}

export async function checkWordsTable(word) {

    const res = await fetch(`/api/words/${word}`)

    if (res.ok) {
        return true
    }
    const { key, host } = await res.json()

    const api_check = await checkWordsAPI(word, key, host)

    return api_check
}
