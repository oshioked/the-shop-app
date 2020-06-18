import React from 'react'
import { createAppContainer, SafeAreaView, createSwitchNavigator } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Ionicons} from '@expo/vector-icons';
import {Platform, View, Button, Text} from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverview';
import colors from '../constants/colors';
import ProductDetailScreen from '../screens/shop/ProductDetail';
import CartScreen from '../screens/shop/CartScreen';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductScreen from '../screens/users/UserProductScreen';
import EditProductScreen from '../screens/users/EditProductScreen';
import AuthScreen from '../screens/users/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import { useDispatch } from 'react-redux';
import { logOut } from '../store/actions/auth.actions';

const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : colors.primary
}
const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetails: ProductDetailScreen,
    Cart: CartScreen
},
{
    defaultNavigationOptions: defaultStackNavOptions,
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name = {Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size  = {23}
                color = {drawerConfig.tintColor}
            />
        )
    }
})

const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, 
{
   defaultNavigationOptions: defaultStackNavOptions,
   navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name = {Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size  = {23}
                color = {drawerConfig.tintColor}
            />
        )
    }
})

const AdminNavigator = createStackNavigator({
    UserProduct: UserProductScreen,
    EditProduct: EditProductScreen
}, 
{
   defaultNavigationOptions: defaultStackNavOptions,
   navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name = {Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size  = {23}
                color = {drawerConfig.tintColor}
            />
        )
    }
})


const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
},{
    contentOptions: {
        activeTintColor: colors.primary
    },
    contentComponent: props =>{
        const dispatch = useDispatch();
        return(
            <View style = {{flex: 1, paddingTop: 30}}>
                <SafeAreaView forceInset = {{top: 'always', horizontal: 'never',}}>
                    <DrawerNavigatorItems {...props} />
                    <Button title = 'Logout' color = {colors.primary} onPress = {()=>{
                        dispatch(logOut());
                        props.navigation.navigate('Auth');
                    }}/>
                </SafeAreaView>
            </View>
        )
    }
})

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
},
{
    defaultNavigationOptions: defaultStackNavOptions
})


const MainNavigator = createSwitchNavigator({
    StartUp: StartUpScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
})


export default createAppContainer(MainNavigator);