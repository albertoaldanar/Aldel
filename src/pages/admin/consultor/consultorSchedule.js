import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, FlatList, TouchableOpacity, Switch, TextInput, Modal } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReducer } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ConsultorSchedule(props) {

        
        const [questionsOn, setQuestionsOn ] = useState(true);
        const [startHour, setStartHour] = useState("");
        const [endHour, setEndHour] = useState("");
        const [date, setDate] = useState(new Date(1598051730000));
        const [mode, setMode] = useState('date');
        const [show, setShow] = useState(false);
        const [showAndroid, setShowAndroid] = useState(false);
        const insets = useSafeAreaInsets();
      
        const onChange = (event, selectedDate) => {
            if(Platform.OS === 'android'){
                setShowAndroid(false)
            }   

        };
      
        const showMode = (currentMode) => {
          setShow(true);
          setMode(currentMode);
        };
      
        const selectPlatform = () => {
          if(Platform.OS === "android"){
              setShowAndroid(true)
          } else {
            setShow(true)
          }
        };
      
        const showTimepicker = () => {
          showMode('time');
        };

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}>

                <Modal 
                    animationType="slide"
                    visible={show}
                    style = {{margin: 0, backgroundColor: "#f5f5f5"}}
                >      

                    <TouchableOpacity style = {{margin: 20}} onPress = {() => setShow(false)}>
                        <Text>X</Text>
                    </TouchableOpacity>

                    <View style = {{marginTop: "50%"}}>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={"time"}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />

                    </View>

                    <TouchableOpacity style = {styles.saveButton} onPress = {() => setShow(false)}>
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Listo</Text>
                    </TouchableOpacity>

                </Modal>

                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Horarios de atención
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Determina en que horario estarás disponible para interacciones.
                </Text>


                <View style= {styles.boxContainer}>
                    <View style = {styles.box}>
                        <View style = {{flexDirection: "row", marginTop: 7}}>
                            <Icon name= "calendar" size= {18} color =  "gray"/>
                            <Text style = {{marginLeft: 15, fontWeight: "300", fontSize: 14}}>Habilitar horarios</Text>
                        </View>

                        <Switch 
                            trackColor={{ false: "#767577", true: "#058C6B" }}
                            thumbColor={questionsOn ? "#03B388" : "#f4f3f4"}
                            ios_backgroundColor="#dcdcdc"
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            onValueChange = {choice => setQuestionsOn(choice)}
                            value = {questionsOn}
                        />  
                    </View>
                </View>

                {
                    questionsOn ?       

                        <View style = {{flex: 1}}>

                            <View style = {{flexDirection: "row", margin: 20}}>
                                <Text style = {{fontSize: 16, fontWeight: "300", marginRight: 10, marginTop: 13, color: "gray"}}>Desde:</Text>

                                <TouchableOpacity style = {[styles.box, {borderRadius: 0}]} onPress = { selectPlatform }>    
                                    <Text>10:00 AM</Text>
                                </TouchableOpacity>
                            </View>


                            <View style = {{flexDirection: "row", margin: 20}}>
                                <Text style = {{fontSize: 16, fontWeight: "300", marginRight: 10, marginTop: 13, color: "gray"}}>Hasta:</Text>

                                <TouchableOpacity style = {[styles.box, {borderRadius: 0}]} onPress = { selectPlatform }>    
                                    <Text>10:00 AM</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                showAndroid ? 
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={"time"}
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChange}
                                    />
                                :
                                    null
                            }

                            <TouchableOpacity style = {styles.saveButton}>
                                <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Guardar cambios</Text>
                            </TouchableOpacity>
                        </View>

                    :   
                        <View>

                            <Image source = {{uri: "https://img.icons8.com/bubbles/2x/overtime.png"}} style = {{height: 140, width: 140, alignSelf: "center"}}/> 
                            <Text style = {{textAlign: "center", fontWeight: "600", margin: 20, fontSize: 20}}>Tus horarios de atención, están desactivados.</Text>
                            <Text style = {{color: "gray", margin: 20, textAlign: "center", fontStyle: "italic", marginTop: 0}}>Si tu horario de atención este desactivado, tus contactos de Aldel, pueden contactarte a cualquier hora.</Text>
                        </View>
                }

            </View>
        );
}

const mapStateToProps = (state) => {
    return {
        aldel: state.aldel,
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5", 
    },
    boxContainer: {
        margin: 20,
        marginLeft: 10,
        marginRight: 10
    },

    box: {
        flexDirection:"row", 
        justifyContent: "space-between", 
        borderRadius: 10, 
        // borderColor: "gray", 
        // borderWidth: 0.5,
        backgroundColor: "#ffffff",
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        elevation: 1,
        marginBottom: 15
    },
    saveButton: {
        backgroundColor: "#03B388", position: "absolute", left: 10, right: 10, bottom: 15, padding: 12, 
        borderRadius: 0
    }
 
});


export default connect(mapStateToProps)(ConsultorSchedule);



