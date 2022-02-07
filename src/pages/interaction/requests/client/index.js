import React, {useState} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";
import NoRequests from './noRequests';
import RequestsList  from './requestsList';

function Requests(props) {
        console.log('list', props.list)

        return(
            <View style = {styles.container}>
                {
                    props.list.length > 0 ?
                        <RequestsList data = {props.list} {...props}/> 
                    :
                        <NoRequests /> 
                }
            </View>
        );
}

const mapStateToProps = (state) => {
    return {
        aldel: state.aldel,
    }
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

export default connect(mapStateToProps)(Requests);



