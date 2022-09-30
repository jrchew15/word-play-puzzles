import { useState } from 'react';
// import { useDispatch } from 'react-redux';

import { Modal } from "../context/Modal";
import User from './User';

export default function UserDetailModal({ userId, children }) {
    const [showModal, setShowModal] = useState(false);
    // const dispatch = useDispatch();

    return (
        <>
            <div className='modal-clicker' onClick={() => setShowModal(true)}>
                {children}
            </div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <User userId={userId} />
                </Modal>
            )}
        </>
    )
}
