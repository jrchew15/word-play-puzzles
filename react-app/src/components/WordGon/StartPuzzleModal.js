import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NonClickModal } from "../../context/Modal";
import { thunkAddWordgonSession } from "../../store/wordgon";

export default function StartPuzzleModal({ showModal, setShowModal, puzzleId }) {
    const dispatch = useDispatch();
    const history = useHistory();

    async function createSession(e) {
        let newSession = await dispatch(thunkAddWordgonSession(puzzleId));
        if (newSession.errors) {
            return
        }
        setShowModal(false)
    }

    return (
        <>
            {showModal && (
                <NonClickModal >
                    <div>
                        <h2>Word-Gon</h2>
                        <h3>Use all the letters around the square</h3>
                        <button onClick={createSession}>Play</button>
                        <button onClick={() => history.push('/')}>Back to Puzzles</button>
                    </div>
                </NonClickModal>
            )}
        </>
    )
}
