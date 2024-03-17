const defaultState = {
    auth: (localStorage.getItem('access')&& localStorage.getItem('access').length > 2) ? true : false,
    login: localStorage.getItem('login'),
    ava: localStorage.getItem('ava')    
}

const AUTHORIZE = "AUTHORIZE";
const UNANTHORIZE = "UNATHORIZE";
export const accountReducer = (state = defaultState, action) =>{
    switch (action.type){
        case AUTHORIZE:
            return {...state, auth: true, login: action.payload.login, ava: action.payload.ava};
        case UNANTHORIZE:
            return {...state, auth: false, login: action.payload.login, ava: action.payload.ava};
        default:
            return state;
    }
}

export const authorizeUser = (payload) =>({type: AUTHORIZE, payload});
export const unathorizeUser = (payload) =>({type: UNANTHORIZE, payload});