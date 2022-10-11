import { Modal } from "../../context/Modal";
import { useState } from "react";

export default function DeleteConfirmation({ commentId, handleDelete }) {
    const [showModal, setShowModal] = useState(false)

    return <>
        <i className='fas fa-trash-alt' onClick={() => setShowModal(true)} />
        {showModal && <Modal onClose={() => setShowModal(false)}>
            <div id='delete-confirmation'>
                <span>Do you want to delete this comment?</span>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <div className='modal-button' onClick={() => handleDelete(commentId)}>Yes</div>
                    <div className='modal-button' onClick={() => setShowModal(false)}>No</div>
                </div>
            </div>
        </Modal>}
    </>
}
