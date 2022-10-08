import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { actionLoadWordgonSessions } from '../../store/wordgon';

const LogoutButton = ({ loggingOut, setLoggingOut }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onLogout = async (e) => {
    setLoggingOut(true)
    // history.push('/')
    // closeDropdowns()
  };

  useEffect(() => {
    if (loggingOut) {
      (async () => {
        await dispatch(logout());
        await dispatch(actionLoadWordgonSessions([]))
      })()
    }
  }, [loggingOut])

  return <li onClick={onLogout} id='logout'>Logout</li>;
};

export default LogoutButton;
