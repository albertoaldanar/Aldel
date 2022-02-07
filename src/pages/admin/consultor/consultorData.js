import React, { useState, useEffect } from "react";
import { Alert, View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput, Dimensions } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CountrySelectDropdown from "react-native-searchable-country-dropdown";

//local imports
import API from '../../../apis/admin/adminMain';
import LoaderModal from '../../../utils/modalLoader';
import changeAdminState from '../../../redux/actions/admin/adminActions';

function ConsultorData(props) {
        
        const { adminData, changeAdminState } = props;
        const insets = useSafeAreaInsets();
        const [showCalendar, setShowCalendar] = useState(false);
        const [loadingModal, setLoadingModal] = useState(false);
 
        async function updateAdminData(){
            setLoadingModal(true);

            try {
                const updateUserData = await API.updateUserData(adminData);
    
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
        
        console.log("admin data", adminData)

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
                <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />
                <View>
                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Información
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Completa tu perfil llenando los siguientes campos.
                </Text>

                <KeyboardAwareScrollView 
                    contentContainerStyle = {{ paddingBottom: Dimensions.get("window").height * .3, flexGrow: 1}}
                    extraScrollHeight={Dimensions.get("window").height * .1}
                    enableOnAndroid={true}
                    enableAutomaticScroll={(Platform.OS === 'ios')}
                >

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 30, marginBottom: 3}}>
                        Nombre completo
                    </Text>

                    <View styles = {styles.inputsContainer}>
                        <TextInput 
                            style={styles.inputStyle} 
                            autoCorrect={false} 
                            placeholderTextColor={'#9e9e9e'} selectionColor={'#c62828'} autoCapitalize="none" autoCorrect={false}
                            returnKeyType={"done"} 
                            blurOnSubmit = {true}
                            multiline = {true}
                            value = {adminData.nombre}
                            onChangeText = { text => changeAdminState({ nombre: text })}
                            >
                        </TextInput>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 20, marginBottom: 3}}>
                        Apellido
                    </Text>

                    <View styles = {styles.inputsContainer}>
                        <TextInput 
                            style={styles.inputStyle} 
                            autoCorrect={false} 
                            placeholderTextColor={'#9e9e9e'} selectionColor={'#c62828'} autoCapitalize="none" autoCorrect={false}
                            returnKeyType={"done"} 
                            multiline = {true}
                            blurOnSubmit = {true}
                            value = {adminData.apellidoPaterno}
                            onChangeText = { text => changeAdminState({ apellidoPaterno: text })}
                            >
                        </TextInput>
                    </View>

                    <View style = {{flexDirection: "row"}}>
                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 20, marginBottom: 3}}>
                            Correo
                        </Text>
                    </View>

                    <View styles = {styles.inputsContainer}>
                        <TextInput 
                            style={styles.inputStyle} 
                            autoCorrect={false} 
                            placeholderTextColor={'#9e9e9e'} selectionColor={'#c62828'} autoCapitalize="none" autoCorrect={false}
                            returnKeyType={"done"} 
                            multiline = {true}
                            blurOnSubmit = {true}
                            value = {adminData.email}
                            editable = {false}
                            onChangeText = {text => changeAdminState({ email: text })}
                            >
                        </TextInput>
                    </View>

                    <View style = {{flexDirection: "row"}}>
                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 20, marginBottom: 3}}>
                            Pais
                        </Text>
                    </View>

                    <View style = {{margin: 20}}>
                        <CountrySelectDropdown
                            countrySelect={country => changeAdminState({ pais: country }) }
                            textColor={"black"}
                            defaultCountry = {adminData.pais}
                        />
                    </View>

                    {/* <View style = {{flexDirection: "row"}}>
                        <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 20, marginBottom: 3}}>
                            Fecha de nacimiento
                        </Text>
                    </View>
                    {
                        showCalendar ? 
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(1598051730000)}
                                style = {{ 
                                    borderRadius: 10, backgroundColor: "white", margin: 10, padding: 12,shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 3.0,
                                }}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={() => setShowCalendar(false)}
                            />
                        : 
                            
                            <TouchableOpacity style = {styles.inputStyle} onPress = {() => setShowCalendar(true)}>
                                <Text>16/Febrero/2020</Text>
                            </TouchableOpacity>
                    } */}
                </KeyboardAwareScrollView>

                </View>
                
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
    bottomContainer: {
        backgroundColor: "#f5f5f5", position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, 
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
        backgroundColor: "#03B388", padding: 12, 
        borderRadius: 5, marginLeft: 10, marginRight: 10, marginBottom: 10
    },
    savButton: {
        backgroundColor: "#03B388", position: "absolute", left: 10, right: 10, bottom: 25, padding: 12, 
        borderRadius: 5
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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultorData);



