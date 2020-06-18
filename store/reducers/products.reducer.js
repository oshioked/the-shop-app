import PRODUCTS from "../../data/dummy-data";
import { productTypes } from "../actions.types";
import Product from "../../models/Product";


const initialState = {
    availableProducts: [],
    userProducts: []
}

const productReducer = (state = initialState, action) =>{
    switch (action.type) {
        case productTypes.FETCH_PRODUCTS:
            return({
                ...state,
                availableProducts: action.payload.products,
                userProducts: action.payload.userProducts
            })
        case productTypes.DELETE_PRODUCT:
            return({
                ...state, 
                userProducts: state.userProducts.filter(product => product.id !== action.payload),
                availableProducts: state.availableProducts.filter(product => product.id !== action.payload)
            })
            break;

        case productTypes.CREATE_PRODUCT:
            const newProduct = new Product(
                action.payload.id, 
                action.payload.ownerId, 
                action.payload.title, 
                action.payload.imageUrl, 
                action.payload.description, 
                action.payload.price
            );

            return({
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            })


        case productTypes.UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.payload.id)
            const updatedProduct = new Product(
                action.payload.id,
                state.userProducts[productIndex].ownerId,
                action.payload.title,
                action.payload.imageUrl,
                action.payload.description,
                state.userProducts[productIndex].price
            )
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;
            const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.payload.id);
            const updatedAvailableProducts = [...state.availableProducts]
            updatedAvailableProducts[availableProductIndex] = updatedProduct;

            return({
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            })
        default:
           return state; 
    }
    
}

export default productReducer;