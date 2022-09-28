import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { editUserThunk } from "../store/session";

import { defaultImg } from "../store/utils/image_urls";
import './user.css'

export default function UserSettings() {
    const currentUser = useSelector(state => state.session.user)

    const [errors, setErrors] = useState([]);
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture);
    const [preview, setPreview] = useState(currentUser.profilePicture);
    const [previewError, setPreviewError] = useState(false);
    const history = useHistory();

    const dispatch = useDispatch();

    async function submitUpdate(e) {
        e.preventDefault();
        const data = await dispatch(editUserThunk(
            currentUser.id,
            username || currentUser.username,
            email || currentUser.email,
            profilePicture || currentUser.profilePicture
        ))
        if (data) {
            setErrors(data)
            return
        }
        history.push('/users')
    }

    function refreshPreview(e) {
        setPreview(profilePicture);
        setPreviewError(false);
    }

    return (
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center' }}>
            <h2>User Settings</h2>
            <div style={{ display: 'flex' }}>
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
                    <button type='submit'>Edit Settings</button>
                </form>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {previewError ? <>
                        <span>Default image:</span>
                        <img src={defaultImg} className='preview-image' />
                    </>
                        : <>
                            <span>Preview of image:</span>
                            <img src={preview} onError={() => setPreviewError(true)} className='preview-image' />
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
