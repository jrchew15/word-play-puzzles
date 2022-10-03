import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UserDropdown from './UserDropdown';
import { Modal } from '../context/Modal';
import User from './User';

import './nav.css'

const NavBar = ({ showDropdown, setShowDropdown }) => {
  const currentUser = useSelector(state => state.session.user)
  const history = useHistory()

  const [imageSrc, setImageSrc] = useState('/static/images/icon_1-cropped.svg')
  const [whichDropdown, setWhichDropdown] = useState('')
  const [showModal, setShowModal] = useState(false)

  function userDropdownToggle(e) {
    e.stopPropagation();

    setWhichDropdown('user')
    setShowDropdown(x => !x)
  }
  function developerDropdownToggle(e) {
    e.stopPropagation();

    setWhichDropdown('developer')
    setShowDropdown(x => !x)
  }

  return (<>
    <nav id='my-nav'>
      <div id='left-nav'>
        {currentUser?.id > 0 &&
          <div id='dropdown-selector' onClick={userDropdownToggle} >
            {(showDropdown && whichDropdown === 'user') ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
          </div>}
        {/* : (<div id='auth-buttons-container'>
            <button id='nav-login'>Login</button>
            <button id='nav-signup'>Sign Up</button>
          </div>)} */}
        {(showDropdown && whichDropdown === 'user') && <UserDropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} setShowModal={setShowModal} />}
        <img src={imageSrc} alt='logo' className='logo'
          onMouseEnter={() => setImageSrc('/static/images/icon_2-cropped.svg')}
          onMouseLeave={() => setImageSrc('/static/images/icon_1-cropped.svg')}
          onClick={() => { history.push('/') }}
        />
      </div>
      <div id='right-nav' onClick={developerDropdownToggle}>
        <span >About the Developer</span>
        {(showDropdown && whichDropdown === 'developer') && <div id='developer-dropdown'>
          <p>Project Github</p>
          <p>Developer's Github</p>
          <p>Developer's LinkedIn</p>
        </div>}
      </div>
    </nav>
    {showModal && <Modal onClose={() => setShowModal(false)}>
      <User userId={currentUser.id} setShowModal={setShowModal} />
    </Modal>}
  </>);
}

export default NavBar;
