import { Modal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CloseButton from "./CloseButton";

export default function FailModal({ deleteHandler, showModal, setShowModal }) {
    const history = useHistory();
    const currentUser = useSelector(state => state.session.user)

    return showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <div id='fail-modal'>
                <h2>Sorry, you ran out of words</h2>
                <div id='fail-continues'>
                    <button className="modal-button" onClick={() => { setShowModal(false) }}>Continue</button>
                    {currentUser && <button className="modal-button" onClick={(e) => { deleteHandler(e); setShowModal(false) }}>Start Over</button>}
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
