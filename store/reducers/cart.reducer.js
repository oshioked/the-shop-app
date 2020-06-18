import { cartTypes, ordersTypes, productTypes } from "../actions.types";
import CartItem from "../../models/cart-item";

const initialState = {
    items: {},
    totalAmount: 0
}

const cartReducer = (state = initialState, action) =>{
    switch (action.type) {
        case cartTypes.ADD_TO_CART:
            const addedProduct = action.payload;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;
            if(state.items[addedProduct.id]){
                const updatedCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                )
                return{
                    ...state,
                    items: {
                        ...state.items,
                        [addedProduct.id]: updatedCartItem,
                    },
                    totalAmount: state.totalAmount + prodPrice
                }
            }else{
                const newCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
                return {
                    ...state,
                    items: {...state.items, [addedProduct.id]: newCartItem},
                    totalAmount: state.totalAmount + prodPrice
                }
            }
        case cartTypes.REMOVE_FROM_CART:
            const productId = action.payload;
            const selectedItem = state.items[productId]
            const currentQty = selectedItem.quantity;
            let updatedCartItems;
            if(currentQty > 1){
                const updatedCartItem = new CartItem(
                    selectedItem.quantity - 1, 
                    selectedItem.productPrice, 
                    selectedItem.productTitle,
                    selectedItem.sum - selectedItem.productPrice
                )
                updatedCartItems = {...state.items, [productId]: updatedCartItem}
            }else{
                updatedCartItems = {...state.items};
                delete updatedCartItems[productId]
            }
            return{
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedItem.productPrice
            }
        case ordersTypes.ADD_ORDER:
            return initialState
        case productTypes.DELETE_PRODUCT:
            if(!state.items[action.payload]){
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.payload].sum;
            delete updatedItems[action.payload];
            return({
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            })
        default:
           return state
    }
}

export default cartReducer;
