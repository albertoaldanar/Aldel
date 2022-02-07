import React, { useState } from "react";
import { Dimensions, View, Text, StyleSheet,Keyboard, Platform, Image, ScrollView, TouchableOpacity, Switch, SafeAreaView, TextInput } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Steps from 'react-native-steps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountrySelectDropdown from "react-native-searchable-country-dropdown";
//local imports
import changeAdminState from '../../../../redux/actions/admin/adminActions';
import API from '../../../../apis/admin/adminMain';
import LoaderModal from '../../../../utils/modalLoader';
import configs from '../config';


const labels = ["Informacion", "Intereses"];


function Step1MainDataClient(props) { 

        const { adminData, changeAdminState } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const insets = useSafeAreaInsets();

        async function nextStep(){
            setLoadingModal(true);

            try {
                const { adminData } = props;
    
                const updateUserData = await API.updateUserData(adminData);
    
                console.log('update usuario respuest =>', updateUserData);
    
                if (updateUserData.status == 200) {
                    AsyncStorage.setItem("STEP_NUMBER", "2");
                    setLoadingModal(false);

                    props.navigation.navigate("Step2Interests");

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

        return(
            <KeyboardAwareScrollView 
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
            >
                <SafeAreaView
                    style = {styles.container} style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}
                    // contentContainerStyle={styles.container}
                    // scrollEnabled={true}
                >
                    <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />

                    <View style = {{marginTop: 40}}>
                        <Steps
                            configs={configs}
                            current={0}
                            labels={labels}
                            reversed={false}
                            count = {2}
                        />
                    </View>

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} >
                            {/* <Icon name= "arrow-left" size= {18} color = "black"/> */}
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Paso 1
                        </Text>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Describe sobre tu persona y quien eres
                    </Text>
                    <ScrollView style = {{flex: 1, marginBottom: 25}}>
                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                        Tu descripción
                        </Text>

                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholderTextColor={'#9e9e9e'} selectionColor={'#03b388'} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                onSubmitEditing={Keyboard.dismiss} 
                                value={adminData.descripcion}
                                onChangeText = {text => changeAdminState({ descripcion: text })}
                                >
                            </TextInput>
                        </View>

                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 40, marginBottom: 3}}>
                        Cuentanos de ti
                        </Text>
                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholderTextColor={'#9e9e9e'} selectionColor={"#03b388"} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                onSubmitEditing={Keyboard.dismiss}
                                value={adminData.resumen}
                                onChangeText = {text => changeAdminState({ resumen: text })}
                                >
                            </TextInput>
                        </View>

                        <View style = {{margin: 20, marginTop: 30}}>
                            <CountrySelectDropdown
                                countrySelect={country => changeAdminState({ pais: country }) }
                                textColor={"black"}
                                defaultCountry = {adminData.pais}
                            />
                        </View>
                    </ScrollView>

                    <TouchableOpacity style = {styles.saveButton} onPress = {() => nextStep()}>
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Siguiente</Text>
                    </TouchableOpacity>
                    
                </SafeAreaView>

            </KeyboardAwareScrollView>
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
        backgroundColor: "#03B388",
        // position: "absolute", 
        // left: 10, right: 10, bottom: 20,
        padding: 12, 
        marginLeft: 10, 
        marginRight: 10,
        borderRadius: 5
    }
});

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData,
    }
}

const mapDispatchToProps = dispatch => ({
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Step1MainDataClient);
