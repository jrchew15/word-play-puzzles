export async function wordGonStats(userId) {
    const res = await fetch(`/api/users/${userId}/wordgon_stats`)
    if (res.ok) {
        return await res.json()
    }
    return null
}

export async function wordleStats(userId) {
    const res = await fetch(`/api/users/${userId}/wordle_stats`)
    if (res.ok) {
        return await res.json()
    }
    return null
}
