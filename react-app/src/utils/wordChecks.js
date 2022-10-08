export async function checkWordsTable(word) {

    const res = await fetch(`/api/words/${word}`);
    // const data = await res.json()

    return res.ok
}
