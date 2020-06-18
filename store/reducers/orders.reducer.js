import { ordersTypes } from "../actions.types";
import Order from "../../models/order";

const initialState = {
    orders: []
}

const ordersReducer = (state = initialState, action)=>{
    switch (action.type) {
        case ordersTypes.ADD_ORDER:
            const newOrder = new Order(
                action.payload.id, 
                action.payload.items, 
                action.payload.amount, 
                action.payload.date
            );
            return{
                ...state,
                orders: state.orders.concat(newOrder)
            }
        case ordersTypes.FETCH_ORDERS: 
            return({
                orders: action.payload
            })
        default:
            return state;
    }
}

export default ordersReducer