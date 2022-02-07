
import React, {useState} from "react";
import { View, Text, Platform, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";

const Answers = (props) => {
    console.log('answers - ', props.answers);

    const renderItem = ({ item, index }) => (
        <View style= {styles.listContainer}>
            <View style ={styles.answerContainer}>
                <Text style = {styles.question}> {index + 1}. {item.pregunta}</Text>
                <Text style= {styles.answer}>{item.respuesta}</Text>
            </View>

        </View>
    );  

    return(
         <View style = {styles.container}>
            <TouchableOpacity
                 onPress = {props.closeModal}
                 style = {styles.closeButton}
            >   
               <Text style = {{fontSize: 17}}> X </Text> 
            </TouchableOpacity>
            <FlatList
                data={props.answers}
                renderItem={renderItem}
                keyExtractor={item => item.id_pregunta_formulario}
            /> 

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 19 : 10,
        backgroundColor: "white",
        flex: 1
    },
    closeButton: {
        margin: 8,
        marginTop: 12, 
        padding: 10
    },
    listContainer: {
        margin: 20
    },
    question: {
        fontSize: 16,
        fontWeight: '300',
        marginBottom: 9, 
        color: '#696969'
    }, 
    answer: {
        fontWeight: '300',
        marginLeft: 30,
        fontSize: 14,
        fontStyle: 'italic'
    },
    answerContainer: {
        backgroundColor: "#f5f5f5",
        borderRadius: 5,
        elevation: 2,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
    }
});

export default Answers;
