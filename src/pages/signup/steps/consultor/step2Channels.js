import React, { useState, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet,Keyboard, Platform, Alert, Image, ScrollView, TouchableOpacity, Switch, SafeAreaView, TextInput, FlatList } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Steps from 'react-native-steps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from 'react-native-awesome-alerts';
//local imports
import API from '../../../../apis/admin/adminSetup';
import LoaderModal from '../../../../utils/modalLoader';
import configs from '../config';
import { setChannels, changeChannelsState } from '../../../../redux/actions/admin/channels/channelsActions';

const labels = ["Informacion", "Canales", "Formulario", "Categorias"];

function Step2Channels(props) {

        const { channelsData, changeChannelsState, adminData, setChannels, dictionary } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const [showTooltip, setShowTooltip] = useState(false);
        const [selectedChannel, setSelectedChannel] = useState({name: '', price: '', measurement: ''});
        const [errorObject, setErrorObject] = useState({"Videollamada": false, "Llamada": false, "Mensaje": false, "Notas de Voz": false, "Imagenes": false, "Videos": false});
        const insets = useSafeAreaInsets();

        useEffect(() => {
            createChannelsStructure();
        }, [])


        function createChannelsStructure(){

            const channelsDataStructure = [
                {
                    id_usuario: adminData.idUsuario,
                    id_tipo_interaccion: 1,
                    costo: dictionary.preciosMinimos['Videollamada'].toString(),
                    estatus: 1,
                    nombre: "Videollamada",
                    id_interaccion_predeterminada: 0, 
                    unidad: 'Minuto'
                },
                {
                    id_usuario: adminData.idUsuario,
                    id_tipo_interaccion: 2,
                    costo: dictionary.preciosMinimos['Llamada'].toString(),
                    estatus: 1,
                    nombre: "Llamada",
                    id_interaccion_predeterminada: 0, 
                    unidad: 'Minuto'
                },
                {
                    id_usuario: adminData.idUsuario,
                    id_tipo_interaccion: 3,
                    costo: dictionary.preciosMinimos['Mensaje'].toString(),
                    estatus: 1,
                    nombre: "Mensaje",
                    id_interaccion_predeterminada: 0,
                    unidad: 'Caracter'
                },
                {
                    id_usuario: adminData.idUsuario,
                    id_tipo_interaccion: 4,
                    costo: dictionary.preciosMinimos['Notas de Voz'].toString(),
                    estatus: 1,
                    nombre: "Notas de Voz",
                    id_interaccion_predeterminada: 0,
                    unidad: 'Minuto'
                },
                {
                    id_usuario: adminData.idUsuario,
                    id_tipo_interaccion: 5,
                    costo: dictionary.preciosMinimos['Imagenes'].toString(),
                    estatus: 1,
                    nombre: "Imagenes",
                    id_interaccion_predeterminada: 0, 
                    unidad: 'Unidad'
                },
                {
                    id_usuario: adminData.idUsuario,
                    id_tipo_interaccion: 6,
                    costo: dictionary.preciosMinimos['Videos'].toString(),
                    estatus: 1,
                    nombre: "Videos",
                    id_interaccion_predeterminada: 0, 
                    unidad: 'Minuto'
                }
            ]

            setChannels({data: channelsDataStructure});

        }

        async function createChannels(){

            const validPrices = !errorObject.Llamada && !errorObject.Videollamada && !errorObject['Notas de Voz'] && !errorObject.Videos && !errorObject.Imagenes && !errorObject.Mensaje

            if(validPrices){
                try {
                    setLoadingModal(true);

                    const createChannelsResponse = await API.updateChannels(channelsData);
        
                    if (createChannelsResponse.status == 200) {
                        AsyncStorage.setItem("STEP_NUMBER", "3");
                        
                        setLoadingModal(false);
                        props.navigation.navigate("Step3Questions");

                    } else if(createChannelsResponse.errortipo == -2){
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
            } else {
                Alert.alert('Error', 'Hay valores que no son validos');
              }
        }

        function showRecomendedPrice(item){
            let selectedBasePrice = dictionary[item.nombre];

            setShowTooltip(true);
            setSelectedChannel({
              price: selectedBasePrice, 
              name: item.nombre, 
              measurement: item.unidad
            })
        }

        function iconName(channel){
            switch (channel.nombre) {
                case "Videollamada" || "Video Llamada": {
                    return {icon: "tv", measurement: 'minuto'}
                    break;
                }
                case "Llamada": {
                    return {icon: "phone", measurement: 'minuto'}
                    break;
                }
                case "Mensaje": {
                    return {icon: "comments", measurement: 'caracter'}
                    break;
                }
                case "Notas de Voz": {
                    return {icon: "microphone", measurement: 'minuto'}
                    break;
                }
                case "Imagenes": {
                    return {icon: "image", measurement: 'unidad'}
                    break;
                }
                case "Videos": {
                    return {icon: "play", measurement: 'minuto'}
                    break;
                }
                default:
                  return channel
            }
        }

        function validateMinimumPrice(channel, minimumPrice, currentPrice){
            console.log("numeros", minimumPrice, currentPrice, channel);
        
            const isValidPrice = currentPrice >= minimumPrice;
        
            switch (channel) {
              case "Videollamada":
                if(!isValidPrice){
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    Videollamada: true
                  }));
                } else {
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    Videollamada: false
                  }));
                }
                break;
              case "Llamada": 
                if(!isValidPrice){
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    Llamada: true
                  }));
                } else {
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    Llamada: false
                  }));
                }
                break;
              case "Mensaje": 
                if(!isValidPrice){
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    Mensaje: true
                  }));
                } else {
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    Mensaje: false
                  }));
                }
                break;
              case "Notas de Voz": 
                if(!isValidPrice){
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    "Notas de Voz": true
                  }));
                } else {
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    "Notas de Voz": false
                  }));
                }
                break;
              
              case "Imagenes": 
                if(!isValidPrice){
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    "Imagenes": true
                  }));
                } else {
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    "Imagenes": false
                  }));
                }
                break;
              case "Videos": 
                if(!isValidPrice){
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    "Videos": true
                  }));
                } else {
                  return setErrorObject((prevState) => ({
                    ...prevState,
                    "Videos": false
                  }));
                }
                break;
            
              default:
                return channel
            }
        
        }

        const renderItem = ({ item, index }) => (
            <View style={styles.channelsContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  margin: 15,
                  color: 'gray',
                  marginLeft: 30,
                  marginTop: 10,
                  marginBottom: 3,
                }}>
                  <Icon name= {iconName(item).icon} size= {14} color =  "gray"/> {item.nombre}{' '}
              </Text>
            </View>
      
            <TouchableOpacity onPress = {() => showRecomendedPrice(item)}>
              <Text style = {styles.recomendedValue}>Ver precio de mercado</Text>
            </TouchableOpacity>
           
            <View style={styles.inputsContainer}>
              <TextInput
                style={styles.inputStyle}
                autoCorrect={false}
                placeholderTextColor={'#9e9e9e'}
                selectionColor={'#03B388'}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={'done'}
                blurOnSubmit={true}
                value={item.costo}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  changeChannelsState({
                    index: item.id_tipo_interaccion,
                    value: text,
                    type: 'costo',
                  })
    
                  validateMinimumPrice(item.nombre, dictionary.preciosMinimos[item.nombre], Number(text));
    
                }}
              />
              <Text style={{marginTop: 20, marginLeft: -30, color: "gray"}}>$ </Text>
            </View>
            <Text style = {{marginLeft: 30, marginBottom: 6, color: "gray", fontSize: 12, fontWeight: '300'}}>Por {iconName(item).measurement}</Text>
            <Text style = {{marginLeft: 30, marginBottom: 6, color: "red", fontSize: 12, fontWeight: '300'}}>
                {errorObject[item.nombre] ? `El precio minmo de ${item.nombre} es $ ${Number(dictionary.preciosMinimos[item.nombre]).toFixed(2)}` : null }
            </Text>
          </View>
        );  

        console.log("channels data", channelsData, dictionary);

        return(
                <View
                    style = {styles.container} style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}
                >
                    <AwesomeAlert
                        show={showTooltip}
                        showProgress={false}
                        title= {`Precio de mercado`}
                        message= {`El precio promedio de mercado de ${selectedChannel.name}, es de $ ${selectedChannel.price} por ${selectedChannel.measurement}, pero tu puedes asignar el que tu quieras, por encima del precio minimo. Esto solo es un punto de referencia.`}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        messageStyle = {{
                            textAlign: "center"
                        }}
                        confirmText="Entendido."
                        cancelText="Cancelar"
                        cancelButtonColor="red"
                        confirmButtonColor="#03b388"
                        onConfirmPressed={() => {
                        setShowTooltip(false)
                        }}
                    />
                    <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />

                    <View style = {{marginTop: 40}}>
                        <Steps
                            configs={configs}
                            current={1}
                            labels={labels}
                            reversed={false}
                            count = {4}
                        />
                    </View>

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} >
                            {/* <Icon name= "arrow-left" size= {18} color = "black"/> */}
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Paso 2
                        </Text>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Aqui puedes administrar los precios de tus canales.
                    </Text>

                    <KeyboardAwareScrollView 
                        contentContainerStyle = {{ paddingBottom: Dimensions.get("window").height * .15, flexGrow: 1}}
                        extraScrollHeight={Dimensions.get("window").height * .2}
                        enableOnAndroid={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                    >

                        <FlatList 
                            data = {channelsData.data}
                            keyboardShouldPersistTaps='handled'
                            keyExtractor = {item => item.nombre}
                            renderItem = {renderItem} 
                        />
                    </KeyboardAwareScrollView>

                    <View style = {styles.bottomContainer}>
                        <TouchableOpacity style = {styles.saveButton} onPress = {() => createChannels()}>
                            <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Guardar cambios</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
        );
}

const styles = StyleSheet.create({
    container: {
    height: Dimensions.get("window").height,
      backgroundColor: "#f5f5f5"
    },
    channelsContainer: {
        marginTop: 30
    },
    recomendedValue: {
        color: '#03B388', 
        fontWeight: '300',
        fontSize: 12, 
        marginLeft: 30, 
        marginTop: 4
    },
    inputStyle: {
        backgroundColor: "#ffffff",
        padding: 25,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        paddingTop: 25,
        elevation: 1, textAlignVertical: "top", borderRadius: 5
    },
    inputsContainer: {
        flexDirection: "row", 
        marginLeft: 17
    },
    inputStyle: {
        backgroundColor: "#ffffff",
        padding: 12,
        margin: 10,
        width: "40%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        paddingTop: 12,
        elevation: 1, textAlignVertical: "top"
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
        adminData: state.adminData,
        channelsData: state.channelsData,
        dictionary: state.dictionaryData
    }
}

const mapDispatchToProps = dispatch => ({
    setChannels: (object) => dispatch(setChannels(object)),
    changeChannelsState: (object) => dispatch(changeChannelsState(object))
});


export default connect(mapStateToProps, mapDispatchToProps)(Step2Channels);
