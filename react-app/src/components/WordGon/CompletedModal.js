import { Modal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CompleteModal({ numGuesses, numAttempts, showModal, setShowModal, completed }) {
    const currentUser = useSelector(state => state.session.user);
    const history = useHistory();
    return showModal && completed && (
        <Modal onClose={() => setShowModal(false)}>
            <div id='complete-modal'>
                <h2>Congratulations!</h2>
                <p>You completed the puzzle using {numGuesses} out of {numAttempts} words</p>
                {/* Best scores here */}
                {
                    currentUser ? <div className='modal-button' onClick={continueHandler}>Continue</div> :
                        <>
                            <div>Sign up to see more puzzles!</div>
                            <div className='modal-button' onClick={() => history.push('/sign-up')}>Sign Up</div>
                        </>
                }
            </div>
        </Modal>
    )
    function continueHandler(e) {
        setShowModal(false)
    }
}
