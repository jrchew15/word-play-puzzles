import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';
import ImageDragAndDrop from './ImageDragAndDrop';

import './dragDrop.css'

const SignUpForm = () => {
  const theme = 'light';

  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [imageFile, setImageFile] = useState(null);

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp({ username, email, password, 'image': imageFile }));
      if (data) {
        setErrors(data)
      }
    } else {
      setErrors(['Passwords do not match'])
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <form onSubmit={onSignUp} className='auth-form'>
        <div className='errors-container'>
          {errors.map((error, ind) => (
            <div className='errors-container' key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <label className='required'>Username</label>
          <input
            type='text'
            name='username'
            placeholder='Required'
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div>
          <label className='required'>Email</label>
          <input
            type='text'
            name='email'
            placeholder='your_email@domain.com'
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        <div>
          <label className='required'>Password</label>
          <input
            type='password'
            name='password'
            placeholder='at least 6 characters'
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <label className='required'>Repeat Password</label>
          <input
            type='password'
            name='repeat_password'
            placeholder='at least 6 characters'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <button className={'submit-button ' + theme} type='submit'>Create an Account</button>
        <div className={'sep ' + theme}><span>or</span></div>
        <NavLink to='/login'>I already have an account</NavLink>
      </form>
      <ImageDragAndDrop imageFile={imageFile} setImageFile={setImageFile} />
    </div>
  );
};

export default SignUpForm;
