import { useState, useRef, useEffect } from "react";
import './dragDrop.css';

export default function ImageDragAndDrop({ imageFile, setImageFile }) {
    const [imageUrl, setImageUrl] = useState('');
    const [dragging, setDragging] = useState(false);    // used to give user feedback when they are dragging a file correctly
    const [imageError, setImageError] = useState('');
    const addFileRef = useRef(null); // used to trigger file explorer


    // Event handlers
    const dragOverHandler = (e) => {
        e.preventDefault()
        setDragging(true)
    }
    const dragLeaveHandler = (e) => {
        e.preventDefault()
        if (e.target.id === 'drag-container' && e.relatedTarget.id !== 'drag-border') {
            setDragging(false);
        }
    }
    const dropHandler = (e) => {
        e.preventDefault()
        if (e.dataTransfer.items && e.dataTransfer.items[0]) {
            let file = e.dataTransfer.items[0].getAsFile()
            if (file.size > 1e6) {
                setImageError('Image file must be less than 1MB in size')
            } else {
                setImageFile(file)
            }
        }
        setDragging(false);
    }


    // when receiving a new file, create url for it to display
    useEffect(() => {
        if (imageFile) {
            setImageError('')
            setImageUrl(URL.createObjectURL(imageFile))
        }
    }, [imageFile])

    return <div id='drag-container'
        onDragLeave={dragLeaveHandler}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
        onClick={(e) => {
            addFileRef.current.click()
        }}
        className={dragging ? 'dragging' : ''}
    >
        {imageFile ?
            <img src={imageUrl} alt={'uploaded_file'} />
            : // placeholder when no image
            <div id='drag-border' onDrop={dropHandler}>
                <i className='far fa-file-image' />
            </div>}
        {/* hidden input element to receive file */}
        <input
            ref={addFileRef}
            type='file'
            id='hidden-file-input'
            onChange={(e) => {
                if (e.target.files[0] && e.target.files[0].size > 1e6) {
                    setImageError('Image file must be less than 1MB in size')
                } else {
                    setImageFile(e.target.files[0])
                }
            }}
        />
        <span style={{ left: 0, top: 0, fontSize: '1.3em' }}>Profile Picture (optional)</span>
        <span style={{ right: 0, bottom: 0 }}>Drag an image file or click</span>
        {imageError && <span style={{ right: '35%', bottom: 50, color: 'red' }}>{imageError}</span>}
    </div>
}
