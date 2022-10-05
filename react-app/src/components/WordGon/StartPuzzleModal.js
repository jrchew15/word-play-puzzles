import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NonClickModal } from "../../context/Modal";
import { authenticate } from "../../store/session";
import { thunkAddWordgonSession } from "../../store/wordgon";

import './puzzle-modal.css'

export default function StartPuzzleModal({ showModal, setShowModal, puzzleId }) {
    const dispatch = useDispatch();
    const history = useHistory();

    async function createSession(e) {
        let newSession = await dispatch(thunkAddWordgonSession(puzzleId));
        if (newSession.errors) {
            return
        }
        await dispatch(authenticate())
        setShowModal(false)
    }

    return (
        <>
            {showModal && (
                <NonClickModal >
                    <div>
                        <h2>Word-Play</h2>
                        <div style={{ fontSize: '1.2em', width: '400px', textAlign: 'center' }}>
                            <span style={{ width: '300px' }}>
                                Use all the letters around the square before you run out of words.
                                Two letters on the same side cannot be used back-to-back!
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                            <div className='modal-button start' onClick={createSession}>Play</div>
                            <div className='modal-button back-to-puzzles' onClick={() => history.push('/')}>Back to Puzzles</div>
                        </div>
                    </div>
                </NonClickModal>
            )}
        </>
    )
}
