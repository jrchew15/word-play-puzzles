import { useSelector } from "react-redux";
import LogoutButton from "./auth/LogoutButton";
import { useHistory, NavLink } from "react-router-dom";

export default function UserDropdown({ showDropdown, setShowDropdown }) {
    const currentUser = useSelector(state => state.session.user)
    const wordgons = useSelector(state => state.wordgon)
    const history = useHistory();

    return (currentUser?.id ?
        <ul id='user-dropdown' className="unselectable">
            <li>My Profile</li>
            <div className="navbar-sep" />
            <li id='puzzle-select'>
                {currentUser.openSessions.length ? (<span>Start a Puzzle</span>) :
                    (<span>Open Puzzles
                        {currentUser.openSessions.map(sesh => (
                            <NavLink to={`/wordgons/${wordgons[sesh].puzzleId}`} >
                                {wordgons[sesh].puzzleId}</NavLink>
                        ))}</span>)
                }
            </li>
            <div className="navbar-sep" />
            <li>
                <LogoutButton />
            </li>
        </ul >
        : null)
}

// Profile
// Open Puzzles
// Logout
