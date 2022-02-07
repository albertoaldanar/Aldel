import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import Video from 'react-native-video';
//local import
import API from '../../../apis/admin/adminMain';
import LoaderModal from '../../../utils/modalLoader';
import changeAdminState  from '../../../redux/actions/admin/adminActions';
import ConfirmMediaModal from '../../interaction/conversations/modals/confirmMediaModal';

function ConsultorVideo(props) {
    
        const insets = useSafeAreaInsets();
        const [imageLoadingModal, setImageLoadingModal] = useState(false);
        const [ showConfirmMedia, setShowConfirmMedia ] = useState(false);
        const [ videoLoaded, setVideoLoaded ] = useState(false);
        const [ loadingStatus, setLoadingStatus ] = useState(0);
        const [ mediaTypeConfirm, setShowMediaTypeConfirm ] = useState("");
        const [ mediaSelected, setMediaSelected ] = useState("");
        const { adminData, changeAdminState } = props;

        useEffect(() => {
            getUserData();
        }, [])

        async function getUserData(){
            try {
                const userMainDataResponse = await API.userMainData(adminData.idUsuario);
    
                if (userMainDataResponse.status === 200) {
                    setImageLoadingModal(false);

                    changeAdminState({
                        apellidoMaterno: userMainDataResponse.data.apellido_materno,
                        apellidoPaterno: userMainDataResponse.data.apellido_paterno,
                        descripcion: userMainDataResponse.data.descripcion,
                        email: userMainDataResponse.data.email,
                        fechaNacimiento: userMainDataResponse.data.fecha_nacimiento,
                        fotoPerfil: userMainDataResponse.data.foto_perfil,
                        iDtipoUsuario: userMainDataResponse.data.id_tipo_usuario,
                        idUsuario: userMainDataResponse.data.id_usuario,
                        nombre: userMainDataResponse.data.nombre,
                        resumen: userMainDataResponse.data.resumen,
                        rfc: userMainDataResponse.data.rfc,
                        telefono: userMainDataResponse.data.telefono,
                        videoPerfil: userMainDataResponse.data.video_perfil, 
                        categorias: userMainDataResponse.data.categorias, 
                    });

                } else if(userMainDataResponse.errortipo == -2){
                    setImageLoadingModal(false);
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

        async function saveInStorage(){
            
            setShowConfirmMedia(false);
            const reference = storage().ref(mediaSelected.uri);
            setImageLoadingModal(true);

            try {
                await reference.putFile(mediaSelected.uri).then(response =>{
                    
                    if(response.state == "success"){
                        saveImageDatabase(mediaSelected.uri)
                    }
                });
            } catch (error) {
                console.log("2 Error!!!!", error);
            }
        }

        async function saveImageDatabase(fileName){
            const url = await storage().ref(fileName).getDownloadURL();
            setImageLoadingModal(true);

            // setLoadingStatus(1);

            try {
                const updateUserData = await API.updateUserData(adminData, null, url);
    
                if (updateUserData.status == 200) {
                    getUserData();
                    setLoadingStatus(2);

                } else if(updateUserData.errortipo == -2){
                    setImageLoadingModal(false);
                    console.log("error!")
                }
            } catch (err) {
                
                setLoadingStatus(2);
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

        const chooseFile = () => {
            let options = {
                mediaType: "video",
            };

            launchImageLibrary(options, (response) => {
              if(response.assets){
                if(response.assets[0].uri){
                    setShowMediaTypeConfirm("Video")
                    setShowConfirmMedia(true);
                    setMediaSelected({uri: response.assets[0].uri, fileName: response.assets[0].fileName});        
                }
              }
            });
        };

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
                <LoaderModal text = "Subiendo video..." visibleModal = {imageLoadingModal}/>
                {
                    loadingStatus === 1 ?
                        <ActivityIndicator style = {{position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 20}} size = "large" color= "gray"/>
                    : null
                }

                <ConfirmMediaModal 
                    visibleModal = {showConfirmMedia} 
                    file = {mediaSelected} 
                    mediaType = "Video"
                    cleanModal = {() => setShowConfirmMedia(false)}
                    saveMedia = {() => saveInStorage()}
                    usage = "adminPhoto"
                />

                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Video presentación
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Explica a los usuarios de aldel quien eres, que servicio ofreces y que haces en esta plataforma. (Duración máxima 1 min.)
                </Text>

                {
                    adminData.videoPerfil === null || adminData.videoPerfil.length < 1 ?
                        <TouchableOpacity style = {styles.uploadVideoContainer} onPress = {() => chooseFile()}> 
                            <Image source = {{uri: "https://image.flaticon.com/icons/png/512/2040/2040659.png"}} style = {{width: 150, height: 150}}/>
                            <Text style = {{textAlign: "center"}}>Subir video</Text>
                        </TouchableOpacity>
                    : 
                        <View style = {styles.videoContainerStyle}>
                            <Video
                                source={{ uri: adminData.videoPerfil }}
                                resizeMode={"contain"}
                                style = {{borderRadius: 10, height: 200}}
                                controls={true}
                                onLoadStart = {() => setLoadingStatus(1)}
                                onLoad ={() => setLoadingStatus(2)}
                                paused={true}
                            />      

                            <View style = {styles.bottomContainer} >
                                <TouchableOpacity style = {styles.saveButton} onPress = {() => chooseFile()}>
                                    <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Cambiar video</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }

            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5"
    },
    channelsContainer: {
        marginTop: 30
    },
    saveButton: {
        backgroundColor: "#03B388", bottom: 15, padding: 9, 
        borderRadius: 5
    }, 
    infoCard: {
        backgroundColor: "white", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        padding: 9,
        elevation: 1, textAlignVertical: "top", borderRadius: 5, margin: 15, marginBottom: 4
    },
    videoContainerStyle: {
        marginTop: "30%"
    },
    uploadVideoContainer: {
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: "35%"
    }, 
    bottomContainer: {
        backgroundColor: "#f5f5f5", padding:7, marginTop: "25%"
    },

});

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData
    }
}

const mapDispatchToProps = dispatch => ({
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConsultorVideo);
