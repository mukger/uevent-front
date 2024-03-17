import {combineReducers, applyMiddleware} from "redux";
import { legacy_createStore as createStore} from 'redux'

import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { accountReducer } from "./accountReducer";
import { filterReducer } from "./filterReducer";
const rootReducer = combineReducers({
    acc: accountReducer,
    filterData: filterReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));