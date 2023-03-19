import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { actionLoadWordgonSessions } from '../../store/wordgon';

const LogoutButton = ({ loggingOut, setLoggingOut }) => {
  const dispatch = useDispatch();
  const onLogout = async (e) => {
    setLoggingOut(true)
  };

  // prevents double logout
  useEffect(() => {
    if (loggingOut) {
      (async () => {
        await dispatch(logout());
        await dispatch(actionLoadWordgonSessions([]))
      })()
    }
  }, [loggingOut, dispatch])

  return <li onClick={onLogout} id='logout'>Logout</li>;
};

export default LogoutButton;
