import { cartTypes } from "../actions.types"

export const addToCart = product =>{
    return{
        type: cartTypes.ADD_TO_CART,
        payload: product
    }
}

export const removeFromCart = productId =>{
    return{
        type: cartTypes.REMOVE_FROM_CART,
        payload: productId
    }
}