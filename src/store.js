import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { userReducer, usersReducer, dishReducer, dishsReducer } from './reducers';

const reducer = combineReducers({
	user: userReducer,
	users: usersReducer,
	dish: dishReducer,
	dishs: dishsReducer,
});

const composeEnhangers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhangers(applyMiddleware(thunk)));
