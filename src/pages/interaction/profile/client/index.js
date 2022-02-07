import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput, Modal } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//Local imports
import LoaderModal from '../../../../utils/modalLoader';
import Reviews from '../consultor/profileSections/reviews';
import Interests from '../consultor/profileSections/categoriesSection';
import API from '../../../../apis/admin/adminMain';
import { setProfileState } from '../../../../redux/actions/profile/profileActions';

function ClientProfile(props) {

        const insets = useSafeAreaInsets();

        const { profileData } = props;
        const [loadingModal, setLoadingModal] = useState(false);
        const [reviewAverage, setReviewAverage] = useState(0);
        const [showReviewsModal, setShowReviewsModal] = useState(false); 
        const idUsuario = props.route.params.usuarioID;

        useEffect(() => {
            getProfile()
        }, [])

        function calculateReviewAverage(reviews){
            const reviewsLength = reviews.length;
            let reviewSum = 0;

            reviews.map(review => {
                reviewSum += review.estrellas_cliente
            })

            setReviewAverage((reviewSum / reviewsLength).toFixed(1));
        }

        async function getProfile(){

            const { setProfileState } = props;
            setLoadingModal(true);
    
            try {
    
                const profileResponse = await API.clientMainData(idUsuario);
    
                if (profileResponse.status == 200) {
                    console.log("success => ", profileResponse);
    
                    setProfileState({
                        apellidoMaterno: profileResponse.data.apellido_materno,
                        apellidoPaterno: profileResponse.data.apellido_paterno,
                        descripcion: profileResponse.data.descripcion,
                        email: profileResponse.data.email,
                        fechaNacimiento: profileResponse.data.fecha_nacimiento,
                        fotoPerfil: profileResponse.data.foto_perfil,
                        iDtipoUsuario: profileResponse.data.id_tipo_usuario,
                        idUsuario: profileResponse.data.id_usuario,
                        nombre: profileResponse.data.nombre,
                        resumen: profileResponse.data.resumen,
                        rfc: profileResponse.data.rfc,
                        telefono: profileResponse.data.telefono,
                        reviews: profileResponse.data.reviews, 
                        videoPerfil: profileResponse.data.video_perfil, 
                        categorias: profileResponse.data.categorias, 
                        pais: profileResponse.data.pais
                    });

                    calculateReviewAverage(profileResponse.data.reviews);
                    setLoadingModal(false);
                    
                } else {
                    setLoadingModal(false);
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


        console.log("data", profileData);

        return(
            <View style = {[styles.container, {paddingTop: insets.top - 20, paddingBottom: insets.bottom}]}>
                <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />

                <Modal 
                    animationType = "slide"
                    visible = {showReviewsModal} 
                >
                    <Reviews closeModal = {() => setShowReviewsModal(false)} reviews = {profileData.reviews} type = 'client'/>
                </Modal>

                <View style = {styles.fixedInformation}>
                    <View style = {styles.header}>

                        <TouchableOpacity onPress = {() => props.navigation.goBack()}>
                            <Icon name = "arrow-left" color = "#000000" size = {20}/>
                        </TouchableOpacity>

                    </View>

                    <View>
                        <Image source = {{uri: profileData.fotoPerfil}} style = {{alignSelf: "center", width: 100, height: 100, margin: 20, marginTop: 0, borderRadius: 50}}/>
                        <Text style = {{textAlign: "center", fontSize: 17, fontWeight: "600"}}>{profileData.nombre} {profileData.apellidoPaterno}</Text>
                    </View>

                    <View style = {{flexDirection: "row", justifyContent: "center", marginTop: 10}}>
                        <View style = {{flexDirection: "row", marginRight: 15}}>
                            <Text style = {{margin: 5}}> {  profileData.reviews.length === 0.0 ? 0 : reviewAverage}</Text>
                            <AirbnbRating
                                count={5}
                                defaultRating = {reviewAverage}
                                showRating = {false}
                                size={15}
                                isDisabled
                            />
                        </View>
                        
                        <View style = {{flexDirection: "row", marginLeft: 15}}>
                            <Text style = {{margin: 5}}>{(profileData.pais).trim() || ''} <Icon name = "map-marker" color = "#000000" size = {16}/></Text>
                        </View>
                    </View>

                    {/* <View style = {{margin: 15}}>
                        <Text style = {{textAlign: "center", color: "gray", fontStyle: "italic"}}>{user.resumen}</Text>
                    </View> */}
                </View>

                <ScrollView style = {styles.section}>

                    <Text style = {styles.sectionTitle}> Resumen</Text>
                    <View style = {{margin: 15, marginBottom: 30, marginLeft: 25}}>
                        <Text style = {{color: "gray"}}>{profileData.descripcion}</Text>
                    </View>

                    <Text style = {styles.sectionTitle}> Descripción</Text>
                    <View style = {{margin: 15, marginBottom: 30, marginLeft: 25}}>
                        <Text style = {{color: "gray"}}>{profileData.resumen}</Text>
                    </View>

                    <Text style = {styles.sectionTitle}> Intereses </Text>

                    <Interests categories = {profileData.categorias}/>

                    <Text style = {styles.sectionTitle}> Reviews </Text>

                    <View style = {{marginLeft: 20}}>
                        {
                            profileData.reviews.length === 0 ?
                                <Text style = {{  fontSize: 12, marginTop: 7, color: "gray"}}>Este usuario no tiene reviews aún</Text>
                            : 
                                <>
                                    <View style = {{flexDirection: "row", marginTop: 10, marginBottom: 0, marginTop: 5}}>
                                        <Text style = {{margin: 5,}}>{reviewAverage}</Text>
                                        <AirbnbRating
                                            defaultRating = {reviewAverage}
                                            count={5}
                                            showRating = {false}
                                            size={15}
                                            isDisabled
                                        />
                                    </View>
                                    <TouchableOpacity style = {{marginLeft: 7, marginBottom: 20}} onPress = {() => setShowReviewsModal(true)}>
                                        <Text style = {{ color: "#339afe", fontSize: 12}}>Ver {profileData.reviews.length} reviews</Text>
                                    </TouchableOpacity>
                                </>
                        }
                    </View>

                </ScrollView>

            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    header: {
        flexDirection:"row", 
        justifyContent: "space-between", 
        marginLeft: 15, 
        marginRight: 15, 
        marginTop: Platform.OS == "android" ? 15 : 30
    }, 
    contactarButton: {
        padding: 10, 
        borderRadius: 50, 
        backgroundColor: "#03b388", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        margin: 20, 
        marginBottom: 30

    }, 
    contact: {
        textAlign: "center", 
        color: "white",
    }, 
    section: {
        margin: 10,
        paddingTop: 20,
        height: "100%"
    }, 
    sectionTitle: {
        color: "black", 
        fontWeight: "500",
        marginLeft: 10,
        fontSize: 14, 
        fontStyle: "italic"

    }, 
    fixedInformation: {
        // shadowColor: "#000",
        // marginBottom: 10,
        // shadowOffset: {
        //     width: 0,
        //     height: 0.1,
        // },
        // shadowOpacity: 0.15,
        // shadowRadius: 2.84,
        // elevation: 0.7,
        // backgroundColor: "white"
    }

});

const mapStateToProps = (state) => {
    return {
        profileData: state.profileData,
    }
}

const mapDispatchToProps = dispatch => ({
    setProfileState: (object) => dispatch(setProfileState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ClientProfile);
