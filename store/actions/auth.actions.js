import { authTypes } from "../actions.types"
import { AsyncStorage } from "react-native";

export const signUp = (email, password) => async (dispatch) =>{
    try {
       const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBN__-D8NcxNFOZjMWQLGEkvHhPUHQrGc4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        })

        if(!response.ok){
            const errorResData = await response.json();
            
            const errorId = errorResData.error.message;
            console.log(errorResData)
            let message = "Something went wrong";

            if(errorId){
                message = errorId;
            }

            if(errorId === 'EMAIL_EXISTS'){
                message = "This email already exist"
            }
            
            throw new Error(message);
        }

        const data = await response.json();
        dispatch({
            type: authTypes.SIGN_UP,
            payload: {
                token: data.idToken,
                userId: data.localId
            }
        }) 
        dispatch(setLogoutTimer(parseInt(data.expiresIn) * 1000))

        const expirationDate = new Date(new Date().getTime() + parseInt(data.expiresIn) * 1000).toISOString()
        saveDataToStorage(data.idToken, data.localId, expirationDate);
    } catch (error) {
        throw error;
    }
    
}

export const logIn = (email, password) => async (dispatch) =>{
    try {
       const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBN__-D8NcxNFOZjMWQLGEkvHhPUHQrGc4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        })

        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = "Something went wrong";
            if(errorId === 'EMAIL_NOT_FOUND'){
                message = "This email doesn't exist"
            }else if (errorId === 'INVALID_PASSWORD'){
                message = 'This password is invalid'
            }
            throw new Error(message);
        }

        const data = await response.json();

        dispatch({
            type: authTypes.LOG_IN,
            payload: {
                token: data.idToken,
                userId: data.localId
            }
        })
        dispatch(setLogoutTimer(parseInt(data.expiresIn) * 1000))
        const expirationDate = new Date(new Date().getTime() + parseInt(data.expiresIn) * 1000).toISOString()
        saveDataToStorage(data.idToken, data.localId, expirationDate);
    } catch (error) {
        throw error;
    }
}


let timer;

const clearLogoutTimer = () =>{
    if(timer){
        clearTimeout(timer);
    }
}

export const logOut = () =>{
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return({
        type: authTypes.LOG_OUT
    })
}

export const setLogoutTimer = expirationTime => (dispatch) =>{
    timer = setTimeout(()=>{
        dispatch(logOut());
    }, expirationTime)
}

const saveDataToStorage = (token, userId, expiryDate) =>{
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token, 
            userId, 
            expiryDate
        })
    )
}