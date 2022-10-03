import { Modal } from "../../context/Modal";

export default function CompleteModal({ numGuesses, numAttempts, commentsRef, showModal, setShowModal, completed }) {

    return showModal && completed && (
        <Modal onClose={() => setShowModal(false)}>
            <div>
                <h2>Congratulations!</h2>
                <p>You completed the puzzle using {numGuesses} out of {numAttempts} words</p>
                {/* Best scores here */}
                <button onClick={continueHandler}>Continue</button>
            </div>
        </Modal>
    )
    function continueHandler(e) {
        commentsRef.current.scrollIntoView()
        setShowModal(false)
    }
}
