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
  const history = useHistory();

  useEffect(() => {
    if (!userId) return
    (async () => {
      let res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        let found = await res.json();
        setUser(found);
      }
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
      <span style={{ fontSize: '1.5em' }}>{user.username}</span>
      <div id='user-puzzle-count'>
        <span style={{ display: 'flex' }}><p style={{ width: 'min-content' }}>Total Wordles Solved</p>
          <span className='number-solved'>{user.totalWordles}</span>
        </span>
        <span style={{ display: 'flex' }}><p style={{ width: 'min-content' }}>Total Wordgons Solved</p>
          <p className='number-solved'>{user.totalWordgons}</p>
        </span>
      </div>
      {currentUser.id === user.id && <button className='modal-button' onClick={directToSettings}>
        Edit Settings
      </button>}
    </div>
  )
}
export default User;
