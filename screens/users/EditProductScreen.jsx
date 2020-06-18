import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import { updateProduct, createProduct } from '../../store/actions/products.actions';
import Input from '../../components/UI/Input';
import colors from '../../constants/colors';

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


const EditProductScreen = props =>{
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => 
        state.products.userProducts.find(prod => prod.id === prodId)
    )
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    
    const initialState = {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description: '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formValidity: editedProduct ? true : false
    }

    const [formState, dispatchFormAction] = useReducer(formReducer, initialState);
    const {title, description, imageUrl, price} = formState.inputValues;

    const dispatch = useDispatch();

    useEffect(()=>{
        if(error){
            Alert.alert('An error occured', error.message, [{text: 'Okay'}])
        }
    }, [error])

    const submitHandler = useCallback( async () =>{
        if(!formState.formValidity){
            Alert.alert('Wrong Input', 'Please check the errors in the form.', [
                {text: 'Okay'}
            ]);
            return;
        }
        setIsLoading(true);
        setError(null)
        try {
            if(Boolean(prodId)){
                await dispatch(updateProduct(prodId, title, description, imageUrl))
            }else{
                await dispatch(createProduct(title, description, imageUrl, +price))
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error)
        }
        setIsLoading(false);
        
    }, [prodId, formState])

    useEffect(()=>{
        props.navigation.setParams({submit: submitHandler})
    }, [submitHandler])

    const inputChangeHandler = (inputIdentifier, text) =>{
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
    }

    if(isLoading){
        return(
           <View style = {styles.centered}>
                <ActivityIndicator size = 'large' color = {colors.primary}/>
            </View> 
        )
        
    }

    return (
        
        <ScrollView>
            <View style = {styles.form}>
                <Input
                    label = "Title"
                    errorText = 'Please enter a valid title'
                    keyboardType = 'default'
                    autoCapitalize = 'sentences'
                    returnKeyType = "next"
                    value = {title}
                    onChangeText = {(text)=>inputChangeHandler('title', text)}
                    isValid = {formState.inputValidities.title}
                />
                <Input
                    label = "Image Url"
                    errorText = 'Please enter a valid image url'
                    keyboardType = 'default'
                    autoCapitalize = 'sentences'
                    returnKeyType = "next"
                    autoCorrect
                    value = {imageUrl}
                    onChangeText = {(text)=>inputChangeHandler('imageUrl', text)}
                    isValid = {formState.inputValidities.imageUrl}
                />
                {
                    editedProduct ? null :
                    <Input
                        label = "Price"
                        errorText = 'Please enter a valid price'
                        keyboardType = 'decimal-pad'
                        returnKeyType = "next"
                        value = {price}
                        onChangeText = {(text)=>inputChangeHandler('price', text)}
                        isValid = {formState.inputValidities.price}
                    />
                }
                <Input
                    label = "Description"
                    errorText = 'Please enter a valid description'
                    keyboardType = 'default'
                    multiline
                    numberOfLines = {3}
                    autoCapitalize = 'sentences'
                    returnKeyType = "next"
                    value = {description}
                    onChangeText = {(text)=>inputChangeHandler('description', text)}
                    isValid = {formState.inputValidities.description}
                />
            </View>
        </ScrollView>
    )
}

EditProductScreen.navigationOptions = navData =>{
    const submitHandler = navData.navigation.getParam('submit');

    return{
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: ()=>(
            <HeaderButtons HeaderButtonComponent = {CustomHeaderButton}>
                <Item
                    iconName = {Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    title = 'Save' 
                    onPress = {submitHandler}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default EditProductScreen;