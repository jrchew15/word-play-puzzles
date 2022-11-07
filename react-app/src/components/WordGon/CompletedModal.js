import { Modal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/session";

export default function CompleteModal({ numGuesses, numAttempts, showModal, setShowModal, completed }) {
    const currentUser = useSelector(state => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();

    async function demoLogin(e) {
        await dispatch(login('Demo', 'password'));
        history.push('/')
    }

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, width: '100%' }}>
                                <div className='modal-button' onClick={() => history.push('/sign-up')}>Sign Up</div>
                                <div className='modal-button' onClick={demoLogin}>Demo Login</div>
                            </div>
                        </>
                }
            </div>
        </Modal>
    )
    function continueHandler(e) {
        setShowModal(false)
    }
}
