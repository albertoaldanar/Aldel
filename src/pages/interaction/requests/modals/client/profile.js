import React, {useState} from "react";
import { View, Text, Platform, StyleSheet, Image } from "react-native";
import ConsultorProfile from '../../../profile/consultor/index';

function Profile(props) {

        return(
            <View style = {styles.container}>
                <ConsultorProfile />
            </View>
        );
}


const styles = StyleSheet.create({
    container: {
      paddingTop: Platform.OS === 'ios' ? 19 : 10,
      backgroundColor: "white",
      flex : 1
    },
    imageStyle: {
        height: 150, 
        width: 150,
        marginBottom: 30
    }, 
});

export default Profile;



