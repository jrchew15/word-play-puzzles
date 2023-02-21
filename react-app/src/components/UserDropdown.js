import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import LogoutButton from "./auth/LogoutButton";
import { useHistory, NavLink } from "react-router-dom";

export default function UserDropdown({ setShowModal, closeDropdowns, setTriggerReload }) {
    const currentUser = useSelector(state => state.session.user)
    const wordgons = useSelector(state => state.wordgon)
    const history = useHistory();

    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {

        if (loggingOut) {
            history.push('/')
        }

    }, [loggingOut])

    return (currentUser ?
        <ul id='user-dropdown' className="unselectable">
            <li onClick={() => { setShowModal(true); closeDropdowns() }}>My Profile</li>
            <div className="navbar-sep" />
            <LogoutButton loggingOut={loggingOut} setLoggingOut={setLoggingOut} />
            <div className="navbar-sep" />
            <li id='puzzle-select'>
                {currentUser.openSessions.length < 1 ? <span>No Open Wordgons</span> :
                    (<><span style={{ marginBottom: 4 }}>Open Wordgons</span>
                        {currentUser.openSessions.map(sesh => (
                            <span onClick={() => { closeDropdowns(); setTriggerReload(true) }} key={'wordgon' + sesh}>
                                <NavLink to={`/wordgons/${wordgons[sesh].puzzleId}`} >
                                    {wordgons[sesh].puzzleId}</NavLink>
                            </span>
                        ))}
                    </>)}
                {currentUser.openWordles.length < 1 ? <span>No Open Wordles</span> :
                    (<>
                        <span style={{ marginBottom: 4 }}>Open Wordles</span>
                        {currentUser.openWordles.map(wordleId => (
                            <span onClick={() => { closeDropdowns(); setTriggerReload(true) }} key={'wordle' + wordleId}>
                                <NavLink to={`/wordles/${wordleId}`} >
                                    {wordleId}</NavLink>
                            </span>))}
                    </>
                    )}
            </li>
        </ul >
        : null)
}
