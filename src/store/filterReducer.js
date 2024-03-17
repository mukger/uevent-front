const defaultState = {
    filter: '',
    page: 1,
    totalPages: 1,
    category: '',
    filteredData: '',
    theme: '',
    future: false,
    result:[]
}

const FILTER = "FILTERING";
const PAGE = "PAGE";
const CATEGORY = "CATEGORY";
const SEARCH = "SEARCH";
const FUTURE = "FUTURE";
export const filterReducer = (state = defaultState, action) =>{
    switch (action.type){
       
        case FILTER:
            return {...state, totalPages: action.payload.totalPages, page: 1, filter: action.payload.filter, result: action.payload.data};
        case PAGE:
            return {...state, totalPages: action.payload.totalPages, page: action.payload.page, result: action.payload.data};
        case CATEGORY:
            return {...state, totalPages: action.payload.totalPages, page: 1, category: action.payload.category, theme: action.payload.theme, result: action.payload.data};
        case SEARCH:
            return {...state, filteredData: action.payload};
        case FUTURE:
            return {...state,  totalPages: action.payload.totalPages, page: 1, future: action.payload.future, result: action.payload.data}
        default:
            return state;
    }
}

export const changeFilterEvents = (payload) =>({type: FILTER, payload});
export const changePageEvents = (payload) =>({type: PAGE, payload});
export const changeCategoryEvents = (payload) =>({type: CATEGORY, payload});
export const inputSearchData = (payload) =>({type: SEARCH, payload});
export const futureEvents = (payload) =>({type: FUTURE, payload});
