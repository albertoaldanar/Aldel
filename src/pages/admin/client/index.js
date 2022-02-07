import React, {useState} from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity } from "react-native";
import FastImage from 'react-native-fast-image';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
//local imports
import  changeAdminState  from '../../../redux/actions/admin/adminActions';
import LoaderModal from '../../../utils/modalLoader';
import API from '../../../apis/admin/adminMain';
import ConfirmMediaModal from '../../interaction/conversations/modals/confirmMediaModal';

function ClientProfile(props) {

    const { adminData, changeAdminState } = props;
    const [imageLoadingModal, setImageLoadingModal] = useState(false);
    const [ showConfirmMedia, setShowConfirmMedia ] = useState(false);
    const [ mediaTypeConfirm, setShowMediaTypeConfirm ] = useState("");
    const [ mediaSelected, setMediaSelected ] = useState("");

        async function handleLogout(){
            AsyncStorage.setItem('LOGGED', "NO");
            RNRestart.Restart()
        }

        async function saveInStorage(){
            
            setShowConfirmMedia(false);

            console.log("mediaSelceed", mediaSelected);

            const reference = storage().ref(mediaSelected.fileName);

            console.log('referecnce', reference);
            setImageLoadingModal(true);

            try {
                await reference.putFile(mediaSelected.uri).then(response =>{
                    
                    if(response.state == "success"){
                        saveImageDatabase(mediaSelected.fileName)
                    }
                });
            } catch (error) {
                console.log("Error!", error);
            }
        }

        async function saveImageDatabase(fileName){
            const url = await storage().ref(fileName).getDownloadURL();
            setImageLoadingModal(true);
            console.log("filename", fileName);

            try {
                const updateUserData = await API.updateUserData(adminData, url);
    
                console.log('update usuario respuest =>', updateUserData);
    
                if (updateUserData.status == 200) {
                    getUserData();

                } else if(updateUserData.errortipo == -2){
                    setImageLoadingModal(false);
                    console.log("error!")
                }
              
            } catch (err) {
    
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

        async function getUserData(){

            try {
                const userMainDataResponse = await API.userMainData(adminData.idUsuario);
    
                console.log('update usuario respuest =>', userMainDataResponse);
    
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

        const chooseFile = (type) => {
            
            let options = {
                mediaType: type,
            };

            launchImageLibrary(options, (response) => {
              console.log('Response = ', response);
                
              if(response.assets){
                if(response.assets[0].fileName){
                    setShowMediaTypeConfirm("Image")
                    setShowConfirmMedia(true);
                    setMediaSelected({uri: response.assets[0].uri, fileName: response.assets[0].fileName});        
                  }
        
                  if (response.didCancel) {
                    console.log('User cancelled camera picker');
                    return;
                  } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                  } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                  } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                  }
              }
            });
        };

        console.log("admin", adminData);
        console.log("admin", adminData.fotoPerfil);

        return(
            <View style = {styles.container}>
                <LoaderModal visibleModal={imageLoadingModal} text={'Actualizando foto..'} />
                <ConfirmMediaModal 
                    visibleModal = {showConfirmMedia} 
                    file = {mediaSelected} 
                    mediaType = "Image"
                    cleanModal = {() => setShowConfirmMedia(false)}
                    saveMedia = {() => saveInStorage()}
                    usage = "adminPhoto"
                />

                <View style = {styles.interactionHeader}>
                    <Text style = {styles.title}>Perfil</Text>
                 </View>

                    <View style = {styles.profileHeader}> 
                        
                        <FastImage
                            style = {styles.imageStyle}
                            source = {{
                                uri:  adminData.fotoPerfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("loaded")
                            }}
                        />
                        <View>
                        <Text style = {styles.username}>{adminData.nombre} {adminData.apellidoPaterno}</Text>
                            <Text style = {styles.mail}>{adminData.email}</Text>
                            <TouchableOpacity onPress={() => chooseFile('photo')}>
                                <Text style = {styles.changePic}>Cambiar foto</Text> 
                            </TouchableOpacity>
                        </View>
                    </View>  

                    <View style = {styles.profileSection}>
                        <Text style = {{color: "gray", fontSize: 13, marginBottom: 10}}>Perfil</Text>

                        <TouchableOpacity style = {styles.sectionCard} onPress = {() => props.navigation.navigate("ConsultorData")}>
                            <Icon name="user" size={20} color="gray"/>
                            <Text style = {styles.sectionTitle}>Datos personales</Text>
                        </TouchableOpacity> 
                    </View> 

                    <View style = {styles.profileSection}>
                        <Text style = {{color: "gray", fontSize: 13, marginBottom: 10}}>Información</Text>

                        <TouchableOpacity style = {styles.sectionCard} onPress = {() => props.navigation.navigate('ConsultorDescription')}>
                            <Icon name="align-left" size={20} color="gray"/>
                            <Text style = {styles.sectionTitle}>Descripción</Text>
                        </TouchableOpacity> 

                        <TouchableOpacity style = {styles.sectionCard} onPress = {() => props.navigation.navigate("ConsultorCategories")}>
                            <Icon name="clipboard" size={20} color="gray"/>
                            <Text style = {styles.sectionTitle}>Intereses</Text>
                        </TouchableOpacity> 
                    </View>  

                    <View style = {styles.signOut} >
                        <TouchableOpacity style = {[styles.sectionCard, {flexDirection: "column"}]} onPress = {() => handleLogout()}>
                            <Text style = {[styles.sectionTitle, {color: "red", textAlign: "center"}]}> Cerrar sesión </Text>
                        </TouchableOpacity> 
                    </View> 
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? 19 : 10,
      backgroundColor: "#f5f5f5"
    },
    interactionHeader: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 10, 
    },
    title: {
        marginLeft: 10, 
        fontSize: 23,
        marginTop: 6, 
        fontWeight: "700",
        marginBottom: 12
    }, 
    profileHeader: {
        flexDirection: "row",
        margin: 15,
        marginBottom: 20
    }, 
    username: {
        fontSize: 19, 
        fontWeight: "500"
    }, 
    mail: {
        fontSize: 16, 
        fontWeight: "400", 
        color: "gray", 
        marginTop: 4
    }, 
    imageStyle: {
        height: 70, 
        width: 70, 
        marginRight: 19,
        borderRadius: 50
    }, 
    changePic: {
        color: "#339afe", 
        fontSize: 13, 
        marginTop: 6
    }, 
    profileSection: {
        padding: 15,
    }, 
    sectionCard: {
        backgroundColor: "white", 
        borderRadius: 5, 
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        elevation: 1,
        flexDirection: "row", 
    }, 
    sectionTitle: {
        fontSize: 16, 
        fontWeight: "300",
        marginLeft: 20
    }, 
    signOut: {
        position: "absolute", 
        bottom: 10, 
        left: 5, 
        right: 5,
        padding: 15
    }
});

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData
    }
}

const mapDispatchToProps = dispatch => ({
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ClientProfile);



