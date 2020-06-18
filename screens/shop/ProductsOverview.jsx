import React, { useEffect, useState, useCallback } from 'react';

import { FlatList, StyleSheet, Text, Platform, Button, View, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import { addToCart } from '../../store/actions/cart.actions';
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton';
import colors from '../../constants/colors';
import { fetchProducts } from '../../store/actions/products.actions';

const ProductsOverviewScreen = (props) =>{
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState()
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback( async () =>{
        setIsRefreshing(true)
        setError(undefined)
        try {
            await dispatch(fetchProducts());
        } catch (error) {
            setError(error)
        }
        setIsRefreshing(false)
    }, [dispatch, setIsLoading, setError, setIsRefreshing])


    useEffect(()=>{
        setIsLoading(true)
        loadProducts().then(()=>setIsLoading(false))
    }, [loadProducts, setIsLoading])

    const onSelectHandler = (itemData) =>{
        props.navigation.navigate('ProductDetails', {
            productId: itemData.item.id, 
            productTitle: itemData.item.title
        })
    }
    if(error){
        return(
            <View style = {styles.centered}>
                <Text>An error occured</Text>
                <Button title = 'Try again' color = {colors.primary}  onPress = {loadProducts}/>
            </View>
        )
    }


    if(isLoading){
        return(
            <View style={styles.centered}>
                <ActivityIndicator size = 'large' color = {colors.primary}/>
            </View>
        )
    }

    if(!isLoading && products.length === 0){
        return(
            <View style = {styles.centered}>
                <Text>No products found. Maybe start adding some</Text>
            </View>
        )
    }
    
    return(
        <FlatList
            onRefresh = {loadProducts}
            refreshing = {isRefreshing}
            data = {products}
            keyExtractor = {item => item.id}
            renderItem = {itemData => (
                <ProductItem 
                    image = {itemData.item.imageUrl}
                    title = {itemData.item.title}
                    price = {itemData.item.price}
                    onSelect = {()=>onSelectHandler(itemData)}
                >
                    <Button 
                        color = {colors.primary} 
                        onPress = {()=>onSelectHandler(itemData)} 
                        title = 'View Details'
                    />
                    <Button 
                        color = {colors.primary} 
                        onPress = {()=>{
                            dispatch(addToCart(itemData.item))
                        }} 
                        title = 'Add to Cart'
                    />
                </ProductItem>
            )}
        />
    )
}

ProductsOverviewScreen.navigationOptions = (navData) => ({
    headerTitle: 'All Products',
    headerRight: ()=>(
        <HeaderButtons HeaderButtonComponent = {CustomHeaderButton}>
            <Item title = 'Cart' iconName = {Platform.OS === 'android' ?  'md-cart' : 'ios-cart'}  onPress = {()=>{
                navData.navigation.navigate('Cart')
            }}/>
        </HeaderButtons>
    ),
    headerLeft: ()=>(
        <HeaderButtons HeaderButtonComponent = {CustomHeaderButton}>
            <Item 
                title = 'Menu' 
                iconName = {Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress = {()=>{
                    navData.navigation.toggleDrawer()
                }}
            />
        </HeaderButtons>
    )
})


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen;