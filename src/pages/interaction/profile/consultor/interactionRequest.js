import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import AwesomeAlert from 'react-native-awesome-alerts';
//local imports 
import API from '../../../../apis/interaction/interaction';
import API_NOTIF from '../../../../apis/notifications/notifications';
import { updateQuestionsProfile } from '../../../../redux/actions/profile/profileActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderModal from '../../../../utils/modalLoader';

function InteractionRequest(props) {

        const { updateQuestionsProfile, data, closeModal, dismiss, adminData } = props;
        const [contactCall, setContactCall] = useState(false);
        const [contactMessage, setContactMessage] = useState(false);
        const [contactVideo, setContactVideo] = useState(false);
        const [loadingModal, setLoadingModal ] = useState(false);
        const [allQuestionsAnswered, setAllQuestionsAnswered ] = useState(false);
        const [requestDescription, setRequestDescription ] = useState('');
        const [aboutUser, setAboutUser] = useState('');

        async function createRequest(){
            
            const currentUser = await AsyncStorage.getItem("USER");
            const currentDateTime = new Date().toLocaleString();

            setLoadingModal(true);

            try {
                const createRequestResponse = await API.createInteractionRequest(data, Number(currentUser), currentDateTime, requestDescription, aboutUser);
    
                if (createRequestResponse.status == 200) {
                    setLoadingModal(false);

                    sendNotification();
                    closeModal();

                } else {
                    console.log("HA ocurrido un error");   
                }
              
            } catch (err) {
                console.log("error =>", err);
                setLoadingModal(false);
                
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

        async function sendNotification(){

            let header = "Nueva solicitud!";
            let message = `${adminData.nombre} ${adminData.apellidoPaterno} quiere contactarte `

            const notificationResponse = await API_NOTIF.sendNotification([data.notificationID], header, message);
        }

        function showQuestions(){

            return data.preguntas.map(question => {
                return (
                    <View key = {question.id_pregunta_formulario}>
                        <View style = {{flexDirection: "row"}}>
                            <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 20, marginBottom: 3}}>
                                { question.question }
                            </Text>
                        </View>

                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholderTextColor={'#AFC8C2'} 
                                selectionColor={'#03B388'} 
                                autoCapitalize="none" 
                                autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                value = {question.respuesta}
                                onChangeText = {text =>  updateQuestionsProfile({index: question.id_pregunta_formulario, value: text})}
                            >
                            </TextInput>
                        </View>
                    </View>
                );
            });
        }

        function validateQuestions(){

            let questionsNoAnwser = 0;
            
            data.preguntas.map(question => {
                if(question.respuesta.length == 0){
                    questionsNoAnwser += 1
                }
            })

            if(questionsNoAnwser > 0 || requestDescription.length < 2 || aboutUser.length < 2){
                setAllQuestionsAnswered(true)
            } else {
                createRequest()
            }
        }

        return(
            <ScrollView style = {styles.container}>
                <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />

                <AwesomeAlert
                    show={allQuestionsAnswered}
                    showProgress={false}
                    title="Incompleto"
                    message= "Favor de contestar todas las preguntas"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Entendido!"
                    confirmButtonColor= "#03b388"
                    onConfirmPressed={() => {
                        setAllQuestionsAnswered(false)
                    }}
                />

                <View style = {{flexDirection:"row", marginTop: 20}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => dismiss()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Solicitud
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Completa la solicitud para contactar a <Text style ={{textDecorationLine: "underline"}}>{data.nombre} {data.apellidoPaterno}</Text>
                </Text>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                   * Introdúcete
                </Text>

                <View styles = {styles.inputsContainer}>
                    <TextInput 
                        style={styles.inputStyle} 
                        autoCorrect={false} 
                        placeholderTextColor={'#AFC8C2'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                        placeholder = "Dime un poco sobre ti..."
                        onChangeText = {text => setAboutUser(text)}
                        returnKeyType={"done"} 
                        multiline = {true}
                        value={aboutUser}
                    >
                    </TextInput>
                </View>

                <View style = {{flexDirection: "row"}}>
                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 20, marginBottom: 3}}>
                       * Motivo de interacción
                    </Text>
                </View>

                <View styles = {styles.inputsContainer}>
                    <TextInput 
                        style={styles.inputStyle} 
                        autoCorrect={false} 
                        placeholder = " Dime porque quieres hablar conmigo... "
                        placeholderTextColor={'#AFC8C2'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                        returnKeyType={"done"} 
                        multiline = {true}
                        onChangeText = {text => setRequestDescription(text)}
                        value={requestDescription}
                    />
                </View>

                {
                    showQuestions()
                }

                <TouchableOpacity style = {styles.saveButton} onPress = {() => validateQuestions()}>
                    <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Enviar solicitud</Text>
                </TouchableOpacity>

            </ScrollView>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    channelsContainer: {
        margin: 20,
        marginTop: 30
    },
    datePicker: {
        padding: 12,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        paddingTop: 12,
    },
    inputStyle: {
        backgroundColor: "#ffffff",
        padding: 12,
        margin: 10,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        paddingTop: 12,
        elevation: 1, textAlignVertical: "top", borderRadius: 5
    },
    inputsContainer: {
        marginTop: 60,
    },
    saveButton: {
        backgroundColor: "#03B388", padding: 12, margin: 20, marginTop: 30,
        borderRadius: 5
    }, 
    checkBoxContainer: {
        flexDirection: "row", 
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20, 
    }
});

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData
    }
}

const mapDispatchToProps = dispatch => ({
    updateQuestionsProfile: (object) => dispatch(updateQuestionsProfile(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(InteractionRequest);
