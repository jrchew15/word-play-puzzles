

export async function checkWordsAPI(word) {
    console.log('------in api check--------')
    let res
    try {

        res = await fetch(`https://wordsapiv1.p.mashape.com/words/${word}/frequency`, {
            method: 'GET',
            headers: {
                "X-Mashape-Key": "2d33b23feamshceed8e99269aaa0p10f47fjsn0d99b218466f",
                "Content-Type": 'application/json',
                "Accept": "application/json"
            }
        });
        res = unirest.get("https://wordsapiv1.p.mashape.com/words/apartment/frequency")
            .header("X-Mashape-Key", "<required>")
            .header("Accept", "application/json")
            .end(function (result) {
                console.log(result.status, result.headers, result.body);
            });
    } catch (e) {
        console.log(e)
    }
    return false
    console.log('------after api fetch check--------')
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
    console.log('------before api check--------')
    const api_check = await checkWordsAPI(word)
    console.log('------after api check--------')
    return api_check
}
