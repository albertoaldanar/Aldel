import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Platform, TextInput, TouchableOpacity, Modal, BackHandler} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";
import AwesomeAlert from 'react-native-awesome-alerts';
//Local imports
import Logo from '../../assets/chat-logo.png';
import API from '../../apis/sesion/login';
import API_USER from '../../apis/admin/adminMain';
import LoaderModal from '../../utils/modalLoader';
import ErrorModal from '../../utils/errorModal';
import changeAdminState from '../../redux/actions/admin/adminActions';

function Login(props) {

    const [ password, setPassword ]= useState("");
    const [ email, setEmail ] = useState("");
    const [ loadingModal, setLoadingModal ] = useState(false);
    const [ errorModal, setErrorModal ] = useState(false);
    const [ showIncompleteFormModal, setShowIncompleteFormModal] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => {
            backHandler.remove()
        }
    }, []);

    async function handleLogin(){
        if(!password && !email){
            return setShowIncompleteFormModal(true);
        }
        try {
            setLoadingModal(true);

            const loginResponse = await API.logIn(email, password);

            console.log('login respuest =>', loginResponse);

            if (loginResponse.success) {
				const userID = JSON.stringify(loginResponse.uid);

                AsyncStorage.setItem('USER', userID);
                // AsyncStorage.setItem('TOKEN', JSON.stringify(loginResponse.token));
				AsyncStorage.setItem('LOGGED', "YES");
                AsyncStorage.setItem('STEP_NUMBER', "FINISHED");

                getUserData(userID);
            }
            
            else if(loginResponse.errortipo == -2 || loginResponse.errortipo == -1){
                setLoadingModal(false);
                setErrorModal(true);

				setTimeout(() => {
                    setErrorModal(false);
                    setEmail("");
                    setPassword("");
				}, 2000)
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

    async function getUserData(id){
        const { changeAdminState } = props;

        try {
            setLoadingModal(false);

            const userDataResponse = await API_USER.userMainData(id);

            console.log('user data response =>', userDataResponse);

            if (userDataResponse.status == 200) {
                console.log("success", userDataResponse);

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
                    pais: userDataResponse.data.pais
                });
                
                setEmail("");
                setPassword("");
                
                props.navigation.navigate("Index");
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

    return(
        <View style = {styles.container}>
            <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />
            <ErrorModal visibleModal={errorModal} text={'Credenciales invalidas'} />

            <AwesomeAlert
                show={showIncompleteFormModal}
                showProgress={false}
                title={'Informacion incompleta'}
                message= {'Favor de llenar todos los campos'}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Entendido"
                confirmButtonColor= "#03b388"
                onConfirmPressed={() => {
                    setShowIncompleteFormModal(false)
                }}
            />

            <Image source = {Logo} style = {styles.imageStyle}/>

            <View style = {styles.loginHeader}>
                <Text style = {{fontSize: 28, fontWeight: "700", marginBottom: 10}}>Login</Text>
                <Text style = {{fontSize: 16, fontWeight: "400", color: "gray", fontStyle: "italic"}}>Bienvenido a Aldel</Text>
            </View>

            <View style = {styles.inputsContainers}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder = "Email"
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    returnKeyType={ 'done' }
                    value = {email}
                    onChangeText = {text => setEmail(text)}
                />

                <TextInput
                    style={styles.inputStyle}
                    placeholder = "Contraesña"
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    value = {password}
                    returnKeyType={ 'done' }
                    onChangeText = {text => setPassword(text)}
                /> 
            </View>


            {/* <TouchableOpacity style = {{marginTop: 20, marginBottom: 20}}>
                <Text style = {{color: "#03b388", fontWeight: "600", alignSelf: "flex-end", marginRight: 10, fontSize: 12}}> Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
 */}


            <TouchableOpacity style = {styles.loginButton} onPress = {() => handleLogin()}>
                <Text style = {styles.textButton}>Login</Text>
            </TouchableOpacity>

            <View style = {{alignSelf: "center", flexDirection: "row", marginTop: 10}}>
                <Text>No tienes cuenta?</Text>
                
                <TouchableOpacity onPress = {() => props.navigation.navigate("Signup")}>
                    <Text style = {{color: "#03b388", fontWeight: "600"}}> Crear una cuenta </Text>
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
    imageStyle: {
        marginTop: "10%",
        width: 70,
        height: 70,
        margin: 15,
    }, 
    inputsContainers: {
        marginTop: 60, 
        marginRight: 20
    }, 
    inputStyle: {
        backgroundColor: "#ffffff",
        padding: 12,
        margin: 10,
        marginLeft: 20,
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
    loginButton: {
        padding: 15, backgroundColor: "#03b388",
        margin: 20, marginTop: 70, marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    textButton: {
        textAlign:"center", color: "white", fontSize: 14
    }, 
    loginHeader: {
        marginLeft: 20, 
        marginTop: 20
    }
});

const mapDispatchToProps = dispatch => ({
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});


export default connect(null, mapDispatchToProps)(Login);
