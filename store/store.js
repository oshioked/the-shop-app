import {createStore, combineReducers, applyMiddleware} from 'redux';
import productReducer from './reducers/products.reducer';
import cartReducer from './reducers/cart.reducer';
import {composeWithDevTools} from 'redux-devtools-extension'
import ordersReducer from './reducers/orders.reducer';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth.reducer';


const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer
})


const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;