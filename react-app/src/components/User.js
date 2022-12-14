import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { defaultImg } from '../store/utils/image_urls';
import './user.css'

function User({ userId, setShowModal }) {
  const [user, setUser] = useState(null);
  const currentUser = useSelector(state => state.session.user);
  const history = useHistory();

  useEffect(() => {
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
      <ul>
        <li>{user.username}</li>
        <li>Puzzles Solved: {user.totalPuzzlesSolved}</li>
      </ul>
      {currentUser.id === user.id && <button className='modal-button' onClick={directToSettings}>
        Edit Settings
      </button>}
    </div>
  )
}
export default User;
