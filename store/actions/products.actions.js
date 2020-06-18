import { productTypes } from "../actions.types";
import Product from "../../models/Product";

export const deleteProduct = (productId) => async (dispatch, getState) => {
    const token = getState().auth.token
    try {
        const response = await fetch(`https://rn-shop-app1.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        });

        if(!response.ok){
            throw new Error({message: 'Error deleting proudct'})
        }

        dispatch({
            type: productTypes.DELETE_PRODUCT,
            payload: productId
        })
    } catch (error) {
        throw error
    }
    
}

export const fetchProducts = () => async (dispatch, getState) =>{
    const userId = getState().auth.userId;
    try {
        const response = await fetch('https://rn-shop-app1.firebaseio.com/products.json');

        const data = await response.json();
        let loadedProducts = [];
        for(const key in data){
            loadedProducts.push(new Product(
                key, 
                data[key].ownerId, 
                data[key].title, 
                data[key].imageUrl, 
                data[key].description, 
                data[key].price 
            ))
        }

        if(!response.ok){
            throw new Error('Something went wrong')
        }
        dispatch({
            type: productTypes.FETCH_PRODUCTS,
            payload: {products: loadedProducts, userProducts: loadedProducts.filter(prod => prod.ownerId === userId)}
        })
    } catch (error) {
        throw error;
    }
    
}

export const createProduct = (title, description, imageUrl, price) =>{
    return async (dispatch, getState) =>{
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://rn-shop-app1.firebaseio.com/products.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId
                })
            });

            if(!response.ok){
                throw new Error('Error creating product')
            }

            const data = await response.json();
            dispatch({
                type: productTypes.CREATE_PRODUCT,
                payload: {id: data.name, title, description, ownerId: userId, imageUrl, price}
            })
        } catch (error) {
            throw new Error(error)
        }
        
    }
}

export const updateProduct = (id, title, description, imageUrl) => async (dispatch, getState)=>{
    const token = getState().auth.token;
    try {
        const response = await fetch(`https://rn-shop-app1.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        });

        if(!response.ok){
            throw new Error('Error updating product')
        }
        
        dispatch({
            type: productTypes.UPDATE_PRODUCT,
            payload: {id, title, description, imageUrl}
        })
    } catch (error) {
        throw new Error(error)
    }
    
}