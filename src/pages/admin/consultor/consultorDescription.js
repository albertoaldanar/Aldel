import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput, Dimensions } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//local imports
import changeAdminState from '../../../redux/actions/admin/adminActions';
import API from '../../../apis/admin/adminMain';
import LoaderModal from '../../../utils/modalLoader';

function ConsultorDescription(props) {

        const [loadingModal, setLoadingModal] = useState(false);
        const insets = useSafeAreaInsets();

        async function updateAdminData(){
            setLoadingModal(true);

            try {
                const { adminData } = props;
    
                const updateUserData = await API.updateUserData(adminData);
    
                console.log('update usuario respuest =>', updateUserData);
    
                if (updateUserData.status == 200) {
                    setLoadingModal(false);
                    props.navigation.goBack();

                } else if(updateUserData.errortipo == -2){
                    setLoadingModal(false);
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

        const { adminData, changeAdminState } = props;

        return(
            <View style = {styles.container} style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}>
                    <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                            <Icon name= "arrow-left" size= {18} color = "black"/>
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Descripción
                        </Text>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Describe sobre tu persona, experiencia laboral, conocimientos etc.
                    </Text>

                    <KeyboardAwareScrollView 
                        contentContainerStyle = {{ paddingBottom: Dimensions.get("window").height * .3, flexGrow: 1}}
                        extraScrollHeight={Dimensions.get("window").height * .1}
                        enableOnAndroid={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                    >

                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                            Tu descripción
                        </Text>

                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholderTextColor={'#9e9e9e'} selectionColor={'#c62828'} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                blurOnSubmit = {true}
                                value={adminData.descripcion}
                                onChangeText = {text => changeAdminState({ descripcion: text })}
                                >
                            </TextInput>
                        </View>

                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                            Experiencia profesional
                        </Text>
                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholderTextColor={'#9e9e9e'} selectionColor={'#c62828'} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                blurOnSubmit = {true}
                                value={adminData.resumen}
                                onChangeText = {text => changeAdminState({ resumen: text })}
                                >
                            </TextInput>
                        </View>

                </KeyboardAwareScrollView>

                <View style = {styles.bottomContainer}>
                    <TouchableOpacity style = {styles.saveButton} onPress = {() => updateAdminData()}>
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Guardar cambios</Text>
                    </TouchableOpacity>
                </View>

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
        padding: 25,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        paddingTop: 25,
        elevation: 1, textAlignVertical: "top", borderRadius: 5
    },
    inputsContainer: {
        marginTop: 60,
    },
    saveButton: {
        backgroundColor: "#03B388", padding: 12, 
        borderRadius: 5, marginLeft: 10, marginRight: 10, marginBottom: 10
    },
    bottomContainer: {
        backgroundColor: "#f5f5f5", position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, 
    },
});

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData,
    }
}

const mapDispatchToProps = dispatch => ({
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ConsultorDescription);
