import React, {useState} from "react";
import { View, Text, Platform, StyleSheet, Image } from "react-native";

function NoConversations(props) {

        return(
            <View
                style = {{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: "15%"
                }}
            >

                <Image style={styles.imageStyle} source={{uri: "https://cdn-icons-png.flaticon.com/512/3040/3040226.png"}}/>
                <Text style = {{fontSize: 18, fontWeight: "600", marginBottom: 7, textAlign: "center"}}>¡No tienes ninguna conversación !</Text>
                <Text style = {{fontSize: 14, fontWeight: "400", textAlign: "center",paddingLeft: 20, paddingRight: 20, color: "gray"}}>Tus convresaciones se mostrarán aqui</Text>
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

export default NoConversations;
