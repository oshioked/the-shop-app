import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native';
import colors from '../../constants/colors';
import Card from '../UI/Card';

const ProductItem = props =>{
    let Touchable = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21){
        Touchable = TouchableNativeFeedback;
    }

    return(
        
            <Card style = {styles.product}>
                <Touchable onPress = {props.onSelect} useForeground>
                    <View>
                        <View style = {styles.imageContainer}>
                            <Image style = {styles.image} source = {{uri: props.image}} />
                        </View>
                        
                        <View style = {styles.details}>
                            <Text style = {styles.title}>{props.title}</Text>
                            <Text style =  {styles.price}>${props.price.toFixed(2)}</Text>
                        </View>
                        
                        <View style = {styles.actions}>
                            {
                                props.children
                            }
                        </View>
                    </View>
                </Touchable>    
            </Card>
        
    )
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20,
        overflow: 'hidden',
    },
    imageContainer: {
        height: '60%',
        width: '100%',
    },
    image: {
        height: '100%',
        width: '100%'
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    },
    title: {
        fontSize: 18,
        marginVertical: 2,
        fontFamily: 'open-sans-bold'

    },
    price: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'open-sans'
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '22%',
        paddingHorizontal: 20
    }
})
export default ProductItem;