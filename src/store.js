import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './modules/Module';

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
