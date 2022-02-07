import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, Modal, Platform, Image, ScrollView, TouchableOpacity, Switch, SafeAreaView, TextInput } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Steps from 'react-native-steps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
//local imports
import changeQuestionsState from '../../../../redux/actions/admin/questionsActions';
import API from '../../../../apis/admin/adminSetup';
import LoaderModal from '../../../../utils/modalLoader';
import configs from '../config';

const labels = ["Informacion","Canales","Formulario","Categorias"];
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

function Step3Categories(props) { 

        const { questionsData, changeQuestionsState } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const [newQuestionModal, setNewQuestionModal] = useState(false);
        const [newQuestionText, setNewQuestionText] = useState(" ");
        const [updateDeleteQuestionModal, setUpdateDeleteQuestionModal] = useState(false);
        const [questionSelected, setQuestionSelected] = useState({});
        const insets = useSafeAreaInsets();

        useEffect(() => {
            getQuestions();
        }, [])

        function functionResetQuestions (){
            setLoadingModal(false);
            setNewQuestionModal(false);
            setNewQuestionText("");
            setUpdateDeleteQuestionModal(false);
            setQuestionSelected({});

            getQuestions();
        }

        function selectQuestion(item){
            setQuestionSelected(item);
            setUpdateDeleteQuestionModal(true);
        }


        async function getQuestions(){
            const { changeQuestionsState } = props;
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

        function nextStep(){
            AsyncStorage.setItem("STEP_NUMBER", "4");
            props.navigation.navigate("Step4Categories");
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
            <SafeAreaView
                style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}
            >
                <Modal 
                    animationType="slide"
                    visible={newQuestionModal}
                    stylrrrre = {{backgroundColor: "#f5f5f5"}}
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
                    <View style = {{flex: 1, backgroundColor: "#f5f5f5", paddingTop: insets.top - 20, paddingBottom: insets.bottom}}>
                        <View>
                            <Text style = {{margin: 20, marginLeft: 5}} onPress = {() => setUpdateDeleteQuestionModal(false)}>X</Text>
                        </View>

                        <View styles = {styles.inputsContainer}>
                            <TextInput 
                                style={styles.inputStyle} 
                                autoCorrect={false} 
                                placeholder = "EJ. Para que me quieres contactar? "
                                placeholderTextColor={'#dcdcdc'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                                returnKeyType={"done"} 
                                multiline = {true}
                                value={questionSelected.pregunta}
                                // setUser(prevUser => ({ ...prevUser, [e.target.name]: e.target.value }));
                                onChangeText = {text => setQuestionSelected(prevObject => ({...prevObject, pregunta: text}))}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style = {styles.deleteQuestion} onPress = {() => deleteQuestion()}>
                        <Text style = {{textAlign: "center", color: "#CB0A13", fontSize: 12}}>  <Icon name= "trash" size= {18} color = "#CB0A13"/> Eliminar pregunta</Text>
                    </TouchableOpacity>
                </Modal>

                    <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />

                    <View style = {{marginTop: 40}}>
                        <Steps
                            configs={configs}
                            current={2}
                            labels={labels}
                            reversed={false}
                            count = {4}
                        />
                    </View>

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 6, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} >
                            {/* <Icon name= "arrow-left" size= {18} color = "black"/> */}
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Paso 3
                        </Text>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Predetermina las preguntas que tus clientes contestaran previo a contactarte.
                    </Text>

                    <View style = {{flex: 1}}>
                        <FlatList 
                            renderItem = {renderItem}
                            data = {fixedQuestions.concat(questionsData.data)}
                            style = {{marginBottom: 50}}
                        />

                        <TouchableOpacity style = {styles.newQuestionButton} onPress = {() => setNewQuestionModal(true)}>
                            <Text style = {{textAlign: "center", color: "white", fontSize: 20}}>+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <TouchableOpacity style = {styles.goBackButton} onPress= {()=> props.navigation.navigate("Step2Channels")}>
                        <Text style = {{color: "#03b388", textAlign: "center", fontSize: 13}}>Volver paso 2</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity 
                        onPress = {()=> nextStep()}
                        style = { styles.saveButton}
                    >
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Continuar</Text>
                    </TouchableOpacity>
                
                </SafeAreaView>
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
          bottom: 95,
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
      deleteQuestion: {
          position: "absolute", left: 15, right: 15, padding: 15, bottom: 10,
          borderRadius: 5
      },
      saveButton: {
        backgroundColor: "#03B388", position: "absolute", left: 10, right: 10, bottom: 65, padding: 12, 
        borderRadius: 5
      },
        goBackButton: {
            position: "absolute", left: 10, right: 10, bottom: 25, padding: 12, 
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


export default connect(mapStateToProps, mapDispatchToProps)(Step3Categories);
