import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function WordleWonContent({ wordle_id, num_guesses }) {
    const [globalStats, setGlobalStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [globalStyles, setGlobalStyles] = useState(null);
    const [userStyles, setUserStyles] = useState(null);
    const user = useSelector(state => state.session.user);
    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordles/${wordle_id}/stats`);
            if (res.ok) {
                const body = await res.json()
                delete body['average']
                setGlobalStats(body)
                let max = Math.max(...Object.values(body));
                const styles = {}
                for (let i = 1; i <= 6; i++) {
                    if (body[i]) {
                        let width = Math.round(100 * body[i] / max) + '%';
                        styles[i] = { width }
                    } else {
                        styles[i] = { display: 'none' }
                    }
                }
                setGlobalStyles(styles)
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
                setUserStyles(styles)
            }
        })()
    }, [user, setGlobalStats, setUserStats])

    return (globalStats && userStats && userStyles && globalStyles && < div >
        {/* Global Stats
        < ul id='modal-stats' >
            {
                [6, 5, 4, 3, 2, 1].map(num => (<li key={num} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <span>{num}:</span>
                    <div className={'statbar' + (num_guesses === num ? ' relevant' : '')} style={globalStyles[num]} />
                    <span>{globalStats[num]}</span>
                </li>)
                )
            }
        </ul > */}
        <h3>Congratulations!</h3>
        <p>You used {num_guesses} out of 6 words</p>
        Your stats:
        < ul id={'modal-stats'} >
            {
                [6, 5, 4, 3, 2, 1].map(num => (<li key={num} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <span>{num}:</span>
                    <div className={'statbar' + (num_guesses === num ? ' relevant' : '')} style={userStyles[num]} />
                    <span>{userStats[num]}</span>
                </li>)
                )
            }
        </ul >
    </div >)
}
