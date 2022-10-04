export async function checkWordsTable(word) {

    const res = await fetch(`/api/words/${word}`);
    const data = await res.json()

    return res.ok
    // if (res.ok) {
    //     return true
    // }
    // const { key, host } = await res.json()

    // const api_check = await checkWordsAPI(word, key, host)

    // return api_check
}
