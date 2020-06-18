import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'

const Input = props => {
    
    return(
        <View style = {styles.formControl}>
            <Text style = {styles.label}>{props.label}</Text>
            <TextInput 
                {...props}
                style = {styles.input} 
                value = {props.value}
            />
            {
                props.isValid ? null :
                <View style = {styles.errorContainer}>
                    <Text style = {styles.errorText}>{props.errorText}</Text>
                </View>
                
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    errorContainer: {
        marginVertical: 5
    },
    errorText: {
        fontFamily: 'open-sans',
        color: 'red',
        fontSize: 13
    }
})

export default Input;