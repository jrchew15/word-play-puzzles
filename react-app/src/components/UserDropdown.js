import { useSelector } from "react-redux";
import LogoutButton from "./auth/LogoutButton";
import { useHistory, NavLink } from "react-router-dom";

export default function UserDropdown({ showDropdown, setShowDropdown, setShowModal }) {
    const currentUser = useSelector(state => state.session.user)
    const wordgons = useSelector(state => state.wordgon)
    const history = useHistory();

    return (currentUser?.id ?
        <ul id='user-dropdown' className="unselectable">
            <li onClick={() => setShowModal(true)}>My Profile</li>
            <div className="navbar-sep" />
            <li id='puzzle-select'>
                {currentUser.openSessions.length < 1 ? (<span>Start a Puzzle</span>) :
                    (<>Open Puzzles
                        {currentUser.openSessions.map(sesh => (
                            <NavLink to={`/wordgons/${wordgons[sesh].puzzleId}`} >
                                {wordgons[sesh].puzzleId}</NavLink>
                        ))}</>)
                }
            </li>
            <div className="navbar-sep" />
            <li>
                <LogoutButton />
            </li>
        </ul >
        : null)
}
