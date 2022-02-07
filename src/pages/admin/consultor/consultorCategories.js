import React, { useState, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet,Keyboard, Platform, Image, ScrollView, TouchableOpacity, Switch, SafeAreaView, Modal } from "react-native";
import { connect } from "react-redux";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ic from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
//local imports
import setCategoriesData from '../../../redux/actions/admin/categories';
import API from '../../../apis/admin/adminSetup';
import LoaderModal from '../../../utils/modalLoader';

function Categories(props) { 

        const { categoriesData, setCategoriesData, adminData } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const insets = useSafeAreaInsets();

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
                    setLoadingModal(false);
                    props.navigation.goBack();
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

        console.log("categories redux ->", categoriesData);

        return(
                <View
                    style = {styles.container} style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom,}]}
                >
                    <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />

                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                            <Ic name= "arrow-left" size= {18} color = "black"/>
                        </TouchableOpacity>
                        <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                            Categorías
                        </Text>
                    </View>

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

                    <TouchableOpacity style = {styles.saveButton} onPress = {() => updateMyCategories()}>
                        <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Guardar cambios</Text>
                    </TouchableOpacity>
                    
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


export default connect(mapStateToProps, mapDispatchToProps)(Categories);
