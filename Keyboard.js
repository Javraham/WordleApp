import React from 'react';
import { View , StyleSheet, Text, TouchableOpacity} from 'react-native';

function Keyboard(props) {
    const Key = ({keyValue}) => {
        const bgcolor = props.keyColors.has(keyValue) ? props.keyColors.get(keyValue) : '#EAEDED'
        const textColor = props.keyColors.has(keyValue) ? 'white' : 'black'
        return (
            <TouchableOpacity style = {[styles.key, {backgroundColor: bgcolor, flexGrow: keyValue.length > 1 ? 1 : 0}]} disabled = {props.hasWon} onPress={() => changeLetter(keyValue)}>
                <Text style = {[styles.keyword, {fontSize: keyValue.length > 1 ? 12 : 25, color: textColor}]}>{keyValue}</Text>
            </TouchableOpacity>
        )
    }

    const changeLetter = (key) => {
        key === 'Back' ? props.removeLetter() : key === 'Enter' ? props.enterWord() : props.changeLetter(key)
    }

    const renderkeys = (keys) => {
        return keys.map(key => {
            return <Key key = {key} keyValue = {key}/>
        })
    }

    const KeyRow = ({keys}) => {
        return (
            <View style = {styles.row}>
                {renderkeys(keys)}
            </View>
        )
    }


    return (
        <View style = {styles.keyboard}>
            <KeyRow keys = {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']}/>
            <KeyRow keys = {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']}/>
            <KeyRow keys = {['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Back']}/>
        </View>
    );
}

export default Keyboard;

const styles = StyleSheet.create({
    key: {
        height: 60,    
        justifyContent: 'center',
        borderRadius: 3,
        width: 30,
        alignItems: 'center',
        margin: 3,
    },

    keyword: {
        fontSize: 25,
        fontWeight: 'bold',
    },

    row: {
        flexDirection: 'row',
        flexGrow: 1
    },

    keyboard: {
        width: '100%',
        alignItems: 'center',
    }
})