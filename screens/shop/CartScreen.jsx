import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../constants/colors';
import CartItem from '../../components/shop/CartItem';
import { removeFromCart } from '../../store/actions/cart.actions';
import { addOrder } from '../../store/actions/orders.actions';
import Card from '../../components/UI/Card';

const CartScreen = (props) =>{

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)


    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for(const key in state.cart.items){
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    })

    const dispatch = useDispatch()

    const onOrderHandler = async () =>{
        try {
            setError(null);
            setIsLoading(true);
            await dispatch(addOrder(cartItems, cartTotalAmount));
            
        } catch (error) {
            setError(error)
        }
        setIsLoading(false)
    }



    useEffect(()=>{
        if(error){
            Alert.alert('Error placing order', 'Some sort of error', [{
                text: 'Okay'
            }])
        }
    }, [error])

    return(
        <View style = {styles.screen}>
            <Card style = {styles.summary}>
                <Text style = {styles.summaryText}>
                    Total: <Text style = {styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                {
                    isLoading ? <ActivityIndicator size = 'small' color = {colors.primary}/> :
                    <Button 
                        color = {colors.primary} 
                        title = 'Order Now' 
                        disabled = {cartItems.length === 0} 
                        onPress = {onOrderHandler}
                    />
                }
                
            </Card>
            <FlatList 
                data = {cartItems}
                keyExtractor = {item => item.productId} 
                renderItem = {itemData => 
                    <CartItem 
                        deleteAble = {true}
                        quantity = {itemData.item.quantity} 
                        title = {itemData.item.productTitle}
                        amount = {itemData.item.sum}
                        onRemove = {()=>{
                            dispatch(removeFromCart(itemData.item.productId))
                        }}
                    />
                }
            />
        </View>
        
    )
}

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
    screen: {
        margin: 20,

    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: colors.primary
    }
})

export default CartScreen;