import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, FlatList, TouchableOpacity, Switch, TextInput, Modal } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
//local imports
import API from '../../../apis/admin/adminSetup';
import changeQuestionsState from '../../../redux/actions/admin/questionsActions';
import LoaderModal from '../../../utils/modalLoader';

function ConsultorQuestions(props) {

        const { questionsData, changeQuestionsState } = props;
        const [questionsOn, setQuestionsOn ] = useState(true);
        const [newQuestionModal, setNewQuestionModal] = useState(false);
        const [updateDeleteQuestionModal, setUpdateDeleteQuestionModal] = useState(false);
        const [loadingModal, setLoadingModal] = useState(false);
        const [newQuestionText, setNewQuestionText] = useState(" ");
        const [questionSelected, setQuestionSelected] = useState({});
        const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
        const insets = useSafeAreaInsets();
        const fixedQuestions = [
            {
                id_pregunta_formulario: -1,
                pregunta: "Introducete" 
              },
              {
                id_pregunta_formulario: 0,
                pregunta: "Motivo de interaccion" 
              }
        ];

        useEffect(() => {
            getQuestions();
        }, [])

        function functionResetQuestions (){
            setLoadingModal(false);
            setNewQuestionModal(false);
            setUpdateDeleteQuestionModal(false);
            setQuestionSelected({});

            getQuestions();
        }

        function selectQuestion(item){
            setQuestionSelected(item);
            setUpdateDeleteQuestionModal(true);
        }

        async function getQuestions(){

            const ID = await AsyncStorage.getItem("USER");

            try {
    
                const questionsResponse = await API.getQuestions(ID);
    
                console.log('questions response =>', questionsResponse);
    
                if (questionsResponse.status == 200) {
                    console.log("success");
    
                    changeQuestionsState({
                        data: questionsResponse.data
                    });
                    
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

        async function createQuestion(){

            const ID = await AsyncStorage.getItem("USER");

            try {
    
                const createQuestionResponse = await API.createQuestion(ID, newQuestionText);
    
                console.log('create question =>', createQuestionResponse);
    
                if (createQuestionResponse.status == 200) {
                    console.log("success");
                    functionResetQuestions();
                    setNewQuestionText("");

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

        async function deleteQuestion(){
            setDeleteConfirmModal(false);
            setUpdateDeleteQuestionModal(false);

            try {
    
                const deleteQuestionResponse = await API.deleteQuestion(questionSelected.id_pregunta_formulario);
    
                console.log('delete question =>', deleteQuestionResponse);
    
                if (deleteQuestionResponse.status == 200) {
                    console.log("success");
                    functionResetQuestions();

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

        const renderItem = ({item, index}) => (
            <TouchableOpacity 
                style = {item.id_pregunta_formulario === 0 || item.id_pregunta_formulario === -1  ? styles.questionItemDisabled : styles.questionItem} 
                onPress = {() => selectQuestion(item)}
                disabled = {item.id_pregunta_formulario === 0 || item.id_pregunta_formulario === -1}
            >
                <Text>{index +  1}. {item.pregunta}</Text>
                <Icon size ={15} color = "gray" name = "ellipsis-h" />
            </TouchableOpacity>
        );
        
        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>

                <LoaderModal visibleModal={loadingModal} text={'Creando...'} />

                <Modal 
                    animationType="slide"
                    visible={newQuestionModal}
                    style = {{backgroundColor: "#f5f5f5"}}
                >   
                    <View style = {{flex: 1, backgroundColor: "#f5f5f5", paddingTop: insets.top - 20, paddingBottom: insets.bottom}}>
                        <View>
                            <Text style = {{margin: 20, marginLeft: 8, fontSize: 16}} onPress = {() => setNewQuestionModal(false)}>X</Text>
                        </View>
                        <Text style = {{margin: 10, fontWeight: "600", fontSize: 20}} >Escribe una pregunta</Text>

                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholder = "EJ. Para que me quieres contactar? "
                                placeholderTextColor={'#dcdcdc'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                value={newQuestionText}
                                onChangeText = {text => setNewQuestionText(text)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style = {styles.questionButton} onPress = {() => createQuestion()}>
                        <Text style = {{textAlign: "center", color: "white"}}>Añadir pregunta</Text>
                    </TouchableOpacity>
                </Modal>

                <Modal 
                    animationType="slide"
                    visible={updateDeleteQuestionModal}
                    style = {{margin: 0, backgroundColor: "#f5f5f5"}}
                >   

                    <AwesomeAlert
                        show={deleteConfirmModal}
                        showProgress={false}
                        title="Estas seguro?"
                        message= "Esta pregunta probablemente tenga respuesta, si la eliminas se borrara también esa respuesta."
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        confirmText="Si, eliminar."
                        cancelText="Cancelar"
                        cancelButtonColor = "red"
                        confirmButtonColor="#03b388"
                        onConfirmPressed={() => {
                            deleteQuestion()
                        }}
                        onCancelPressed={() => {
                            setDeleteConfirmModal(false)
                        }}
                    />
                    <View style = {{flex: 1, backgroundColor: "#f5f5f5", paddingTop: insets.top - 20, paddingBottom: insets.bottom}}>
                        <View>
                            <Text style = {{margin: 20, marginLeft: 5}} onPress = {() => setUpdateDeleteQuestionModal(false)}>X</Text>
                        </View>

                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                editable = {false}
                                placeholder = "EJ. Para que me quieres contactar? "
                                placeholderTextColor={'#dcdcdc'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                value={questionSelected.pregunta}
                                onChangeText = {text => setQuestionSelected(prevObject => ({...prevObject, pregunta: text}))}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style = {styles.deleteQuestion} onPress = {() => setDeleteConfirmModal(true)}>
                        <Text style = {{textAlign: "center", color: "#CB0A13", fontSize: 12}}>  <Icon name= "trash" size= {18} color = "#CB0A13"/> Eliminar pregunta</Text>
                    </TouchableOpacity>
                </Modal>

                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Formulario
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Predetermina las preguntas que tus clientes contestaran previo a contactarte.
                </Text>

                <View style = {{flex: 1}}>
                    <Text style = {{margin: 10, fontSize: 17, fontWeight: "600"}}>Preguntas</Text>
                    <FlatList 
                        renderItem = {renderItem}
                        data = {fixedQuestions.concat(questionsData.data)}
                    />

                    <TouchableOpacity style = {styles.newQuestionButton} onPress = {() => setNewQuestionModal(true)}>
                        <Text style = {{textAlign: "center", color: "white", fontSize: 20}}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5", 
    },
    channelsContainer: {
        margin: 20,
        marginLeft: 10,
        marginRight: 10
    },

    questionItem: {
        flexDirection: "row", 
        justifyContent:"space-between",
        backgroundColor: "#ffffff",
        padding: 15,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        elevation: 1,
    },
    questionItemDisabled: {
        flexDirection: "row", 
        justifyContent:"space-between",
        backgroundColor: "#dcdcdc",
        padding: 15,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        elevation: 1, 
    },
    channel: {
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
    newQuestionButton: {
        position: "absolute", 
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#03b388", 
        bottom: 25,
        right: 25, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        elevation: 1, textAlignVertical: "top", borderRadius: 5, 
        marginTop: 30
    },
    inputsContainer: {
        marginTop: 160,
    },
    questionButton: {
        backgroundColor: "#03B388", position: "absolute", left: 15, right: 15, padding: 9, bottom: 60,
        borderRadius: 5
    },
    deleteQuestion: {
        position: "absolute", left: 15, right: 15, padding: 15, bottom: 20,
        borderRadius: 5
    }
});

const mapStateToProps = (state) => {
    return {
        questionsData: state.questionsData,
    }
}

const mapDispatchToProps = dispatch => ({
    changeQuestionsState: (object) => dispatch(changeQuestionsState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ConsultorQuestions);



