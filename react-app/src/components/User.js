import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { defaultImg } from '../store/utils/image_urls';
import { wordGonStats, wordleStats } from '../utils/userStatFetches';
import './user.css'

function User({ userId, setShowModal }) {
  userId = useParams().userId || userId
  const [user, setUser] = useState(null);
  const currentUser = useSelector(state => state.session.user);
  const [stats, setStats] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (!userId) return
    (async () => {
      let res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        let found = await res.json();
        setUser(found);
      }
      const allStats = {}
      let res2 = await wordGonStats(userId);
      if (res2) {
        allStats.wordGonStats = res2
      }
      let res3 = await wordleStats(userId);
      if (res3) {
        allStats.wordleStats = res3
      }
      setStats(allStats)
    })()
  }, [userId])

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
        <div>WordGon Stats:
          {Object.keys(stats.wordGonStats).map((key) => <span>{`${key}:${stats.wordGonStats[key]}`}</span>)}
        </div>
        <div>Wordle Stats:
          {Object.keys(stats.wordleStats).map((key) => <span>{`${key}:${stats.wordleStats[key]}`}</span>)}
        </div>
      </div>}
    </div>
  )
}
export default User;
