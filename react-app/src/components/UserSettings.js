import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './user.css'

export default function UserSettings() {
    const currentUser = useSelector(state => state.session.user)

    const [errors, setErrors] = useState([]);
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture);
    const [preview, setPreview] = useState(currentUser.profilePicture);
    const [previewError, setPreviewError] = useState(false);

    const dispatch = useDispatch();

    async function submitUpdate(e) {
        e.preventDefault();
        // const data = await dispatch
    }

    function refreshPreview(e) {
        setPreview(profilePicture);
        setPreviewError(false);
    }

    return (
        <>
            {previewError ? <div>Couldn't find Image</div> :
                <img src={preview} onError={() => setPreviewError(true)} />
            }
            <form className="user-form" onSubmit={submitUpdate}>
                <div className='errors-container'>
                    {errors.map((error, ind) => (
                        <div className='errors-container' key={ind}>{error}</div>
                    ))}
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type='text'
                        name='username'
                        placeholder={currentUser.username}
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    ></input>
                    <label htmlFor="email">Email</label>
                    <input
                        type='text'
                        name='email'
                        placeholder={currentUser.email}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    ></input>
                    <label htmlFor="profilePicture">Profile Picture <span id='preview-image-clicker' onClick={refreshPreview}>(preview)</span></label>
                    <input
                        type='text'
                        name='profilePicture'
                        placeholder={currentUser.profilePicture}
                        onChange={(e) => setProfilePicture(e.target.value)}
                        value={profilePicture}
                    ></input>
                </div>
                <div>
                    Theme placeholder
                </div>
            </form>
        </>
    )
}
