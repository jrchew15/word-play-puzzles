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
            // refetch session to ensure db has updated
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

            // after session is fetched, fetch stats
            const resGlobalStats = await fetch(`/api/wordles/${wordle_id}/stats`);
            if (resGlobalStats.ok) {
                const globalStatsBody = await resGlobalStats.json()
                // min is the fewest guesses taken by any user
                let min = Math.min(...Object.keys(globalStatsBody).map(n => +n || Infinity));
                globalStatsBody.min = min;
                setGlobalStats(globalStatsBody);
            }

            const resUserStats = await fetch(`/api/users/${user.id}/wordle_stats`);
            if (resUserStats.ok) {
                const userBodyStats = await resUserStats.json()
                // remove average for clean percentages
                delete userBodyStats['average']
                setUserStats(userBodyStats)
                let max = Math.max(...Object.values(userBodyStats));

                // set appropriate bar graph widths
                const styles = {}
                for (let i = 1; i <= 6; i++) {
                    if (userBodyStats[i]) {
                        let width = Math.round(100 * userBodyStats[i] / max) + '%';
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
                [6, 5, 4, 3, 2, 1].map(num => (
                    <li key={num} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', position: 'relative' }}>
                        <span>{num}:</span>
                        <div className={'statbar' + (puzzleSession.num_guesses === num ? ' relevant' : '')} style={userStatsStyles[num]} />
                        <span >{userStats[num]}</span>
                    </li>
                ))
            }
        </ul >
    </div >)
}
