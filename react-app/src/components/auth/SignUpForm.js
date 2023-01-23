import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';

import { defaultImg } from '../../store/utils/image_urls';

import './dragDrop.css'

const SignUpForm = () => {
  const theme = 'light';

  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const addFileRef = useRef(null);

  // const reader = new FileReader();

  const dragOverHandler = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const dragEnterHandler = (e) => {
    e.preventDefault()
    if (e.target.id == 'drag-container') {
      setDragging(true);
    }
  }
  const dragLeaveHandler = (e) => {
    e.preventDefault()
    if (e.target.id == 'drag-container' && e.relatedTarget.id != 'drag-border') {
      setDragging(false);
    }
  }
  const dropHandler = (e) => {
    e.preventDefault()
    if (e.dataTransfer.items && e.dataTransfer.items[0]) {
      setImageFile(e.dataTransfer.items[0].getAsFile())
    }
    setDragging(false);
  }

  // const [preview, setPreview] = useState('');
  // const [previewError, setPreviewError] = useState(false);

  // function refreshPreview(e) {
  //   setPreview(profilePicture);
  //   setPreviewError(false);
  // }

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

  const updateProfilePicture = (e) => {
    setProfilePicture(e.target.value)
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  useEffect(() => {
    if (imageFile) {
      setImageUrl(URL.createObjectURL(imageFile))
    }
  }, [imageFile])

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
      <div id='drag-container'
        // onDragEnter={dragEnterHandler}
        onDragLeave={dragLeaveHandler}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
        onClick={(e) => {
          // e.preventDefault()
          addFileRef.current.click()
        }}
        className={dragging ? 'dragging' : ''}
      >
        {imageFile ? <img src={imageUrl} /> : <div id='drag-border' onDrop={dropHandler}>
          <i className='far fa-file-image' />
        </div>}
        <input
          ref={addFileRef}
          type='file'
          id='hidden-file-input'
          onChange={(e) => {
            setImageFile(e.target.files[0])
          }}
        />
        <span style={{ left: 0, top: 0, fontSize: '1.3em' }}>Profile Picture (optional)</span>
        <span style={{ right: 0, bottom: 0 }}>Drag an image file or click</span>
      </div>
    </div>
  );
};

export default SignUpForm;
