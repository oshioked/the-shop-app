import React, { useEffect, useState, useCallback } from 'react';
import {Text, StyleSheet, View, Button, FlatList, Platform, ActivityIndicator, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { fetchOrders } from '../../store/actions/orders.actions';
import colors from '../../constants/colors';

const OrdersScreen = props =>{
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState(null);

    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () =>{
        setIsRefreshing(true);
        setError(null);
        try {
            await dispatch(fetchOrders());
        } catch (error) {
            setError(error)
        }
        setIsRefreshing(false);
    }, [setError, setIsRefreshing, dispatch, fetchOrders])

    useEffect(()=>{
        setIsLoading(true);
        loadOrders().then(()=> setIsLoading(false));
        
    }, [loadOrders]);

    if(error){
        return(
            <View style = {styles.centered}>
                <Text>Error fetching your orders.</Text>
                <Button title = 'Try again' onPress = {loadOrders} color = {colors.primary}/>
            </View>
        )
    }

    if(isLoading){
        return(
            <View style = {styles.centered}>
                <ActivityIndicator size = 'large' color = {colors.primary}/>
            </View>
        )
    }

    if(!isLoading && orders.length === 0){
        return(
            <View style = {styles.centered}>
                <Text>You currently have no orders.</Text>
            </View>
        )
    }
    return(
        <FlatList
            onRefresh = {loadOrders}
            refreshing = {isRefreshing}
            data = {orders}
            keyExtractor = {item => item.id}
            renderItem = {itemData => (
                <OrderItem
                    items = {itemData.item.items}
                    amount = {itemData.item.totalAmount}
                    date = {itemData.item.readableDate}
                />
            )}
        />
    )
}

OrdersScreen.navigationOptions = (navData) =>({
    headerTitle: 'Your Orders',
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
    )
})

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
})



export default OrdersScreen;