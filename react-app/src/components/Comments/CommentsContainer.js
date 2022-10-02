import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import './comments.css';

export default function CommentsContainer({ puzzleId }) {
    const dispatch = useDispatch();
    const [comments, setComments] = useState({});
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentBody, setCommentBody] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    useEffect(() => {
        if (isLoaded) return
        (async () => {
            const res = await fetch(`/api/wordgons/${puzzleId}/comments`);
            const data = await res.json()

            if (res.ok) {
                setComments(data.comments)
            }
            setIsLoaded(true)
        })()
    }, [dispatch, isLoaded])

    const parentComments = [];
    const childComments = [];
    for (let commentId in comments) {
        let comment = comments[commentId];

        if (!comment.replyTo) {
            parentComments.push(commentId)
        } else {
            childComments.push(commentId)
        }
        console.log('Parents', parentComments.map(id => comments[id]))
    }

    function handleCommentSubmit(e) {
        e.preventDefault();

        submitComment(commentBody)
    }

    function handleBlur(e) {
        setCommentBody('');
        setReplyingTo(null)
        setShowCommentForm(false);
    }

    async function submitComment(body) {
        const reqBody = { body }
        if (replyingTo) {
            reqBody.replyTo = replyingTo
        }
        const res = await fetch(`/api/wordgons/${puzzleId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
        // if (res.ok) {
        setShowCommentForm(false)
        setCommentBody('')
        setReplyingTo(null)
        setIsLoaded(false)
        // }
    }

    return (
        <ul id='comments-container'>
            {isLoaded &&
                parentComments.map((commentId) => {
                    let comment = comments[commentId]
                    return (
                        <li key={'li' + comment.id} >
                            <img src={comment.user.profilePicture} alt={comment.user.username} key={'img' + comment.id} />
                            <div key={'div' + comment.id} className='body-container'>
                                <span key={'username' + comment.id}>{comment.user.username}</span>
                                <span key={'span' + comment.id}>{comment.body}</span>
                                <button className='reply-to' onClick={() => { setShowCommentForm(true); setReplyingTo(comment.id) }}>Reply...</button>
                                <ul key={'ul' + comment.id}>
                                    {comment.children.map(child => (
                                        <li key={'child li' + child.id}>
                                            <img src={child.user.profilePicture} alt={child.user.username} key={'child img' + child.id} />
                                            <div key={'child div' + child.id} className='body-container'>
                                                <span key={'child username' + child.id}>{child.user.username}</span>
                                                <span key={'child span' + child.id}>{child.body}</span>
                                            </div>
                                            {/* <span key={'child span' + child.id}>{child.body}</span> */}
                                        </li>
                                    ))}
                                    {showCommentForm && replyingTo === comment.id && <form onSubmit={handleCommentSubmit} onBlur={handleBlur} key={'form' + comment.id}>
                                        <input type='text' autoFocus value={commentBody} onChange={(e) => setCommentBody(e.target.value)} key={'input' + comment.id} />
                                    </form>}
                                </ul>
                            </div>
                        </li>
                    )
                }
                )
            }
            <button onClick={() => { setShowCommentForm(true); setReplyingTo(null) }} style={{ display: showCommentForm ? 'none' : 'block' }}>Add Comment</button>
            {
                showCommentForm && !replyingTo && <form onSubmit={handleCommentSubmit} onBlur={handleBlur} >
                    <input type='text' autoFocus value={commentBody} onChange={(e) => setCommentBody(e.target.value)} />
                </form>
            }
        </ul >
    )
}
