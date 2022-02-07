import React, {useState} from "react";
import { View, Text, Platform, StyleSheet, Image } from "react-native";
import Bell from '../../../../assets/emptyImages/bell.png';

function NoRequests(props) {

        return(
            <View style = {styles.container}>

                <View                     
                    style = {{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center', 
                        marginTop: "12%"
                    }}
                >
                    <Image style={styles.imageStyle} source={Bell}/>
                    <Text style = {{fontSize: 18, fontWeight: "600", marginBottom: 7, textAlign: "center"}}>¡No tienes ninguna solicitud en espera!</Text>
                    <Text style = {{fontSize: 14, fontWeight: "400", textAlign: "center",paddingLeft: 20, paddingRight: 20, color: "gray"}}>Aqui podras ver todas las solicitudes que has realizado.</Text>
                </View>

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

export default NoRequests;



