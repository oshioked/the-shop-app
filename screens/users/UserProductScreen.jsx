import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, Button, Alert, View, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import colors from '../../constants/colors';
import { deleteProduct } from '../../store/actions/products.actions';

const UserProductScreen = props =>{

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)

    const userProduct = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = id =>{
        props.navigation.navigate('EditProduct', {productId: id})
    }

    useEffect(()=>{
        if(error){
            Alert.alert('An error occured', error.message, [{text: 'Okay'}])
        }
    }, [error])

    const deleteHandler = (id) =>{
        Alert.alert('Are you sure', 'you want to delete this item?', [
            {text: 'No', style: 'default'},
            {
                text: 'Yes', 
                style: 'destructive', 
                onPress: async ()=>{
                    setError(null);
                    setIsLoading(true)
                    try {
                        await dispatch(deleteProduct(id))
                    } catch (error) {
                        setError(error)
                    }
                    setIsLoading(false)
                }
            }
        ])
    }

    if(isLoading){
        return(
            <View style = {styles.centered}>
                <ActivityIndicator size = 'large' color = {colors.primary} />
            </View>
        )
    }

    if(!isLoading && userProduct.length === 0){
        return (
            <View style = {styles.centered}>
                <Text>No products found. Start creating some</Text>
            </View>
        )
    }
    return(
        <FlatList
            data = {userProduct}
            renderItem = {(itemData => 
                <ProductItem 
                    image = {itemData.item.imageUrl}
                    title = {itemData.item.title}
                    price = {itemData.item.price}
                    onSelect = {()=>{
                        editProductHandler(itemData.item.id)
                    }}
                >
                    <Button 
                        color = {colors.primary} 
                        onPress = {()=>{
                            editProductHandler(itemData.item.id)
                        }}
                        title = 'Edit'
                    />
                    <Button 
                        color = {colors.primary} 
                        onPress = {()=>deleteHandler(itemData.item.id)}
                        title = 'Delete'
                    />
                </ProductItem>
            )}
        />
    )
}

UserProductScreen.navigationOptions = (navData) =>({
    headerTitle: 'Your Products',
    headerLeft: ()=>(
        <HeaderButtons HeaderButtonComponent = {CustomHeaderButton}>
            <Item 
                iconName = {Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                title = 'Menu' 
                onPress = {()=>{
                    navData.navigation.toggleDrawer()
                }}
            />
        </HeaderButtons>
    ),
    headerRight: ()=>(
        <HeaderButtons HeaderButtonComponent = {CustomHeaderButton}>
            <Item 
                iconName = {Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                title = 'New' 
                onPress = {()=>{
                    navData.navigation.navigate('EditProduct')
                }}
            />
        </HeaderButtons>
    )
})

const styles  = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
})

export default UserProductScreen;