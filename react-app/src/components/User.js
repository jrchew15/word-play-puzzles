import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { defaultImg } from '../store/utils/image_urls';
import './user.css'

// displays a user's profile picture, username, and total completed puzzles
function User({ userId, setShowModal }) {
  // userId can come from url parameter or can be passed as prop
  userId = useParams().userId || userId
  const [user, setUser] = useState(null);
  const currentUser = useSelector(state => state.session.user);
  const history = useHistory();

  // wait for userId, then fetch user
  useEffect(() => {
    if (!userId) return
    findUser(userId, setUser)
  }, [userId, setUser])

  function directToSettingsOnClick() {
    if (setShowModal) {
      setShowModal(false)
    }
    history.push('/settings')
  }

  return !user ? null : (
    <div id='user-details'>
      <img src={user.profilePicture || defaultImg} alt={user.username} onError={(e) => { e.target.src = defaultImg; console.log('image error') }} />
      <span style={{ fontSize: '1.5em' }}>{user.username}</span>
      <div id='user-puzzle-count'>
        <span style={{ display: 'flex' }}><p style={{ width: 'min-content' }}>Total Wordles Solved</p>
          <span className='number-solved'>{user.totalWordles}</span>
        </span>
        <span style={{ display: 'flex' }}><p style={{ width: 'min-content' }}>Total Wordgons Solved</p>
          <p className='number-solved'>{user.totalWordgons}</p>
        </span>
      </div>
      {currentUser.id === user.id && <button className='modal-button' onClick={directToSettingsOnClick}>
        Edit Settings
      </button>}
    </div>
  )
}
export default User;

async function findUser(userId, setUser) {
  let res = await fetch(`/api/users/${userId}`);
  if (res.ok) {
    let found = await res.json();
    setUser(found);
  }
}
