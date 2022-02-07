import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, FlatList } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//local imports
import API from '../../../apis/admin/adminSetup';
import LoaderModal from '../../../utils/modalLoader';
import { setChannels, changeChannelsState } from '../../../redux/actions/admin/channels/channelsActions';

function ChannelSetup(props) {

        const { setChannels, channelsData, changeChannelsState } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const insets = useSafeAreaInsets();

        useEffect(() => {
            getChannelsData();
        }, [])

        async function getChannelsData(){

            try {
                const ID = await AsyncStorage.getItem("USER");    
                const getChannelsResponse = await API.getChannels(ID);
    
                if (getChannelsResponse.status == 200) {
                    setChannels({data: getChannelsResponse.data});

                } else if(getChannelsResponse.errortipo == -2){
                    setLoadingModal(false);
                    console.log("error!")
                    
                }
              
            } catch (err) {
                alert(err);
    
                if (err instanceof TypeError) {
                    if (err.message == 'Network request failed') {
                        alert("No hay internet");
                           console.log("No hay internet")
                    }
                    else {
                        alert("El servicio esta fallando.")
                        console.log('Ups..', 'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde');
                    }
                }
            }
        }

        async function changeChannelsData(){
            setLoadingModal(true);

            try {  
                const changeChannelsResponse = await API.updateChannels(channelsData);
    
                console.log('update usuario respuest =>', changeChannelsResponse);
    
                if (changeChannelsResponse.status == 200) {
                    setLoadingModal(false);
                    props.navigation.goBack();

                } else if(changeChannelsResponse.errortipo == -2){
                    console.log("error!")
                }
              
            } catch (err) {
                alert(err);
    
                if (err instanceof TypeError) {
                    if (err.message == 'Network request failed') {
                        alert("No hay internet");
                           console.log("No hay internet")
                    }
                    else {
                        alert("El servicio esta fallando.")
                        console.log('Ups..', 'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde');
                    }
                }
            }
        }

        function iconName(channel){
            switch (channel.nombre) {
                case "Videollamada" || "Video Llamada": {
                    return "tv"
                    break;
                }
                case "Llamada": {
                    return "phone"
                    break;
                }
                case "Mensaje": {
                    return "comments"
                    break;
                }
                case "Notas de Voz": {
                    return "microphone"
                    break;
                }
                case "Imagenes": {
                    return "image"
                    break;
                }
                case "Videos": {
                    return "play"
                    break;
                }
                default:
                  return channel
              }
        }

        const renderItem = ({ item, index }) => (
            <View style = {styles.channel}>
                <View style = {{flexDirection: "row", marginTop: 7}}>
                    <Icon name= {iconName(item)} size= {18} color =  "gray"/>
                    <Text style = {{marginLeft: 15, fontWeight: "300", fontSize: 14}}>{item.nombre}</Text>
                </View>

                <Switch 
                    trackColor={{ false: "#767577", true: "#058C6B" }}
                    thumbColor={channelsData.data[index].estatus == 1 ? "#03B388" : "#f4f3f4"}
                    ios_backgroundColor="#dcdcdc"
                    tyle={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    onValueChange = {
                        choice => changeChannelsState(
                                    choice ? 
                                        {index: item.id_tipo_interaccion, value: 1, type: "estatus"} 
                                    : 
                                        {index: item.id_tipo_interaccion, value: 0, type: "estatus"}
                                )
                    }
                    value = { channelsData.data[index].estatus == 1 }
                />  
            </View>
        );

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
                <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />

                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Canales
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Habilita solo los canales por los cuales tus clientes te podrán contactar.
                </Text>

                <View style= {styles.channelsContainer}>
                   <FlatList 
                        data = {channelsData.data}
                        keyExtractor = {item => item.nombre}
                        renderItem = {renderItem}
                        style = {{marginBottom: 200}}
                   />
                </View>


                <View style = {styles.bottomContainer}>
                    <TouchableOpacity style = {styles.saveButton} onPress = {() => changeChannelsData()}>
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Guardar cambios</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5"
    },
    interactionHeader: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        elevation: 3,
        backgroundColor: "white",
        flexDirection: "row", justifyContent: "space-between", 
        paddingTop: Platform.OS == "android" ? 0 : 15,
        paddingBottom: 15
    },

    channelsContainer: {
        margin: 20,
        marginTop: 30
    },
    channel: {
        flexDirection:"row", 
        justifyContent: "space-between", 
        borderRadius: 10, 
        // borderColor: "gray", 
        // borderWidth: 0.5,
        backgroundColor: "#ffffff",
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        elevation: 1,
        marginBottom: 15
    },
    title: {
        marginLeft: 10, 
        fontSize: 23,
        marginTop: 6, 
        fontWeight: "700",
        marginBottom: 12
    }, 
    saveButton: {
        backgroundColor: "#03B388", padding: 12, 
        borderRadius: 5, marginLeft: 10, marginRight: 10, marginBottom: 10
    },
    bottomContainer: {
        backgroundColor: "#f5f5f5", position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, 
    },


});

const mapStateToProps = (state) => {
    return {
        channelsData: state.channelsData,
    }
}

const mapDispatchToProps = dispatch => ({
    setChannels: (object) => dispatch(setChannels(object)),
    changeChannelsState: (object) => dispatch(changeChannelsState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ChannelSetup);
