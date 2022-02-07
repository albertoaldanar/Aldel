import React, {useState} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image, ScrollView, Modal } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
//local imports
import Answers from '../modals/answers';
import Profile from '../modals/client/profile';

function RequestDescription(props) {

        const [showAnswerModal, setShowAnswerModal] = useState(false);
        const [showProfileModal, setShowProfileModal] = useState(false);
        const { request } = props.route.params;
        const insets = useSafeAreaInsets();

        console.log("request", request);

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
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
                                uri: request.consultor.foto_perfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("loaded")
                            }}
                        />
                        <Text style = {styles.userName}>{request.consultor.nombre} {request.consultor.apellido_paterno}</Text>

                        <View>
                            <TouchableOpacity>
                                <Text style = {{color: "gray", fontSize: 12, fontStyle: "italic", marginLeft: 12}}><Icon name = "map-marker"/> {request.cliente.pais}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {
                                    () => props.navigation.navigate("ConsultorProfile", {
                                        routeName: "RequestDescription", 
                                        usuarioID: request.consultor.id_usuario
                                    })
                                }
                            >
                                <Text style = {{fontSize: 12, fontStyle: "italic", marginLeft: 12, color: "#339afe", marginTop: 7}}>Ver perfil</Text>
                            </TouchableOpacity>
                        </View>
 
                    </View>

                    <View style = {{flexDirection: "row", paddingLeft: 10, paddingBottom:15, paddingTop: 25}}>
                        <Icon 
                            name = {request.estatus == 1 ? "hourglass-start" : "times"}
                            color = {request.estatus == 1 ? "gray" : "red"}
                            size = {17} 
                            style = {{marginRight: 10}}
                        />
                        <Text>
                            {
                                request.estatus == 1 ? "En espera" : "Declinada"
                            }
                        </Text>
                    </View>
               </View>

                <ScrollView>

                    <View>
                        <Text style = {styles.sectionTitle}> Acerca de ti </Text>
                        <Text style = {{ marginLeft: 25, margin: 5, color: "gray"}}>{request.cliente.acerca_de_cliente}</Text>
                    </View>
                    
                    <View>
                        <Text style = {styles.sectionTitle}> Solicitud </Text>
                        <Text style = {{ marginLeft: 25, margin: 5, color: "gray"}}>{request.descripcion}</Text>
                    </View>

                    <View>
                        <Text style = {styles.sectionTitle}> Formulario </Text>
                        {
                            request.formulario.length === 0 ?
                                <Text style = {{  fontSize: 12, marginTop: 7, color: "gray", marginLeft: 25}}>No hay formulario con respuestas</Text>
                            : 
                                <>
                                <TouchableOpacity onPress = {() => setShowAnswerModal(true)} style = {{marginLeft: 15}}>  
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
        borderRadius: 50
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
