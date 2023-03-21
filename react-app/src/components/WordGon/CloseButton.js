export default function CloseButton({ setShowModal }) {
    return <i className="fas fa-times" onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '1.5em', top: '1.5em', cursor: 'pointer' }} />
}
