import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';

const LogoutButton = ({ closeDropdowns }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onLogout = async (e) => {
    await dispatch(logout());
    closeDropdowns()
    history.push('/')
  };

  return <li onClick={onLogout} id='logout'>Logout</li>;
};

export default LogoutButton;
