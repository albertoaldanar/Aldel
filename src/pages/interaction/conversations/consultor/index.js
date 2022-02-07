import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image, BackHandler } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
//local imports
import NoConversations from './noConversations';
import ConversationsList  from './conversationsList';
import API from '../../../../apis/interaction/interaction';
import setInteractionsData from '../../../../redux/actions/interactions/interactionsActions';

Icon.loadFont();

function Conversations(props) {

        const { setInteractionsData, interactionsData } = props;
        // useEffect(() => {
        //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        //     return backHandler.remove()
        // }, []);

        return(
            <View style = {styles.container}>
                {
                    props.list.length > 0 ? 
                        <ConversationsList data = {props.list} {...props}/> 
                    :
                        <NoConversations /> 
                }
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white"
    },
    imageStyle: {
        height: 150, 
        width: 150,
        marginBottom: 30
    }, 
});

const mapStateToProps = (state) => {
    return {
        interactionsData: state.interactionsData,
    }
}

const mapDispatchToProps = dispatch => ({
    setInteractionsData: (object) => dispatch(setInteractionsData(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
