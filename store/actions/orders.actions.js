import Order from "../../models/order";

const { ordersTypes } = require("../actions.types")

export const fetchOrders = () => async (dispatch, getState) =>{
    const userId = getState().auth.userId;

    try {
        const response = await fetch(  `https://rn-shop-app1.firebaseio.com/orders/${userId}.json`);

        const data = await response.json();
        let loadedOrders = [];
        for(const key in data){
            loadedOrders.push(new Order(
                key,
                data[key].items, 
                data[key].amount, 
                data[key].date
            ))
        }

        if(!response.ok){
            throw new Error('Something went wrong')
        }
        dispatch({
            type: ordersTypes.FETCH_ORDERS,
            payload: loadedOrders
        })
    } catch (error) {
        throw error;
    }
}

export const addOrder = (cartItems, totalAmount) =>{
    return async (dispatch, getState) =>{
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        const date = new Date();
        try {
            const response = await fetch(`https://rn-shop-app1.firebaseio.com/orders/${userId}.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems,
                    amount: totalAmount,
                    date: date.toISOString()
                })
            });
            if(!response.ok){
                throw new Error('Error adding order')
            }
            const data = await response.json();
            dispatch({
                type: ordersTypes.ADD_ORDER,
                payload: {
                    id: data.name,
                    items: cartItems,
                    amount: totalAmount,
                    date: date.toISOString(),
                }
            })
        } catch (error) {
            throw new Error(error)
        }
    }
}