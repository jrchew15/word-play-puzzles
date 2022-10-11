import CloseButton from "./CloseButton";
import { Modal } from "../../context/Modal";


import './puzzle-modal.css'

export default function RulesModal({ showModal, setShowModal }) {

    return (
        <>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    {/* <div> */}
                    <p style={{ fontSize: '2em' }}>Goal: Use all letters on the square</p>
                    <ol style={{ fontSize: '1.2em', width: '400px' }}>
                        <li>You have a limited number of words to complete the puzzle</li>
                        <li>The first letter of a word is always the last letter of the previous word.</li>
                        <li>
                            Letters can be re-used any number of times
                        </li>
                        <li>Letters on the same side cannot be used consecutively</li>
                    </ol>
                    {/* {currentUser ? <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                            <div className='modal-button start' onClick={createSession}>Play</div>
                            <div className='modal-button back-to-puzzles' onClick={() => history.push('/')}>Back to Puzzles</div>
                        </div> : <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                            <div className='modal-button start' onClick={() => setShowModal(false)}>Play</div>
                            <div className='modal-button back-to-puzzles' onClick={() => history.push('/sign-up')}>Create an account</div>
                        </div>} */}
                    {/* </div> */}
                    <CloseButton setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    )
}
