import React, {useState} from "react";
import { View, Text, Platform, StyleSheet, Image } from "react-native";

function Profile(props) {

        return(
            <View style = {styles.container}>
                <Text style = {{marginTop: 200}} onPress = {props.closeModal}>PROFILE</Text>
            </View>
        );
}


const styles = StyleSheet.create({
    container: {
      paddingTop: Platform.OS === 'ios' ? 19 : 10,
      backgroundColor: "white"
    },
    imageStyle: {
        height: 150, 
        width: 150,
        marginBottom: 30
    }, 
});

export default Profile;



