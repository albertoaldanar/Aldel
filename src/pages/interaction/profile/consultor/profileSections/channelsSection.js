import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

function ChannelsSection(props) {
    console.log(props);

    function channelIcon(channel){
        switch (channel) {
            case "Mensaje":
                return "comments"
            case "Videollamada":
                return "tv"
            case "Llamada":
                return "phone"
            case "Notas de Voz":
                return "microphone"
            case "Imagenes":
                return "photo"
            case "Videos":
                return "play"
            default:
              //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
              return ""
          }
    }

    const renderChannels = ({item}) => (
        <View style = {{flexDirection: "row"}}>
            
            <Text style = {{marginBottom: 15, fontWeight: "300", color: "gray"}}>
               <Icon color = "#03b388" size ={12} name = {channelIcon(item.nombre)}/>  {item.nombre}
            </Text>

            <Text style = {{marginLeft: 10, marginRight: 10}}> - </Text>

            <Text style = {{marginBottom: 15, fontWeight: "300", color: "gray"}}>$ {Number(item.costo).toFixed(2)} </Text>
            
        </View>
    );  


    return(
        <View style ={styles.container}>

            {/* <View style = {{flexDirection: "row", justifyContent: "space-between"}}>    
                <Text style = {{marginBottom: 25, fontWeight: "300", color: "gray", fontStyle: "italic"}}>Canal</Text>
                <Text style = {{marginBottom: 25, fontWeight: "300", color: "gray", fontStyle: "italic"}}>Habilitado</Text>
                <Text style = {{marginBottom: 25, fontWeight: "300", color: "gray", fontStyle: "italic"}}>Precio</Text>

            </View> */}
            <FlatList 
                data = {props.channels} 
                renderItem = {renderChannels}
                keyExtractor = {item => item.canal} 
            />
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
      backgroundColor: "white", 
      padding: 10, 
      paddingTop: 15, 
      paddingBottom: 15
    }

});


export default ChannelsSection;



