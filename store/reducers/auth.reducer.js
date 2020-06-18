const { authTypes } = require("../actions.types");

const initialState = {
    token: null,
    userId: null
}

const authReducer = (state = initialState, action) =>{
    switch (action.type) {
        case authTypes.SIGN_UP:
            return({
                token: action.payload.token,
                userId: action.payload.userId
            })
        case authTypes.LOG_IN:
            return({
                token: action.payload.token,
                userId: action.payload.userId
            })
        case authTypes.LOG_OUT:
            return initialState;
        default:
            return state;
    }
}

export default authReducer;