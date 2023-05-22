import React, { useEffect, useRef, useState } from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback, Alert, Animated} from 'react-native'
import Keyboard from './Keyboard';
import { wordList } from './words';


function WordleBox(props) {
    const map = useRef(new Map())
    const [msg, setMsg] = useState('')
    const [word, setWord] = useState('')
    const [gameEnded, setGame] = useState(false)
    const [words, updateWord] = useState([[], [], [], [], [], []])
    const [index, setIndex] = useState(0)
    const [colorArray, setColorArray] = useState(Array(6).fill(Array(5).fill('white')))
    const [keyColors, setKeyColors] = useState(new Map())
    const isAWin = false
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const winAnimation = useRef(new Animated.Value(1)).current;


    useEffect(() => {
        shake();
    }, [msg]);

    const shake = () => {
        Animated.timing(shakeAnimation, { 
            toValue: 1, 
            duration: 100, 
            useNativeDriver: true })
        .start(() => Animated.timing(shakeAnimation, { 
            toValue: 2, 
            duration: 100, 
            useNativeDriver: true })
        .start(() => Animated.timing(shakeAnimation, { 
            toValue: 1, 
            duration: 100, 
            useNativeDriver: true })
        .start(() => Animated.timing(shakeAnimation, { 
            toValue: 0, 
            duration: 100, 
            useNativeDriver: true })
        .start())));
    };

    const scaleRow = () => {
        Animated.timing(winAnimation, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true})
        .start(() => Animated.timing(winAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true})
        .start(() => Animated.timing(winAnimation, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true})
        .start(() => Animated.timing(winAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true})
        .start(() => Animated.timing(winAnimation, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true})
        .start(() => Animated.timing(winAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true})
        .start())))))
    }
        
    console.log(words.lastIndexOf(['H', 'O', 'N', 'E', 'Y']), words)

    const GameSquare = ({bgcolor, rowNum, letter}) => {
        return (
            <View style = {[styles.square, {backgroundColor: bgcolor, borderColor: rowNum < index ? 'white' : typeof letter !== 'undefined' ? 'grey' : 'lightgrey'}]}>
                <Text style = {{fontSize: 28, fontWeight: 600, color: rowNum < index ? 'white' : 'black'}}>{letter}</Text>
            </View>
        )
    }

    const generateWord = () => {
        const wordleWord = wordList.filter(word => word.length === 5);
        const fiveletterword = wordleWord[Math.floor(Math.random()*wordleWord.length)]
        return fiveletterword
    }

    useEffect(() => {
        if(gameEnded){
            setGame(false);
            updateWord([[], [], [], [], [], []]);
            setColorArray(Array(6).fill(Array(5).fill('white')));
            setIndex(0)
            setWord(generateWord().toUpperCase())
            setMsg('')
            map.current = new Map()
            setKeyColors(map.current)
        }
    }, [props.restart])

    useEffect(() => {
        setWord(generateWord().toUpperCase())
    }, [])


    const GameRow = ({rowNum}) => {
        return colorArray[rowNum].map((val, i) => {
            return (
                <Animated.View key={i} style = {{transform: gameEnded && rowNum === index-1 ? [{scale: winAnimation}] : [{scale: 1}]}}>
                    <GameSquare bgcolor = {val} rowNum = {rowNum} letter = {words[rowNum][i]}/>
                </Animated.View>
            )
        })
    }

    const RenderGameRow = ({rowNum}) => (
            <View style = {styles.row}>
                <GameRow rowNum = {rowNum}/>
            </View>
        )

    const updateLetter = (letter) => {
        let wordsArray = [...words];
        wordsArray[index].push(letter)
        updateWord(wordsArray)
    }

    const backspace = () => {
        let wordsArray = [...words];
        wordsArray[index].pop()
        updateWord(wordsArray)
    }

    const enter = () => {
        if(words[index].length === 5){
            if(!wordList.includes(words[index].join('').toLowerCase())){
                setMsg('Not a Valid Word!')
            }
            else{
                setMsg('')
                checkWord()
                setIndex(prev => prev + 1)
            }
        }
        else{
            setMsg('Too Short!')
        }
    }

    const alert = () => {
        Alert.alert('The answer was ' + word.toLowerCase(), '', [
            {text: 'Ok'}
        ])
    }

    const checkWord = () => {
        if(words[index].join('') === word){
            identifyCorrectLetters(words[index])
            setMsg('You Won :)')
            scaleRow()
            setGame(true)
        }
        else{
            identifyCorrectLetters(words[index])
            if(index === 5){
                setMsg('You Lost :(, Answer: ' + word)
                setGame(true)
            }
        }
    }

    const setMap = (val, color) => {
        if(!map.current.has(val)){
            map.current.set(val, color)
        }
        else{
            if(map.current.get(val) === '#F1C40F' && color === '#2ECC71'){
                map.current.set(val, color)
            }
        }
    }

    const identifyCorrectLetters = (wordCheck) => {
        const bgArray = wordCheck.map((val, index, wordCheck) => {
           
            if (wordCheck[index] === word[index]) {
                setMap(val, '#2ECC71')
                return '#2ECC71'
            }
            let wrongWord = wrongGuess = 0;
            for (let i = 0; i < word.length; i++) {
                // count the wrong (unmatched) letters
                if (word[i] === wordCheck[index] && wordCheck[i] !== wordCheck[index] ) {
                    wrongWord++;
                }
                if (i <= index) {
                    if (wordCheck[i] === wordCheck[index] && word[i] !== wordCheck[index]) {
                        wrongGuess++;
                    }
                }

                // an unmatched guess letter is wrong if it pairs with 
                // an unmatched word letter
                if (i >= index) {
                    if (wrongGuess === 0) {
                        break;
                    } 
                    if (wrongGuess <= wrongWord) {
                        setMap(val, '#F1C40F')
                        return '#F1C40F'
                    }
                }
            }

            setMap(val, '#A6ACAF')
            return '#A6ACAF'
        })
        setKeyColors(map.current)
        setColorArray(prev => {
            const newArray = [...prev];
            newArray[index] = bgArray
            return newArray
        })
    }
    console.log(word)

    const spin = shakeAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: ['0deg', '-10deg', '10deg']
    })


    return (
        <>
            <View style = {styles.board}>
                <RenderGameRow rowNum={0}/>
                <RenderGameRow rowNum={1}/>
                <RenderGameRow rowNum={2}/>
                <RenderGameRow rowNum={3}/>
                <RenderGameRow rowNum={4}/>
                <RenderGameRow rowNum={5}/>
                <Animated.View style = {{transform: [{rotate: spin}], marginTop: 15, backgroundColor: msg === '' ? 'white' : 'lightgrey', borderRadius: 10}}>
                    <Text style = {{ textAlign: 'center', padding: 5, fontWeight: 600, color: '#566573'}}>{msg}</Text>
                </Animated.View>
            </View>
            <Keyboard changeLetter = {(letter) => words[index].length <= 4 ? updateLetter(letter) : null} 
                    keyColors = {keyColors}
                    removeLetter = {() => words[index].length > 0 ? backspace() : null} 
                    enterWord = {() => enter()}
                    hasWon = {gameEnded}/>
        </>
    );
}

export default WordleBox;

const styles = StyleSheet.create({
    square: {
        height: 60,
        width: 60,
        borderColor: 'lightgrey',
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3
    },

    row: {
        flexDirection: 'row', 
        marginBottom: 5
    },

    board: {
       justifyContent: 'space-between',
       alignItems: 'center'
    }
})