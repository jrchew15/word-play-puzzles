import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { editUserThunk } from "../store/session";

import ImageDragAndDrop from "./auth/ImageDragAndDrop";
import './user.css'

export default function UserSettings() {
    const currentUser = useSelector(state => state.session.user)

    const [errors, setErrors] = useState([]);
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const history = useHistory();

    const [imageFile, setImageFile] = useState(null);

    const dispatch = useDispatch();

    async function submitUpdate(e) {
        e.preventDefault();
        // dispatch returns null or an error array
        const data = await dispatch(
            editUserThunk(currentUser.id, {
                username: username || currentUser.username,
                email: email || currentUser.email,
                image: imageFile
            })
        )
        if (data) {
            setErrors(data)
            return
        }
        history.push('/')
    }

    // load current profilePicture on render
    useEffect(() => {
        if (currentUser) {
            fetch(currentUser.profilePicture)
                .then((res) => res.blob())
                .then((blob) => setImageFile(blob))
                .catch((e) => { setErrors([e]) })
        }
    }, [currentUser])

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                        </div>
                        <button className='modal-button' type='submit'>Confirm</button>
                    </form>
                </div>
            </div>
            <ImageDragAndDrop imageFile={imageFile} setImageFile={setImageFile} />
        </div>
    )
}
