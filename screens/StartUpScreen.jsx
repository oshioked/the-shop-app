import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import colors from '../constants/colors';
import { useDispatch } from 'react-redux';
import { authTypes } from '../store/actions.types';
import {setLogoutTimer} from '../store/actions/auth.actions';

const StartUpScreen = props =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const tryLogin = async () =>{
            const userData = await AsyncStorage.getItem('userData');
            if(!userData){
                props.navigation.navigate('Auth');
                return;
            }

            const transformedData = JSON.parse(userData);
            const {token, userId, expiryDate} = transformedData;
            
            const expirationDate = new Date(expiryDate);

            const expirationTime = expirationDate.getTime() - new Date().getTime();
            if(expirationDate <= new Date() || !token || !userId){
                props.navigation.navigate('Auth');
                return;
            }
            dispatch({
                type: authTypes.LOG_IN,
                payload: {
                    token,
                    userId
                }
            })
            dispatch(setLogoutTimer(expirationTime))
            props.navigation.navigate('Shop')

        }

        tryLogin();
    }, [dispatch])
    return(
        <View style = {styles.screen}>
            <ActivityIndicator size = 'large' color = {colors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
})


export default StartUpScreen;