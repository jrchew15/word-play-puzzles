import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function WordleTodayRedirect() {
    const now = new Date();
    let dateString = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');

    const [wordle, setWordle] = useState(null)

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordles/by_date/${dateString}`)

            const data = await res.json()
            setWordle(data)
        })()
    }, [])

    return wordle ? <Redirect to={`/wordles/${wordle.id}`} /> : null
}
