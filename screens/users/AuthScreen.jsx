import React, { useReducer, useCallback, useState, useEffect } from 'react';
import { ScrollView, TextInput, View, KeyboardAvoidingView, StyleSheet, Text, Button, Platform, Alert, ActivityIndicator } from 'react-native';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import colors from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { signUp, logIn } from '../../store/actions/auth.actions';

const actionTypes = {
    FORM_INPUT_UPDATE: 'FORM_INPUT_UPDATE'
}

const formReducer = (state, action) =>{
    switch (action.type) {
        case actionTypes.FORM_INPUT_UPDATE:
            const updatedInputValues = {
                ...state.inputValues,
                [action.input]: action.value
            }
            const updatedInputValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            }
            let updatedFormValidity = true;
            for(const key in updatedInputValidities){
                updatedFormValidity = updatedFormValidity && updatedInputValidities[key];
            }
            return {
                inputValues: updatedInputValues,
                inputValidities: updatedInputValidities,
                formValidity: updatedFormValidity
            }
        default:
            return state;
    }
}

const AuthScreen = props =>{
    const dispatch = useDispatch();
    const [mode, setMode] = useState('log-in');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const initialState = {
        inputValues: {
            email: '',
            password: '',
            
        },
        inputValidities: {
            email: false,
            password: false
        },
        formValidity: false
    }

    const [formState, dispatchFormAction] = useReducer(formReducer, initialState);
    const {email, password} = formState.inputValues;
    

    const onAuthHandler = async () =>{
        if(!formState.formValidity){
            Alert.alert('Wrong Input', 'Please check the errors in the form.', [
                {text: 'Okay'}
            ]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            if(mode === 'sign-up'){
                await dispatch(signUp(email, password));
            }
            if(mode === 'log-in'){
                await dispatch(logIn(email, password));
            }
            props.navigation.navigate('Shop')
        } catch (error) {
            setError(error.message);
            setIsLoading(false)
        }
        
    }

    useEffect (() => {
        if(error){
            Alert.alert('An Error Occured', error, [
                {text: 'Okay'}
            ])
        }
    }, [error])



    const inputChangeHandler = useCallback((inputIdentifier, text) =>{
        let isValid = false;
        if(text.trim().length > 0){
            isValid = true;
        }
        dispatchFormAction({
            type: actionTypes.FORM_INPUT_UPDATE,
            input: inputIdentifier,
            value: text,
            isValid: isValid
        })
    }, [dispatchFormAction])

    return(
        <KeyboardAvoidingView behavior = {Platform.OS === 'android' ? null : 'padding'} keyboardVerticalOffset = {50} style = {styles.screen}>
            <LinearGradient colors = {['white', 'black']} style = {styles.gradient}>
                <Card style = {styles.authContainer}>
                    <ScrollView>
                        <Input
                            label = 'Email'
                            keyboardType = 'email-address'
                            required
                            email
                            value = {email}
                            errorText = 'Enter a valid email address'
                            autoCapitalize = 'none'
                            onChangeText = {(text)=>{inputChangeHandler('email', text)}}
                            isValid = {formState.inputValidities.email}
                        />
                        <Input
                            label = 'Password'
                            keyboardType = 'default'
                            secureTextEntry
                            minLength = {5}
                            required
                            errorText = 'Enter a valid password with minLength of 5'
                            value = {password}
                            autoCapitalize = 'none'
                            onChangeText = {(text)=>{inputChangeHandler('password', text)}}
                            isValid = {formState.inputValidities.password}
                        />
                        {
                            isLoading ? 
                            <View style = {styles.spinnerContainer}>
                                <ActivityIndicator color = {colors.primary} size = 'small' />
                            </View>
                            
                            :
                            <React.Fragment>
                                <View style = {styles.buttonContainer}>
                                    <Button 
                                        title = {mode === 'sign-up' ? 'Sign up' : 'Log in'} 
                                        color = {colors.primary} 
                                        onPress = {onAuthHandler}
                                    />
                                </View>
                                <View style = {styles.buttonContainer}>
                                    <Button 
                                        title = {`Switch to ${mode === 'sign-up' ? 'Login' : 'Sign up'}`} 
                                        color = {colors.accent} 
                                        onPress = {()=> setMode((mode === 'sign-up' ? 'log-in' : 'sign-up'))}
                                    />
                                </View> 
                            </React.Fragment>
                            
                        }
                        
                        
                    </ScrollView>
                    
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
        
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    authContainer: {
        maxHeight: 400,
        maxWidth: 400,
        width: '80%',
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    buttonContainer: {
        marginTop: 10
    },
    spinnerContainer: {
        padding: 30
    }
})

export default AuthScreen;