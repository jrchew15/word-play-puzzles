import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UserDropdown from './UserDropdown';
import { Modal } from '../context/Modal';
import User from './User';

import './nav.css'

const NavBar = ({ showUserDropdown, setShowUserDropdown, showDeveloperDropdown, setShowDeveloperDropdown, setTriggerReload }) => {
  const currentUser = useSelector(state => state.session.user)
  const history = useHistory()

  const [imageSrc, setImageSrc] = useState('/static/images/icon_1-cropped.svg')

  const [showModal, setShowModal] = useState(false)

  function userDropdownToggle(e) {
    // e.stopPropagation();

    setShowUserDropdown(x => !x)
    setShowDeveloperDropdown(false)
  }
  function developerDropdownToggle(e) {
    // e.stopPropagation();

    setShowDeveloperDropdown(x => !x)
    setShowUserDropdown(false)
  }

  function closeDropdowns() {
    setShowDeveloperDropdown(false)
    setShowUserDropdown(false)
  }

  return (<>
    <nav id='my-nav'>
      <div id='left-nav'>
        {currentUser?.id > 0 &&
          <div id='dropdown-selector' onClick={userDropdownToggle} >
            {(showUserDropdown) ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
          </div>}
        {(showUserDropdown) && <UserDropdown showDropdown={showUserDropdown} setShowDropdown={setShowUserDropdown} setShowModal={setShowModal} closeDropdowns={closeDropdowns} setTriggerReload={setTriggerReload} />}
        <img src={imageSrc} alt='logo' className='logo'
          onMouseEnter={() => setImageSrc('/static/images/icon_2-cropped.svg')}
          onMouseLeave={() => setImageSrc('/static/images/icon_1-cropped.svg')}
          onClick={() => { history.push('/'); closeDropdowns() }}
        />
      </div>
      <div onClick={closeDropdowns} style={{ flexGrow: '1', height: '100%' }} />
      <div id='right-nav' onClick={developerDropdownToggle}>
        <span >About the Developer</span>
        {(showDeveloperDropdown) && <ul id='developer-dropdown' onClick={() => setShowDeveloperDropdown(false)}>
          <a href='https://github.com/jrchew15/word-play-puzzles/' target='_blank'>
            Project Github
            <img src='/static/images/icon_square.svg' alt='project_github' />
          </a>
          <a href='https://github.com/jrchew15' target='_blank'>
            Dev Github
            <img src='/static/images/GitHub-Mark-64px.png' alt='github' />
          </a>
          <a href='https://www.linkedin.com/in/jason-r-chew/' target='_blank'>
            Dev LinkedIn
            <img src='https://cdn-icons-png.flaticon.com/512/49/49408.png' alt='linkedin' />
          </a>
        </ul>}
      </div>
    </nav>
    {
      showModal && currentUser && <Modal onClose={() => setShowModal(false)}>
        <User userId={currentUser.id} setShowModal={setShowModal} />
      </Modal>
    }
  </>);
}

export default NavBar;
