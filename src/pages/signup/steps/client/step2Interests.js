import React, { useState, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet,Keyboard, Platform, Image, ScrollView, TouchableOpacity, Switch, SafeAreaView, Modal } from "react-native";
import { connect } from "react-redux";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Steps from 'react-native-steps';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
//local imports
import setCategoriesData from '../../../../redux/actions/admin/categories';
import API from '../../../../apis/admin/adminSetup';
import LoaderModal from '../../../../utils/modalLoader';
import configs from '../config';
import SuccessSignupConsultor from "./successSignup";

const labels = ["Informacion", "Intereses"];

function Step4Categories(props) { 

        const { categoriesData, setCategoriesData, adminData } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const insets = useSafeAreaInsets();
        const [ showSuccessPage, setShowSuccessPage ] = useState(false);

        useEffect(() => {
            getCategoryList()
        }, [])

        async function getCategoryList(){
            setLoadingModal(true);

            try {
    
                const getCategoriesResponse = await API.getCategories(adminData.idUsuario);
    
                console.log('get categories respuesta =>', getCategoriesResponse);
    
                if (getCategoriesResponse.status == 200) {
                    setLoadingModal(false);

                    setCategoriesData({
                        categories: getCategoriesResponse.subcategorias, 
                        myCategories: getCategoriesResponse.mis_categorias
                    })
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

        async function updateMyCategories(){
            setLoadingModal(true);

            try {
    
                const updatedCategoriesResponse = await API.updateCategories(adminData.idUsuario, categoriesData.myCategories);
    
                console.log('updated categories respuesta =>', updatedCategoriesResponse);
    
                if (updatedCategoriesResponse.status == 200) {
                    AsyncStorage.setItem("STEP_NUMBER", "FINISHED");

                    setLoadingModal(false);
                    setShowSuccessPage(true);
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

        function onSelectedItemsChange(selectedItems){
            console.log("Seleccionado - >", selectedItems);
            
            setCategoriesData({myCategories: selectedItems});
        }

        function nav(){
            setShowSuccessPage(false);
            props.navigation.navigate("Index");
        }

        console.log("categories ->", categoriesData);

        return(
            <View 
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
            >
                <Modal 
                    animationType="slide"
                    visible={showSuccessPage}
                    style = {{backgroundColor: "#f5f5f5"}}
                >   
                    <SuccessSignupConsultor 
                        navigateToIndex = {() => nav()}
                    />
                </Modal>

                <SafeAreaView
                    style = {styles.container} style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}
                    // contentContainerStyle={styles.container}
                    // scrollEnabled={true}
                >
                    <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />

                    <View style = {{marginTop: 40}}>
                        <Steps
                            configs={configs}
                            current={3}
                            labels={labels}
                            reversed={false}
                            count = {2}
                        />
                    </View>

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 6, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} >
                            {/* <Icon name= "arrow-left" size= {18} color = "black"/> */}
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Paso 2
                        </Text>
                    </View>

                    <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Elige tus intereses
                    </Text>

                    <View>
                        <SectionedMultiSelect
                            items={categoriesData.categories}
                            IconRenderer={Icon}
                            uniqueKey="id"
                            subKey="children"
                            displayKey = "name"
                            selectText="Elige tus categorias..."
                            confirmText = "Listo"
                            selectedText= "seleccionadas"
                            searchPlaceholderText = "Buscar categorias"
                            showDropDowns={true}
                            colors = {{primary: "#03B388"}}
                            readOnlyHeadings={true}
                            onSelectedItemsChange = {onSelectedItemsChange}
                            selectedItems={categoriesData.myCategories}
                        />
                    </View>

                    {/* <TouchableOpacity style = {styles.goBackButton} onPress= {()=> props.navigation.navigate("Step1MainDataClient")}>
                        <Text style = {{color: "#03b388", textAlign: "center", fontSize: 13}}>Volver paso 3</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style = {styles.saveButton} onPress = {() => updateMyCategories()}>
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Finalizar</Text>
                    </TouchableOpacity>
                    
                </SafeAreaView>

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
        backgroundColor: "#03B388",
        position: "absolute", 
        left: 10, right: 10, bottom: 30,
        padding: 12, 
        marginLeft: 10, 
        marginRight: 10,
        borderRadius: 5
    },
    goBackButton: {
        position: "absolute", left: 10, right: 10, bottom: 25, padding: 12, 
    }   
});

const mapStateToProps = (state) => {
    return {
        categoriesData: state.categoriesData,
        adminData: state.adminData,
    }
}

const mapDispatchToProps = dispatch => ({
    setCategoriesData: (object) => dispatch(setCategoriesData(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Step4Categories);
