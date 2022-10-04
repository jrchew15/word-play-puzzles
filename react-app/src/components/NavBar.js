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
        {(showDropdown && whichDropdown === 'user') && <UserDropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} setShowModal={setShowModal} />}
        <img src={imageSrc} alt='logo' className='logo'
          onMouseEnter={() => setImageSrc('/static/images/icon_2-cropped.svg')}
          onMouseLeave={() => setImageSrc('/static/images/icon_1-cropped.svg')}
          onClick={() => { history.push('/') }}
        />
      </div>
      <div id='right-nav' onClick={developerDropdownToggle}>
        <span >About the Developer</span>
        {(showDropdown && whichDropdown === 'developer') && <ul id='developer-dropdown'>
          <li onClick={() => history.push('/')}>
            Project Github
            <img src='/static/images/icon_square.svg' alt='project_github' />
          </li>
          <li onClick={() => history.push('https://github.com/jrchew15')}>
            Dev Github
            <img src='/static/images/GitHub-Mark-64px.png' alt='github' />
          </li>
          <li onClick={() => history.push('https://www.linkedin.com/in/jason-chew-20867a207/')}>
            Dev LinkedIn
            <img src='https://cdn-icons-png.flaticon.com/512/49/49408.png' alt='linkedin' />
          </li>
        </ul>}
      </div>
    </nav>
    {showModal && <Modal onClose={() => setShowModal(false)}>
      <User userId={currentUser.id} setShowModal={setShowModal} />
    </Modal>}
  </>);
}

export default NavBar;
