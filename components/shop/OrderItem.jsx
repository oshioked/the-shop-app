import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import CartItem from './CartItem';
import Card from '../UI/Card';

const OrderItem = props =>{
    const [showDetails, setShowDetails] = useState(false)
    return(
        <Card style = {styles.orderItem}>
            <View style = {styles.summary}>
                <Text style = {styles.totalAmount}>${Math.round(props.amount.toFixed(2) * 100) / 100}</Text>
                <Text style = {styles.date}>{props.date}</Text>
            </View>
            <Button 
                color = {colors.primary} 
                title = {!showDetails ? 'Show Detail' : 'Hide Detail' }
                onPress = {()=>{
                    setShowDetails((prevState => !prevState))
                }}
            />
            {
                showDetails
                ? <View style = {styles.detailItems}>
                    {props.items.map((item => 
                        <CartItem 
                            key = {item.productId} 
                            deleteAble = {false} 
                            quantity = {item.quantity} 
                            amount = {item.sum} 
                            title = {item.productTitle} 
                        />
                    ))}
                </View>
                : null
            }
        </Card >
    )
}

const styles = StyleSheet.create({
    orderItem: {
        marginHorizontal: 20,
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    },
    detailItems: {
        width: '100%'
    }
})

export default OrderItem;