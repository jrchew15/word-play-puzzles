import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import './comments.css';

export default function CommentsContainer({ puzzleId, commentsRef }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);

    const [comments, setComments] = useState({});
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentBody, setCommentBody] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [resetting, setResetting] = useState(false);

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
    }, [dispatch, isLoaded, puzzleId])

    useEffect(() => {
        if (resetting) {
            resetCommentForm()
            setResetting(false)
        }
    }, [resetting])

    const parentComments = [];
    const childComments = [];
    for (let commentId in comments) {
        let comment = comments[commentId];

        if (!comment.replyTo) {
            parentComments.push(commentId)
        } else {
            childComments.push(commentId)
        }
    }

    function handleCommentSubmit(e) {
        e.preventDefault();

        submitComment(commentBody)
    }

    async function submitComment(body) {
        const reqBody = { body }
        let res;
        if (editCommentId) {
            res = await fetch(`/api/comments/${editCommentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            })
        } else {
            if (replyingTo) {
                reqBody.replyTo = replyingTo
            }
            res = await fetch(`/api/wordgons/${puzzleId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            })
        }
        if (res.ok) {
            resetCommentForm();
            setIsLoaded(false)
        }
    }

    async function handleDelete(id) {

        const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });

        if (res.ok) {
            setIsLoaded(false)
        }
    }

    function resetCommentForm(e) {
        setShowCommentForm(false)
        setCommentBody('')
        setReplyingTo(null)
        setEditCommentId(null)
    }

    return (
        <ul id='comments-container' ref={commentsRef}>
            {
                parentComments.map((commentId) => {
                    let comment = comments[commentId]
                    return (
                        <li key={'li' + comment.id} >
                            <img src={comment.user.profilePicture} alt={comment.user.username} key={'img' + comment.id} />
                            <div key={'div' + comment.id} className='body-container'>
                                <span key={'username' + comment.id}>{comment.user.username}</span>
                                {editCommentId === comment.id ?
                                    <form onSubmit={handleCommentSubmit} onBlur={() => setResetting(true)} key={'editcommentform' + comment.id}>
                                        <input type='text' autoFocus value={commentBody} onChange={(e) => setCommentBody(e.target.value)} key={'editcommentinput' + comment.id} />
                                    </form>
                                    : <span key={'comment span' + comment.id}>
                                        {comment.body}
                                        {comment.user.id === currentUser.id && <i className="fas fa-pen" onClick={() => { setShowCommentForm(true); setEditCommentId(comment.id); setCommentBody(comment.body) }} />}
                                    </span>}
                                {comment.user.id === currentUser.id && <i className="fas fa-trash-alt" onClick={() => handleDelete(comment.id)} />}
                                <button className='reply-to' onClick={() => { setShowCommentForm(true); setReplyingTo(comment.id) }}>Reply...</button>
                                <ul key={'ul' + comment.id}>
                                    {comment.children.map(child => (
                                        <li key={'child li' + child.id}>
                                            <img src={child.user.profilePicture} alt={child.user.username} key={'child img' + child.id} />
                                            <div key={'child div' + child.id} className='body-container'>
                                                <span key={'child username' + child.id}>{child.user.username}</span>
                                                {editCommentId === child.id ?
                                                    <form onSubmit={handleCommentSubmit} onBlur={() => setResetting(true)} key={'editchildform' + child.id}>
                                                        <input type='text' autoFocus value={commentBody} onChange={(e) => setCommentBody(e.target.value)} key={'editchildinput' + child.id} />
                                                    </form>
                                                    : <span key={'child span' + child.id}>
                                                        {child.body}
                                                        {child.user.id === currentUser.id && <i className="fas fa-pen" onClick={() => { setShowCommentForm(true); setEditCommentId(child.id); setCommentBody(child.body) }} />}
                                                    </span>}
                                                {child.user.id === currentUser.id && <i className="fas fa-trash-alt" onClick={() => handleDelete(child.id)} />}
                                            </div>
                                        </li>
                                    ))}
                                    {showCommentForm && replyingTo === comment.id && <form onSubmit={handleCommentSubmit} onBlur={() => setResetting(true)} key={'form' + comment.id}>
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
                showCommentForm && !replyingTo && !editCommentId && <form onSubmit={handleCommentSubmit} onBlur={() => setResetting(true)} >
                    <input type='text' autoFocus value={commentBody} onChange={(e) => setCommentBody(e.target.value)} />
                </form>
            }
        </ul >
    )
}
