import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Platform, BackHandler} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import storage from '@react-native-firebase/storage';
import * as firebase from 'firebase';
//loacl imports
import firebaseConfig from '../../firebase/config';
import Logo from '../../assets/chat-logo.png';
import API from '../../apis/admin/adminMain';
import API_NOTIF from '../../apis/notifications/notifications';
import changeAdminState from '../../redux/actions/admin/adminActions';
import NoInternetModal from '../../utils/noInternetModal';
import setDictionary from '../../redux/actions/dictionaryActions';

function Splash(props) {
    
    const [userHasInternet, setUserHasInternet] = useState(false);
    const { setDictionary } = props;

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        // sendCallNotif();

        getDictionary();

        if(Platform.OS == "android"){
            StatusBar.setBarStyle( 'light-content',true)
            StatusBar.setBackgroundColor("#03B388")
        }

        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected){
                setUserHasInternet(true);
            }
        });

        unsubscribe();
        // if(!firebase.apps.length){
        //     firebase.initializeApp(firebaseConfig);
    
        //     firebase.firestore().settings({ experimentalForceLongPolling: true });
        // }

        setTimeout(() =>  
            validateLogin()
        , 3500);

        return () => backHandler.remove()
    }, []);

    async function sendCallNotif(){

        try {
            const notifResponse = await API_NOTIF.incommingCallNotification();

            console.log("data response", notifResponse)
    
            if (notifResponse.status == 200) {
            }
              
        } catch (err) {
                console.log("error =>", err);
    
        }

    }

    async function getDictionary(){

        const db = firebase.firestore();
        const database = db.collection('dictionary');

        const snapshot = await database.get();
        var result = snapshot.docs.map(doc => doc.data());

        console.log("result", result);

        let obj = {};

        result.map(value => {
            Object.assign(obj, value);
        });

        setDictionary(obj);
    }

    async function sendToIndex(id){
        const { changeAdminState } = props;
        
        try {
            const step = await AsyncStorage.getItem('STEP_NUMBER');

            const userDataResponse = await API.userMainData(id);

            console.log("data response", userDataResponse)
    
            if (userDataResponse.status == 200) {
                changeAdminState({
                    apellidoMaterno: userDataResponse.data.apellido_materno,
                    apellidoPaterno: userDataResponse.data.apellido_paterno,
                    descripcion: userDataResponse.data.descripcion,
                    email: userDataResponse.data.email,
                    fechaNacimiento: userDataResponse.data.fecha_nacimiento,
                    fotoPerfil: userDataResponse.data.foto_perfil,
                    iDtipoUsuario: userDataResponse.data.id_tipo_usuario,
                    idUsuario: userDataResponse.data.id_usuario,
                    nombre: userDataResponse.data.nombre,
                    resumen: userDataResponse.data.resumen,
                    rfc: userDataResponse.data.rfc,
                    telefono: userDataResponse.data.telefono,
                    videoPerfil: userDataResponse.data.video_perfil, 
                    verified: userDataResponse.data.estatus_verificacion, 
                    pais: userDataResponse.data.pais
                });

                step == "FINISHED" ? props.navigation.navigate("Index") : analyzeUserType(userDataResponse.data.id_tipo_usuario, step)
                    //props.navigation.navigate("Index")
            
            } else {
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

    function analyzeUserType(userType, step){
        if(userType == 3){
            sendToConsultorSteps(step);
        } else {
            sendToClientSteps(step);
        }
    }

    function sendToConsultorSteps(stepNumber){
        const number = Number(stepNumber);

        switch(number) {
            case 1:
                props.navigation.navigate("Step1MainData")
              break;
            case 2:
                props.navigation.navigate("Step2Channels")
              break;
            case 3:
                props.navigation.navigate("Step3Questions")
              break;
            case 4:
                props.navigation.navigate("Step4Categories")
              break;
            default:
              console.log("DEFAULT")
          }
    }

    function sendToClientSteps(stepNumber){
        const number = Number(stepNumber);

        switch(number) {
            case 1:
                props.navigation.navigate("Step1MainDataClient")
              break;
            case 2:
                props.navigation.navigate("Step2Interests")
              break;
            default:
              console.log("DEFAULT")
          }
    }

    async function validateLogin() {
        const loggedIn = await AsyncStorage.getItem('LOGGED')
        const user = await AsyncStorage.getItem('USER')

        loggedIn == "YES" ? sendToIndex(user) : props.navigation.navigate("Login")
    }

    return(
        <View style = {styles.container}>
            <NoInternetModal visibleModal = {userHasInternet} />

            <Text style = {styles.title}></Text>
            <Image  style= {styles.imageStyle} source = {Logo}/>
            <Text style = {{marginTop: 20, color: "white", fontWeight: "300", textAlign: "center", fontSize: 15, letterSpacing: 6}}>Monetiza cada segundo</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#03B388"
    },
    title: {
        marginTop: '25%',
         color: "white", fontWeight: "300", textAlign: "center", 
         fontSize: 28, letterSpacing: 25
    },
    imageStyle: {
        width: 300,
        height: 300,
        marginTop: 40,
        alignSelf: "center"
    }
});

const mapStateToProps = (state) => {
    return {
        dictionary: state.dictionaryData,
    }
}

const mapDispatchToProps = dispatch => ({
    changeAdminState: (object) => dispatch(changeAdminState(object)),
    setDictionary: (object) => dispatch(setDictionary(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
