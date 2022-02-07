import React, { useState, useEffect } from "react";
import { Dimensions,TextInput, View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
import { connect } from "react-redux";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import {launchImageLibrary, launchCamera} from "react-native-image-picker";

import Video from 'react-native-video';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//local imports
import setCategoriesData from '../../../redux/actions/admin/categories';
import changeAdminState from '../../../redux/actions/admin/adminActions';
import API from '../../../apis/admin/adminSetup';
import LoaderModal from '../../../utils/modalLoader';
import ConfirmMediaModal from '../../interaction/conversations/modals/confirmMediaModal';

function VeifyAccount(props) { 

        const { categoriesData, setCategoriesData, adminData, changeAdminState } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const [showAlert, setShowAlert] = useState(false);
        const [alertTitle, setAlertTitle] = useState("");
        const [alertMessage, setAlertMessage] = useState("");
        const [userSocialMedia, setUserSocialMedia] = useState('');
        const [verifiedStatus, setVerifiedStatus] = useState(adminData.verified);
        const [choosenVideo, setChoosenVideo] = useState('');
        const [choosenImage, setChoosenImage] = useState('');
        const [showConfirmMedia, setShowConfirmMedia] = useState(false);
        const [mediaSelected, setMediaSelected] = useState(false);
        const [showMediaTypeConfirm, setShowMediaTypeConfirm] = useState('');
        const [videoUri, setVideoUri] = useState('');
        const [imageUri, setImageUri] = useState('');

        const insets = useSafeAreaInsets();

        async function saveVerifiedAccount(url){

            const formatYmd = date => date.toISOString().slice(0, 10);
            
            try {
                const verifyUserResponse = await API.verifyUser(adminData.idUsuario, userSocialMedia, formatYmd(new Date()), url, url);
        
                console.log('VERIFYING RESPONSE =>', verifyUserResponse, adminData.idUsuario, userSocialMedia, videoUri, imageUri);
        
                if (verifyUserResponse.status == 200) {
                    console.log("success");
                    setLoadingModal(false);
                    setVerifiedStatus(1);
                    changeAdminState({ verified: 1 });
                    
                } else {
                    console.log("HA ocurrido un error");   
                }
                  
            } catch (err) {
                console.log("error =>", err);
        
                if (err instanceof TypeError) {
                    if (err.message == 'Network request failed') {
                        alert("No hay internet");
                        console.log("No hay internet")
                    } else {
                        alert("El servicio esta fallando.")
                        console.log('Ups..', 'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde');
                    }
                }
            }
        }

        const chooseFile = (type) => {
            
            let options = {
                mediaType: type,
            };

            launchImageLibrary(options, (response) => {
              console.log('Response = ', response);
                if(response.assets){
                    if(response.assets[0].fileName || response.assets[0].uri){
                        setShowMediaTypeConfirm(type === "photo"? "Image" : 'Video');
                        setShowConfirmMedia(true);
                        setMediaSelected({uri: response.assets[0].uri, fileName: response.assets[0].fileName});       
                    }
                }
            });
        };

        async function saveInStorage(){
            if(showMediaTypeConfirm === "Image"){
                setChoosenImage(mediaSelected.uri)
            } else {
                setChoosenVideo(mediaSelected.uri)
            }
            setShowConfirmMedia(false);
        }

        async function sendToFirebase(){
            if(choosenImage && userSocialMedia.length > 5){
                const files = [choosenImage, choosenVideo];

                setShowConfirmMedia(false);

                Promise.all(
                    files.map((item, index) => putStorageItem(item, index))
                )
                .then((url) => {
                    console.log(`All success`, url)
                })
                .catch((error) => {
                    console.log(`Some failed: `, error.message)
                });
            }  else {
                setShowAlert(true);
                setAlertTitle("Información incompleta");
                setAlertMessage("Favor de llenar todos los campos");
            }
        }

        async function putStorageItem(item, index){
            const reference = storage().ref(item);
            setLoadingModal(true);
            const type = index === 0 ? "Image" : "Video";

            console.log("el type es", type);

            try {
                await reference.putFile(item).then(response =>{
                    if(response.state == "success"){
                        console.log("SE MANDARIN BIEN", item)
                        getURL(item, type);
                    }
                });
            } catch (error) {
                console.log("este es el error", error);
            }
        }

        async function getURL(item, type){
            const url = await storage().ref(item).getDownloadURL();

            console.log('my uURL', url, type);

            saveVerifiedAccount(url);
        }

        return(
                <View
                    style = {styles.container} style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}
                >
                    <LoaderModal visibleModal={loadingModal} text={'Enviando...'} />

                    <ConfirmMediaModal 
                        visibleModal = {showConfirmMedia} 
                        file = {mediaSelected} 
                        mediaType = {showMediaTypeConfirm}
                        cleanModal = {() => {
                            setMediaSelected(false);
                            setShowConfirmMedia(false);
                            if(showMediaTypeConfirm === "Image"){
                                setChoosenImage("")
                            } else{
                                setChoosenVideo("")
                            }
                        }}
                        saveMedia = {() => saveInStorage()}
                        usage = "adminPhoto"
                    />

                    <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        title= {alertTitle}
                        message= {alertMessage}
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        confirmText="Entendido."
                        confirmButtonColor= "#03b388"
                        onConfirmPressed={() => {
                            setShowAlert(false)
                        }}
                    />         

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                            <Icon name= "arrow-left" size= {18} color = "black"/>
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Verifica tu cuenta
                        </Text>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Esta sección certifica a personas reconocidas, figuras públicas o consultores altamente calificados.
                    </Text>

                    {
                    verifiedStatus === null ? 
                    <>
                        <ScrollView>
                            <KeyboardAwareScrollView 
                                contentContainerStyle = {{ paddingBottom: Dimensions.get("window").height * .2, flexGrow: 1}}
                                extraScrollHeight={Dimensions.get("window").height * .1}
                                enableOnAndroid={true}
                                enableAutomaticScroll={(Platform.OS === 'ios')}
                            >
                                <View>
                                    <Text style = {{fontSize: 18, fontWeight: "500", margin: 15, marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                                        Video corto
                                    </Text>
                                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, marginBottom: 3}}>
                                        Envianos un video de 20 a 30 segundos presentandote y solicitando tu verificación
                                    </Text>

                                    {
                                        choosenVideo ? 
                                            <View style = {{marginTop: 15}}>
                                                <Video
                                                    source={{ uri: choosenVideo }}
                                                    resizeMode={"contain"}
                                                    style = {{borderRadius: 10, height: 150}}
                                                    controls={true}
                                                    paused={true}
                                                />
                                                <TouchableOpacity style = {{alignSelf: 'center', marginTop: 5}} onPress = {() => setChoosenVideo('')}>
                                                    <Text style ={{color: "red"}}>Quitar video</Text>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <View>
                                                <TouchableOpacity style = {{alignItems: "center", marginTop: 35}} onPress={() => chooseFile('video')}>
                                                    <Text style = {{color: "#03B388"}}> + Subir video </Text>
                                                </TouchableOpacity>
                                            </View>
                                    }
                                </View>

                                <View>
                                    <Text style = {{fontSize: 18, fontWeight: "500", margin: 15, marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                                        Identificaión
                                    </Text>
                                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, marginBottom: 3}}>
                                        Envianos una identificaión oficial (pasaporte, identifiación o licencia)
                                    </Text>

                                    {
                                        choosenImage ? 
                                            <View>
                                                <Image source = {{uri: choosenImage}} style ={{height: 150, width: 200, alignSelf: "center", marginTop: 15, borderRadius: 10}}/> 
                                                <TouchableOpacity style = {{alignSelf: 'center', marginTop: 5}} onPress = {() => setChoosenImage('')}>
                                                    <Text style ={{color: "red"}}>Quitar imagen</Text>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <View>
                                                <TouchableOpacity style = {{alignItems: "center", marginTop: 35}} onPress={() => chooseFile('photo')}>
                                                    <Text style = {{color: "#03B388"}}> + Subir imagen </Text>
                                                </TouchableOpacity>
                                            </View>
                                    }

                                </View>

                                <View>
                                    <Text style = {{fontSize: 18, fontWeight: "500", margin: 15, marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                                        Plataforma digital 
                                    </Text>

                                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, marginBottom: 3}}>
                                        Añade el URL de tu plataforma digital que mejor te avale (Instagram, Facebook, Linkedin, Tiktok, Onlyfans etc.) 
                                    </Text>

                                    <TextInput 
                                        style={styles.inputStyle} 
                                        autoCorrect={false} 
                                        placeholderTextColor={'#9e9e9e'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                                        returnKeyType={"done"} 
                                        blurOnSubmit = {true}
                                        multiline = {true}
                                        value = {userSocialMedia}
                                        onChangeText = {text => setUserSocialMedia(text)}
                                        >
                                    </TextInput>
                                </View>
                            </KeyboardAwareScrollView>

                        </ScrollView>

                        <View style = {styles.bottomContainer}>
                            <TouchableOpacity style = {styles.saveButton} onPress = {() => sendToFirebase()}>
                                <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Solicitar verificación</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    : 
                    verifiedStatus === 1 ? 
                        <View style = {{alignItems: "center", marginTop: "34%"}}>
                            <Image source = {{uri: "https://image.flaticon.com/icons/png/512/3208/3208749.png"}} style = {{width: 150, height: 150}}/>
                            <Text style = {{marginTop: 25, fontSize: 20}}>Verificación en espera </Text>
                            <Text style = {{color: "gray", textAlign: "center", margin: 10}}>Estamos revisando tu solicitud, te notificaremos en cuanto esta finalize. </Text>
                        </View>
                    : 
                        <View style = {{alignItems: "center", marginTop: "34%"}}>
                            <Image source = {{uri: "https://image.flaticon.com/icons/png/512/3437/3437393.png"}} style = {{width: 170, height: 170}}/>
                            <Text style = {{marginTop: 25, fontSize: 20}}>Eres un usuario verificado </Text>
                            <Text style = {{color: "gray", textAlign: "center", margin: 10}}>Al ser un usuario verificado, cuentas con una atencion especial, la cual puedes solicitar desde tu administrador. </Text>
                        </View>
                    }
                
                </View>
        );
}

const styles = StyleSheet.create({
    container: {
    height: Dimensions.get("window").height,
      backgroundColor: "#f5f5f5"
    },
    channelsContainer: {
        margin: 20,
        marginTop: 30
    },
    inputStyle: {
        backgroundColor: "#ffffff",
        padding: 15,
        paddingTop: 18,
        marginLeft: 15, 
        marginRight: 15,
        margin: 10,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        elevation: 1, textAlignVertical: "top", borderRadius: 5
    },
    inputsContainer: {
        marginTop: 60,
    },
    bottomContainer: {
        backgroundColor: "#f5f5f5", position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, 
    },
    saveButton: {
        backgroundColor: "#03B388", padding: 12, 
        borderRadius: 5, marginLeft: 10, marginRight: 10, marginBottom: 10
    },
    goBackButton: {
        position: "absolute", left: 10, right: 10, bottom: 25, padding: 12, 
    }   
});

const mapStateToProps = (state) => {
    return {
        categoriesData: state.categoriesData,
        adminData: state.adminData,
    }
}

const mapDispatchToProps = dispatch => ({
    setCategoriesData: (object) => dispatch(setCategoriesData(object)),
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(VeifyAccount);
