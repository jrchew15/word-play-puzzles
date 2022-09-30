const SET_WORDGON = 'wordgon/SET_WORDGON';
const LOAD_WORDGONS = 'wordgon/LOAD_WORDGONS';

const actionSetWordgonSession = (puzzleSession) => ({
    type: SET_WORDGON,
    payload: puzzleSession
})

const actionLoadWordgonSessions = (sessionsArr) => ({
    type: LOAD_WORDGONS,
    payload: sessionsArr
})

export const thunkAddWordgonSession = (puzzleId) => async (dispatch) => {
    const res = await fetch(`/api/wordgons/${puzzleId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (res.ok) {
        await dispatch(actionSetWordgonSession(data))
        return data
    }
    return data
}

export const thunkUpdateWordgonSession = ({ puzzleId, sessionId, guesses, completed }) => async (dispatch) => {

    const payload = {
        guesses: guesses.join(','),
        numGuesses: guesses.length,
        completed: completed
    }
    const res = await fetch(`/api/wordgons/${puzzleId}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(actionSetWordgonSession(data))
        return data
    }
    return data
}

export const thunkLoadWordgonSessions = () => async (dispatch) => {
    const res = await fetch(`/api/users/current/sessions`);
    const data = await res.json()

    if (res.ok) {
        dispatch(actionLoadWordgonSessions(data))
        return null
    }
    return data
}

const initialState = {}

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case SET_WORDGON:
            newState = { ...state }
            newState[action.payload.id] = action.payload
            return newState
        case LOAD_WORDGONS:
            newState = { ...action.payload }
            // action.payload.forEach(session => newState[session.id] = session);
            return newState;
        default:
            return state;
    }
}
