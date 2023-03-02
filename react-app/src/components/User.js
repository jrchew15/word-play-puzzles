import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { defaultImg } from '../store/utils/image_urls';
import { wordGonStats, wordleStats } from '../utils/userStatFetches';
import './user.css'
import './Wordle/wordle-puzzle.css'

function User({ userId, setShowModal }) {
  userId = useParams().userId || userId
  const [user, setUser] = useState(null);
  const currentUser = useSelector(state => state.session.user);
  const [stats, setStats] = useState({});
  const [styles, setStyles] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (!userId) return
    (async () => {
      let res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        let found = await res.json();
        setUser(found);
      }
      let res2 = await wordGonStats(userId);
      if (res2) {
        stats.wordGonStats = res2
      }
      let res3 = await wordleStats(userId);
      if (res3) {
        stats.wordleStats = res3
      }
      setStats(stats)
    })()
  }, [userId])

  useEffect(() => {
    if (!stats || !stats.wordleStats) return
    let max = Math.max(...Object.values(stats.wordleStats));

    for (let i = 1; i <= 6; i++) {
      if (stats.wordleStats[i]) {
        let width = Math.round(100 * stats.wordleStats[i] / max) + '%';
        styles[i] = { width }
      } else {
        styles[i] = { display: 'none' }
      }
    }
  }, [stats])

  function directToSettings() {
    if (setShowModal) {
      setShowModal(false)
    }
    history.push('/settings')
  }

  if (!user) {
    return null;
  }

  return (
    <div id='user-details'>
      <img src={user.profilePicture} alt={user.username} onError={(e) => e.target.src = defaultImg} />
      <span>{user.username}</span>
      {currentUser.id === user.id && <button className='modal-button' onClick={directToSettings}>
        Edit Settings
      </button>}
      {stats && <div>
        {/* <div>WordGon Stats:
          {Object.keys(stats.wordGonStats).map((key) => <span>{`${key}:${stats.wordGonStats[key]}`}</span>)}
        </div> */}
        <div>Wordle Stats:
          < ul id={'modal-stats'} >
            {
              [6, 5, 4, 3, 2, 1].map(num => (<li key={num} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                <span>{num}:</span>
                <div className={'statbar'} style={styles[num]} />
                <span>{stats[num]}</span>
              </li>)
              )
            }
          </ul >
        </div>
      </div>}
    </div>
  )
}
export default User;
