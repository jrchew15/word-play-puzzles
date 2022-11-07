import { Modal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/session";
import CloseButton from "./CloseButton";

export default function FailModal({ deleteHandler, showModal, setShowModal }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user)

    async function demoLogin(e) {
        await dispatch(login('Demo', 'password'));
        history.push('/')
    }

    return showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <div id='fail-modal'>
                <h2>Sorry, you ran out of words</h2>
                <div id='fail-continues'>
                    <button className="modal-button" onClick={() => { setShowModal(false) }}>Continue</button>
                    {currentUser ? <button className="modal-button" onClick={(e) => { deleteHandler(e); setShowModal(false) }}>Start Over</button> :
                        <button className="modal-button" onClick={demoLogin}>Demo Login</button>}
                </div>
                <div id='choice-sep'>or</div>
                {
                    currentUser ?
                        <button className="modal-button" onClick={() => history.push('/')}>Back to puzzles</button>
                        : <button className="modal-button" onClick={() => history.push('/sign-up')}>Create an account</button>
                }
            </div>
            <CloseButton setShowModal={setShowModal} />
        </Modal>
    )
}
