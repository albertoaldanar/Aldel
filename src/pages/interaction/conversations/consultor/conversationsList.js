import React, {useState} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image, FlatList, Modal} from "react-native";
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
//local imports

function ConversationsList(props) {
        
        const { data } = props;

        function renderMessage(item){
            if(item.tipo_ultimo_mensaje === "text"){
                return <Text> {item.texto_ultimo_mensaje}</Text>
            } else {
                switch (item.tipo_ultimo_mensaje) {
                    case 'VoiceNote':
                        return <Text> <Icon name ="microphone" size = {15} color= "gray"/>  Audio</Text>
                        break;

                    case 'Video':
                        return <Text> <Icon name ="play" size = {15} color= "gray"/>  Video</Text>
                        break;

                    case 'image':
                        return <Text> <Icon name ="image" size = {15} color= "gray"/>  Imagen</Text>
                        break;
                    default:
                        break;
                }
            }
        }

        const renderItem = ({ item }) => (
            <TouchableOpacity style = {styles.chatList} onPress= {() => props.navigation.navigate("ConversationConsultor", {data: item})}>
                <View style = {{flexDirection: "row"}}>
                    <FastImage
                        style={styles.imageStyle}
                        source = {{
                            uri: item.cliente.foto_perfil,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal
                        }} 
                    />
                    <View>
                        <Text style = {{fontWeight: "600", fontSize: 17}}>{item.cliente.nombre} {item.cliente.apellido_paterno} </Text>
                        <Text style = {{fontWeight: "400", fontSize: 12, color: "gray", marginTop: 8}}> 
                            {
                                item.ultimo_mensaje.tipo_ultimo_mensaje === null ? 
                                    null
                                :
                                    renderMessage(item.ultimo_mensaje)
                            }
                        </Text>
                    </View>
                </View>

                <View>
                    <Text style = {{color: "#03b388", fontSize: 12}}>
                        10:21
                    </Text> 
                    
                    {
                        item.ultimo_mensaje.mensajes_sin_leer_consultor > 0 ?
                            <View style = {{borderRadius: 50, backgroundColor: "#03b388", marginTop: 10, padding: 5}}>
                                <Text style = {{color: "white", fontSize: 12, textAlign: "center"}}>
                                    {item.ultimo_mensaje.mensajes_sin_leer_consultor}
                                </Text>
                            </View>
                        : null
                    }

                </View>
                
            </TouchableOpacity>
        );

        return(
            <View style = {styles.container}>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_consulta}
                /> 
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white", 
      height: "100%"
    },
    listItemContainer: {
        padding: 18, 
        borderRadius: 5, 
        borderColor: "gray",
        borderBottomColor: "#dcdcdc", 
        borderBottomWidth: 0.5, 
        // borderTopColor: "#f5f5f5", 
        // borderTopWidth: 0.5, 
        // backgroundColor: "#ffffff",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 2.84,
        // elevation: 3,
        // marginBottom: 20
    }, 
    button: {
        paddingTop: 16
    }, 
    interactionHeader: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 10
    },
    title: {
        marginLeft: 10, 
        fontSize: 19,
        marginTop: 6, 
        fontWeight: "700"
    }, 
    newInteraction: {
        position: "absolute", 
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#03b388", 
        bottom: 25,
        right: 25, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    chatList: {
        padding: 15, 
        borderBottomColor: "#f5f5f5", 
        borderBottomWidth: 0.5, 
        borderTopColor: "#f5f5f5", 
        borderTopWidth: 0.5, 
        flexDirection: "row", 
        justifyContent: "space-between", 
    }, 
    toolIcons: {
        flexDirection: "row", 
        marginRight: 10, 
        marginTop: 5
    }, 
    imageStyle: {
        height: 50, 
        width: 50, 
        borderRadius: 50,
        marginRight: 19,
    },
    searchModalButton: {
        backgroundColor: "#03b388",
        padding: 10,
        position: "absolute", left: 5, right: 5, bottom: 5, borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    emptyImageStyle: {
        height: 250, 
        width: 250,
        marginBottom: 15
    }, 

});

export default ConversationsList;
