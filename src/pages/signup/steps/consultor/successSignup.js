import React, { useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image, StatusBar, Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";
//loacl imports
import Celebration from '../../../../assets/celebration.gif';

function SuccessSignupConsultor(props) {
    console.log(props);
    
    // useEffect(() => {

    //     if(Platform.OS == "android"){
    //         StatusBar.setBarStyle( 'light-content',true)
    //         StatusBar.setBackgroundColor("#03B388")
    //     }      

    //     setTimeout(() =>  
    //         validateLogin()
    //     , 3500);
    // }, [])

    //     async function sendToIndex(id){
    //         const { changeAdminState } = props;
           
    
    //         try {
    //             const step = await AsyncStorage.getItem('STEP_NUMBER');

    //             const userDataResponse = await API.userMainData(id);
    
    //             console.log('user data response =>', userDataResponse);
    
    //             if (userDataResponse.status == 200) {
    //                 console.log("success");
    
    //                 changeAdminState({
    //                     apellidoMaterno: userDataResponse.data.apellido_materno,
    //                     apellidoPaterno: userDataResponse.data.apellido_paterno,
    //                     descripcion: userDataResponse.data.descripcion,
    //                     email: userDataResponse.data.email,
    //                     fechaNacimiento: userDataResponse.data.fecha_nacimiento,
    //                     fotoPerfil: userDataResponse.data.foto_perfil,
    //                     iDtipoUsuario: userDataResponse.data.id_tipo_usuario,
    //                     idUsuario: userDataResponse.data.id_usuario,
    //                     nombre: userDataResponse.data.nombre,
    //                     resumen: userDataResponse.data.resumen,
    //                     rfc: userDataResponse.data.rfc,
    //                     telefono: userDataResponse.data.telefono,
    //                     videoPerfil: userDataResponse.data.video_perfil
    //                 });

    //                 step == "FINISHED" ? props.navigation.navigate("Index") : sendToStep(step);

    //                 //props.navigation.navigate("Index")
            
    //             } else {
    //                 console.log("HA ocurrido un error");   
    //             }
              
    //         } catch (err) {
    //             console.log("error =>", err);
    
    //             if (err instanceof TypeError) {
    //                 if (err.message == 'Network request failed') {
    //                     alert("No hay internet");
    //                        console.log("No hay internet")
    //                 }
    //                 else {
    //                     alert("El servicio esta fallando.")
    //                     console.log('Ups..', 'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde');
    //                 }
    //             }
    //         }
    // }

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Bienvenido a Aldel!</Text>
            <Image  style= {styles.imageStyle} source = {Celebration}/>
            <Text style = {{marginTop: 60,  fontWeight: "300", textAlign: "center", fontSize: 15, letterSpacing: 4, marginLeft: 10, marginRight: 10}}>Ahora puedes monetizar cada segundo</Text>

            <TouchableOpacity style = {styles.saveButton} onPress = {() => props.navigateToIndex()}>
                <Text style = {{color: "#ffffff",textAlign: "center", fontSize: 16}}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ededed"
    },
    title: {
        marginTop: '25%',
        fontWeight: "300", textAlign: "center", 
        fontSize: 28,
        letterSpacing: 4,
    },
    imageStyle: {
        width: 300,
        height: 300,
        marginTop: 40,
        alignSelf: "center"
    },
    saveButton: {
        backgroundColor: "#03B388",
        position: "absolute", 
        left: 10, right: 10, bottom: 30,
        padding: 12, 
        marginLeft: 10, 
        marginRight: 10,
        borderRadius: 5
    }
});

export default SuccessSignupConsultor;
