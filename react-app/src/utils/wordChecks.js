export async function checkWordsAPI(word, key, host) {
    console.log('------in api check--------', console.log(process.env))

    const res = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/frequency`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': host
        }
    });
    const data = await res.json()
    console.log('------after api fetch check--------', data)
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
    console.log('------before table check--------')
    const res = await fetch(`/api/words/${word}`)
    console.log('------after table check--------')
    if (res.ok) {
        return true
    }
    const { key, host } = await res.json()
    console.log('------before api check--------')
    const api_check = await checkWordsAPI(word, key, host)
    console.log('------after api check--------')
    return api_check
}
