import React, { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, Image, StatusBar, Platform, TextInput, TouchableOpacity, Modal, BackHandler} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OneSignal from 'react-native-onesignal';
import AwesomeAlert from 'react-native-awesome-alerts';
//Local imports
import Logo from '../../assets/chat-logo.png';
import API from '../../apis/sesion/signup';
import LoaderModal from '../../utils/modalLoader';
import ErrorModal from '../../utils/errorModal';
import changeAdminState from '../../redux/actions/admin/adminActions';

function Signup(props) {

    const { changeAdminState, adminData } = props;
    const [ loadingModal, setLoadingModal ] = useState(false);
    const [ errorModal, setErrorModal ] = useState(false);
    const [ isConsultor, setIsConsultor ] = useState(true);
    const [ showIncompleteFormModal, setShowIncompleteFormModal ] = useState(false);
    const [ accountTakenError, setAccountTakenError ] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => {
            backHandler.remove()
        }
    }, []);


    function cleanInputs(){
        setLoadingModal(false);
        setAccountTakenError(false);
        changeAdminState({
            email: "",
            nombre: '',
            apellidoPaterno: '', 
            password: ''
        })
    }

    async function handleSignup(){

        const userTypeSelected = isConsultor ? 3 : 2;

        const deviceState = await OneSignal.getDeviceState();

        if(!(adminData.email && adminData.password && adminData.apellidoPaterno && adminData.nombre)){
            return setShowIncompleteFormModal(true);
        } else {
            try {
                setLoadingModal(true);
    
                const signupResponse = await API.signUp(adminData, userTypeSelected, deviceState.userId);
    ``
                if (signupResponse.status == 200) {
                    setLoadingModal(false);
    
                    changeAdminState({
                        idUsuario: signupResponse.data.id_usuario,
                        iDtipoUsuario: isConsultor ? 3 : 2
                    })
    
                    const userID = signupResponse.data.id_usuario.toString();
    
                    AsyncStorage.setItem('USER', userID);
                    AsyncStorage.setItem('LOGGED', "YES");;
                    AsyncStorage.setItem('STEP_NUMBER', "1");
    
                    userTypeSelected == 3 ? props.navigation.navigate("IntroConsultor") : props.navigation.navigate("IntroClient")
    
                } else if(signupResponse.status == 201){
                    setLoadingModal(false);
                    setAccountTakenError(true);
                }
            
                // else if(loginResponse.errortipo == -2 || loginResponse.errortipo == -1){
    
                //     setLoadingModal(false);
                //     setErrorModal(true);
    
                // 	setTimeout(() => {
                //         setErrorModal(false);
                //         setEmail("");
                //         setPassword("");
                // 	}, 2000)
                    
                // }
              
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
    }

    return(
        <KeyboardAwareScrollView
            style = {styles.container}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
        >
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

            <AwesomeAlert
                show={accountTakenError}
                showProgress={false}
                title={'Esta cuenta ya existe'}
                message= {'Usuario o contraseña ya existen'}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Entendido"
                confirmButtonColor= "#03b388"
                onConfirmPressed={() => cleanInputs()}
            />          
            <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />
            <ErrorModal visibleModal={errorModal} text={'Credenciales invalidas'} />

            <Image source = {Logo} style = {styles.imageStyle}/>

            <View style = {styles.loginHeader}>
                <Text style = {{fontSize: 28, fontWeight: "700", marginBottom: 10}}>Crear cuenta</Text>
                {/* <Text style = {{fontSize: 16, fontWeight: "400", color: "gray", fontStyle: "italic"}}>Crea tu cuenta en Aldel</Text> */}
            </View>

            <View style = {styles.userTypeSelect}>
                <TouchableOpacity 
                    onPress = {() => setIsConsultor(true)}
                    style = {isConsultor ? styles.selectedType : styles.notSelectedType}
                >
                    <Text style = {isConsultor ? styles.selectedText : styles.notSelectedText}>Soy consultor</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress = {() => setIsConsultor(false)}
                    style = {[{marginLeft: 20}, !isConsultor ? styles.selectedType : styles.notSelectedType]}
                >
                    <Text style = {!isConsultor ? styles.selectedText : styles.notSelectedText}>Soy cliente</Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.inputsContainers}>

                <TextInput
                    style={styles.inputStyle}
                    placeholder = "Nombre"
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    returnKeyType={ 'done' }
                    value = {adminData.nombre}
                    onChangeText = {text => changeAdminState({nombre: text})}
                />

                <TextInput
                    style={styles.inputStyle}
                    placeholder = "Apellido"
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    returnKeyType={ 'done' }
                    value = {adminData.apellidoPaterno}
                    onChangeText = {text => changeAdminState({apellidoPaterno: text})}
                />

                <TextInput
                    style={styles.inputStyle}
                    placeholder = "Email"
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    returnKeyType={ 'done' }
                    value = {adminData.email}
                    onChangeText = {text => changeAdminState({email: text})}
                />

                <TextInput
                    style={styles.inputStyle}
                    placeholder = "Constraseña"
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    secureTextEntry = {true}
                    value = {adminData.password}
                    returnKeyType={ 'done' }
                    onChangeText = {text => changeAdminState({password: text})}
                />       
            </View>


            {/* <TouchableOpacity style = {{marginTop: 20, marginBottom: 20}}>
                <Text style = {{color: "#03b388", fontWeight: "600", alignSelf: "flex-end", marginRight: 10, fontSize: 12}}> Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
 */}

            <TouchableOpacity style = {styles.loginButton} onPress = {() => handleSignup()}>
                <Text style = {styles.textButton}>Crear cuenta</Text>
            </TouchableOpacity>

            <View style = {{alignSelf: "center", flexDirection: "row", marginTop: 10}}>
                <Text>Ya tienes cuenta?</Text>
                <TouchableOpacity onPress = {() => props.navigation.navigate("Login")}>
                    <Text style = {{color: "#03b388", fontWeight: "600"}}> Ir a Login</Text>
                </TouchableOpacity>
            </View>
             
        </KeyboardAwareScrollView>
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
        marginTop: 20, 
        marginRight: 20
    }, 

    userTypeSelect: {
        marginLeft: 20,
        flexDirection: "row",
        marginTop: 20,
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
        marginTop: 9
    }, 
    selectedType: {
        backgroundColor: "#03b388", 
        padding: 7, 
        borderRadius: 5
    },
    notSelectedType: {
        backgroundColor: "transparent", 
        padding: 7, 
        borderColor: "gray",
        borderWidth: 0.3,
        borderRadius: 5
    },
    selectedText: {
        color: "white", 
        fontSize: 13,
    },
    notSelectedText: {
        color: "gray",
        fontSize: 13,
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
