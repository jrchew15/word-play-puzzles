import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function WordleWonModalContent({ wordle_id }) {
    const [puzzleSession, setPuzzleSession] = useState(null);
    const [globalStats, setGlobalStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [userStatsStyles, setUserStatsStyles] = useState(null);

    const user = useSelector(state => state.session.user);
    useEffect(() => {
        (async () => {
            if (!puzzleSession) {
                (async () => {
                    let sesh = await fetch(`/api/wordles/${wordle_id}/sessions/current`);
                    if (sesh.ok) {
                        sesh = await sesh.json();
                        setPuzzleSession(sesh);
                    }
                })()
                return
            }
            const res = await fetch(`/api/wordles/${wordle_id}/stats`);
            if (res.ok) {
                const body = await res.json()
                let min = Math.min(...Object.keys(body).map(n => +n || Infinity));
                body.min = min;
                setGlobalStats(body);
            }
            const res2 = await fetch(`/api/users/${user.id}/wordle_stats`);
            if (res2.ok) {
                const body2 = await res2.json()
                delete body2['average']
                setUserStats(body2)
                let max = Math.max(...Object.values(body2));
                const styles = {}
                for (let i = 1; i <= 6; i++) {
                    if (body2[i]) {
                        let width = Math.round(100 * body2[i] / max) + '%';
                        styles[i] = { width }
                    } else {
                        styles[i] = { display: 'none' }
                    }
                }
                setUserStatsStyles(styles)
            }
        })()
    }, [user, setGlobalStats, setUserStats, puzzleSession])

    return (globalStats && userStats && userStatsStyles && <div>
        <h3>Congratulations!</h3>
        <p>You used {puzzleSession.num_guesses} out of 6 words, compared to the global average of {globalStats.average} guesses</p>
        {globalStats['total'] > 1 && (<p>{globalStats[globalStats.min]} {globalStats[globalStats.min] === 1 ? 'user' : 'users'} found the word in {globalStats.min} guesses</p>)}
        <div id='modal-stats-separator' />
        < ul id={'modal-stats'} >
            <h4>Your Wordle Stats:</h4>
            {
                [6, 5, 4, 3, 2, 1].map(num => (<li key={num} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', position: 'relative' }}>
                    <span>{num}:</span>
                    <div className={'statbar' + (puzzleSession.num_guesses === num ? ' relevant' : '')} style={userStatsStyles[num]} />
                    <span >{userStats[num]}</span>
                </li>)
                )
            }
        </ul >
    </div >)
}
