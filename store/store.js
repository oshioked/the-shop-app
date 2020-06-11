import {createStore, combineReducers} from 'redux';
import productReducer from './reducers/products.reducer';


const rootReducer = combineReducers({
    products: productReducer
})

const store = createStore(rootReducer);

export default store;