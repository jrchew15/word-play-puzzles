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
    const res = await fetch(`/api/wordgons/${puzzleId}/sessions`)
    const data = await res.json()
    if (res.ok) {
        dispatch(actionSetWordgonSession(data))
        return null
    }
    return data
}

export const thunkUpdateWordgonSession = (sessionObj) => async (dispatch) => {
    const { puzzleId, sessionId } = sessionObj;
    const res = await fetch(`/api/wordgons/${puzzleId}/sessions/${sessionId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(sessionObj)
    });
    const data = res.json();
    if (res.ok) {
        dispatch(actionSetWordgonSession(data))
        return null
    }
    return data
}

export const thunkLoadWordgonSessions = () => async (dispatch) => {
    const res = await fetch(`/api/users/current/sessions`);
    const data = await res.json()
    console.log(data)
    if (res.ok) {
        dispatch(actionLoadWordgonSessions(data.sessions))
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
            newState = {}
            action.payload.forEach(session => newState[session.id] = session);
            return newState;
        default:
            return state;
    }
}
