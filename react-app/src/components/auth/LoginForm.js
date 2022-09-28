import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { login } from '../../store/session';

import './auth.css'

const LoginForm = () => {

  const theme = 'light' // Will eventually use context

  const [errors, setErrors] = useState([]);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(credential, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <form onSubmit={onLogin} id='login-form' className='auth-form'>
      <div className='errors-container'>
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>
      <div>
        <label htmlFor='credential' className='required'>Email or Username</label>
        <input
          name='credential'
          type='text'
          placeholder='Email or Username'
          value={credential}
          onChange={updateCredential}
          required
        />
      </div>
      <div>
        <label htmlFor='password' className='required'>Password</label>
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={updatePassword}
          required
        />
      </div>
      <button className={'submit-button ' + theme}>Continue</button>
      <div className={'sep ' + theme}><span style={{ padding: '0 2px' }}>or</span></div>
      <NavLink to='/sign-up'>Sign Up as a New User</NavLink>
    </form>
  );
};

export default LoginForm;
