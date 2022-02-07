import React, {useState} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image, ScrollView, Modal } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import FastImage from 'react-native-fast-image';
//local imports
import LoaderModal from './../../../../utils/modalLoader';
import API from '../../../../apis/interaction/interaction';
import API_NOTIF from '../../../../apis/notifications/notifications';
import Answers from '../modals/answers';
import Profile from '../modals/consultor/profile';

function RequestDescription(props) {

        const [showAnswerModal, setShowAnswerModal] = useState(false);
        const [showProfileModal, setShowProfileModal] = useState(false);
        const [showAlert, setShowAlert] = useState(false);
        const [accepted, setAccepted] = useState(null);
        const [loadingModal, setLoadingModal] = useState(false);
        const { request } = props.route.params;
        const insets = useSafeAreaInsets();

        async function acceptOrDeclineInteraction(estatus){

            setLoadingModal(true);

            try {
                const acceptOrDeclineResponse = await API.acceptDeclineInteraction(request, estatus);
    
                if (acceptOrDeclineResponse.status == 200) {

                    if(estatus == 2){
                        setAccepted(true);
                    }

                    sendNotification(estatus);

                    setLoadingModal(false);
                    setShowAlert(true)

                } else {
                    setLoadingModal(false);
                    console.log("HA ocurrido un error");   
                }
              
            } catch (err) {
                console.log("error =>", err);

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

        async function sendNotification(estatus){

            let header = estatus == 2 ? "Solicitud Aceptada!" : "Solicitud declinada :(" ;

            let message = estatus == 2 ? 
                    `${request.consultor.nombre} ${request.consultor.apellido_paterno} acepto tu solicitud, ahora pueden interactuar!` 
                : 
                    `Lo sentimos, ${request.consultor.nombre} ${request.consultor.apellido_paterno} declino tu solicitud para interactuar. `;

            const notificationResponse = await API_NOTIF.sendNotification([request.cliente.notificacion_id], header, message);

        }

        console.log('dattt, ', request)

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
                <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Listo :)"
                    message= {accepted ? "Solicitud aceptada." : "Solicitud declinada."}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Continuar"
                    confirmButtonColor={accepted ? "#03b388" : "red"}
                    onConfirmPressed={() => {
                        props.navigation.navigate("Index")
                    }}
                />

                <Modal
                    visible = {showAnswerModal}
                    animationType = "slide"
                >
                    <Answers answers = {request.formulario} closeModal = {()=> setShowAnswerModal(false)}/>
                </Modal>

                <Modal
                    visible = {showProfileModal}
                    animationType = "slide"
                >
                    <Profile closeModal = {()=> setShowProfileModal(false)}/>
                </Modal>

                <View style = {{borderBottomColor: "#dcdcdc", borderBottomWidth: 0.2, paddingBottom: 20, marginLeft: 15, marginRight: 15, marginBottom: 20}}>
                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 5, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 19 : 21, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                            <Icon name= "arrow-left" size= {18} color = "black"/>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <FastImage
                            style={styles.imageStyle}
                            source = {{
                                uri: request.cliente.foto_perfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("loaded")
                            }}
                        />

                        <Text style = {styles.userName}>{request.cliente.nombre} {request.cliente.apellido_paterno}</Text>

                        <View>
                            <TouchableOpacity>
                                <Text style = {{color: "gray", fontSize: 12, fontStyle: "italic", marginLeft: 12}}><Icon name = "map-marker"/> {request.cliente.pais}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {() => props.navigation.navigate("ClientProfile", {
                                    usuarioID: request.cliente.id_usuario
                                })}
                            >
                                <Text style = {{fontSize: 12, fontStyle: "italic", marginLeft: 12, color: "#339afe", marginTop: 7}}>Ver perfil</Text>
                            </TouchableOpacity>
                        </View>

                        <View style = {{flexDirection: "row", marginLeft: -13}}>
                            <TouchableOpacity 
                                onPress = {() => acceptOrDeclineInteraction(2)}
                                style = {{backgroundColor: "#03b388", padding: 10, borderRadius: 50, margin: 20, marginBottom: 7, marginRight: 5, paddingRight: 30, paddingLeft: 30}}
                            >
                                <Text style = {{color: "white", fontSize: 12, textAlign: "center"}}> Aceptar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress = {() => acceptOrDeclineInteraction(8)}
                                style = {{backgroundColor: "#CB0A13", padding: 10, borderRadius: 50, margin: 20, marginBottom: 7, paddingRight: 30, paddingLeft: 30}}
                            >
                                <Text style = {{color: "white", fontSize: 12, textAlign: "center"}}> Rechazar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
               </View>

                <ScrollView>
                    <View>
                        <Text style = {styles.sectionTitle}> Acerca del usuario </Text>
                        <Text style = {{ marginLeft: 25, margin: 5, color: "gray"}}>{request.cliente.acerca_de_cliente}</Text>
                    </View>
                    
                    <View>
                        <Text style = {styles.sectionTitle}> Solicitud </Text>
                        <Text style = {{ marginLeft: 25, margin: 5, color: "gray"}}>{request.descripcion}</Text>
                    </View>

                    <Text style = {styles.sectionTitle}> Formulario </Text>

                    <View style = {{marginLeft: 20}}>
                        {
                            request.formulario.length === 0 ?
                                <Text style = {{  fontSize: 12, marginTop: 7, color: "gray"}}>No hay formulario con respuestas</Text>
                            : 
                                <>
                                <TouchableOpacity onPress = {() => setShowAnswerModal(true)} >  
                                    <Text style = {{ marginLeft: 5, margin: 5, color: "gray", fontStyle: "italic", color: "#339afe"}}>Ver {request.formulario.length} respuestas</Text>
                                </TouchableOpacity>
                                </>
                        }
                    </View>
                </ScrollView>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#f5f5f5", 
      height: "100%",
    },
    header: {
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
    userName: {
        fontSize: 16,
        fontWeight: "400", 
        margin: 6,
        marginLeft: 12, 
        marginTop: 3
    },
    closeText: {
        margin: 25, marginLeft: 10, 
        marginBottom: 0, fontSize: 18, 
        fontWeight: "700"
    },
    imageStyle: {
        height: 80, 
        width: 80,
        margin: 15,
        marginTop: 19, 
        borderRadius: 50,
    }, 
    button: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        elevation: 3,
        position: "absolute", bottom: 5, left: 5, right: 5, padding: 15, backgroundColor: "#03b388", borderRadius: 5
    }, 
    acceptDecline: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 15, backgroundColor: "#03b388", borderRadius: 30, paddingLeft: 30, paddingRight: 30
    }, 
    sectionTitle: {
        margin: 15, 
        fontWeight: "700",
        fontStyle: "italic", 
        marginBottom: 8,
        color: "black", 
        fontWeight: "500",
        fontSize: 14, 

    }, 
    sectionContent: {
        marginTop: 15
    }

});

export default RequestDescription;
