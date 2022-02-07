import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput, Modal } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
//Local imports
import ChannelsSection from './profileSections/channelsSection';
import CategoriesSection from './profileSections/categoriesSection';
import Reviews from './profileSections/reviews';
import InteractionRequest from './interactionRequest';
import LoaderModal from '../../../../utils/modalLoader';
import API from '../../../../apis/profile/profile';
import { setProfileState } from '../../../../redux/actions/profile/profileActions';
import consultor from "../../requests/consultor";
import VerifiedIcon from '../../../../assets/verified_icon.png';
import VideoFullScreen from '../../../interaction/conversations/modals/videoFullScreen';

function ConsultorProfile(props) {

        const insets = useSafeAreaInsets();

        const { profileData, interactionsData } = props;
        const [showAlert, setShowAlert] = useState(false);
        const [loadingModal, setLoadingModal] = useState(false);
        const [reviewAverage, setReviewAverage] = useState(0);
        const [showReviewsModal, setShowReviewsModal] = useState(false); 
        const [showInteractionRequestModal, setShowInteractionRequestModal] = useState(false); 
        const [showVideoModal, setShowVideoModal ] = useState(false);
        const [videoLoaded, setVideoLoaded] = useState(false);
        const idUsuario = props.route.params.usuarioID;

        useEffect(() => {
            getProfile()
        }, [])

        function calculateReviewAverage(reviews){
            const reviewsLength = reviews.length;
            let reviewSum = 0;

            reviews.map(review => {
                reviewSum += review.estrellas_consultor
            })

            setReviewAverage((reviewSum / reviewsLength).toFixed(1));
        }

        function formatQuestions(questions){
           return questions.map(question => {
                return { 
                    id_pregunta_formulario: question.id_pregunta_formulario,
                    respuesta: '',
                    question: question.pregunta
                }
            });
        }

        async function getProfile(){

            const { setProfileState } = props;
            //setLoadingModal(true);
            try {
                const profileResponse = await API.getConsultorPorfile(idUsuario);

                if (profileResponse.status == 200) {

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
                        notificationID: profileResponse.data.notificacion_id,
                        resumen: profileResponse.data.resumen,
                        rfc: profileResponse.data.rfc,
                        telefono: profileResponse.data.telefono,
                        videoPerfil: profileResponse.data.video_perfil, 
                        interaccionesPredeterminadas: profileResponse.data.interacciones_predeterminadas,
                        categorias: profileResponse.data.categorias, 
                        reviews: profileResponse.data.reviews, 
                        preguntas: formatQuestions(profileResponse.data.preguntas), 
                        verificado: profileResponse.data.estatus_verificacion, 
                        pais: profileResponse.data.pais
                    });

                    setLoadingModal(false);

                    calculateReviewAverage(profileResponse.data.reviews);
                    
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

        function sendRequestOrConversation(){

            setLoadingModal(true)

            let consultStatus = 0;
            let myConsultor;
            let inter;

            interactionsData.allConversation.map(interaction => {
               
                if(interaction.consultor.id_usuario === profileData.idUsuario){
                    consultStatus = interaction.estatus
                    myConsultor = profileData
                    inter = interaction
                } 

            });

            if(myConsultor !== undefined){
                if(myConsultor.idUsuario && consultStatus == 2){
                    console.log("si hay consultra");
                    setTimeout(() => {

                        setLoadingModal(false)
                        props.navigation.navigate("ConversationClient", {data: inter})
                    }, 2000);
                
                } else if (myConsultor.idUsuario && consultStatus == 1){
                    console.log("si hay reques");
                    setTimeout(() => {

                        setLoadingModal(false)

                        props.navigation.navigate("RequestClientDescription", {request: inter})
                    }, 2000);

                }
            } else {
                console.log("no hay requests ni consulta")
                setTimeout(() => {
                    setLoadingModal(false)
                    setShowInteractionRequestModal(true)

                }, 2000);
            }
        }

        function closeModal(){
            setShowInteractionRequestModal(false)
            setShowVideoModal(false)
            setShowAlert(true)
        }

        return(
            <View style = {[styles.container, {paddingTop: insets.top - 20, paddingBottom: insets.bottom}]}>
                <LoaderModal visibleModal={loadingModal} text={'Cargando...'} />

                <Modal 
                    animationType = "slide"
                    visible = {showReviewsModal} 
                >
                    <Reviews closeModal = {() => setShowReviewsModal(false)} reviews = {profileData.reviews}/>
                </Modal>

                <Modal 
                    visible = {showInteractionRequestModal}
                    animationType = "slide" 
                >   
                    <InteractionRequest 
                        closeModal = {() => closeModal()} 
                        data = {profileData} 
                        dismiss = {() => setShowInteractionRequestModal(false)}
                    />
                </Modal>

                <VideoFullScreen 
                    visibleModal = {showVideoModal} 
                    mediaReference = {profileData.videoPerfil} 
                    closeModal = {() => setShowVideoModal(false)}
                />

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Listo :)"
                    message= "Tu solicitud ha sido enviada."
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Continuar"
                    confirmButtonColor= "#03b388"
                    onConfirmPressed={() => {
                        props.navigation.navigate("Index")
                    }}
                />

                <View style = {styles.fixedInformation}>
                    <View style = {styles.header}>

                        <TouchableOpacity onPress = {() => props.navigation.goBack()}>
                            <Icon name = "arrow-left" color = "#000000" size = {20}/>
                        </TouchableOpacity>

                        {
                            props.route.params ? 
                                <TouchableOpacity>
                                    
                                </TouchableOpacity>
                            : 
                                <TouchableOpacity>
                                    <Icon name = "ellipsis-v" color = "#000000" size = {20}/>
                                </TouchableOpacity>
                        }

                    </View>

                    <View>
            
                        <FastImage
                            style = {{alignSelf: "center", width: 100, height: 100, margin: 20, marginTop: 0, borderRadius: 50}}
                            source = {{
                                uri: profileData.fotoPerfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("lodaded")
                            }}
                        />
                        <View style = {{flexDirection: "row", justifyContent: "center", marginBottom: 10}}>
                            <Text style = {{textAlign: "center", fontSize: 17, fontWeight: "600"}}>{profileData.nombre} {profileData.apellidoPaterno}</Text>
                            {
                                profileData.verificado === 2 ?
                                    <Image source = {VerifiedIcon} style = {{width: 30, height: 30, marginLeft: 10, marginTop: -6}}/>
                                : null
                            }
                            
                        </View>
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
                    
                    {
                        props.route.params.routeName ? 
                            <View style = {{padding: 25, flexDirection: "row", justifyContent:"center"}}>
                                <Icon name = "hourglass-start" color = "#03b388" size = {15}/>
                                <Text style = {{textAlign: "center", marginLeft: 10, color: "gray", fontStyle: "italic", fontWeight:"300"}}> En Espera de aceptacion</Text>
                            </View>

                        :
                            <TouchableOpacity style = {styles.contactarButton} onPress = {() => sendRequestOrConversation()}>
                                <Text style = {styles.contact}>Contactar</Text>
                            </TouchableOpacity>
                    }

                </View>

                <ScrollView style = {styles.section}>

                    <Text style = {styles.sectionTitle}> Descripción</Text>

                    <View style = {{margin: 15, marginBottom: 30, marginLeft: 25}}>
                        <Text style = {{color: "gray"}}>{profileData.descripcion}</Text>
                        {
                            profileData.videoPerfil || profileData.videoPerfil !== null ?
                                <TouchableOpacity style = {{ marginTop: 7}} onPress = {() => setShowVideoModal(true)}>
                                    <Text style = {{ color: "#339afe", fontSize: 13, fontStyle: "italic" }}>Ver video</Text>
                                </TouchableOpacity>
                            : 
                                <Text style = {{ color: "black", fontSize: 13, fontStyle: "italic", marginTop: 10 }}>Usuario no tiene video de presentación</Text>
                        }   

                    </View>

                    <Text style = {styles.sectionTitle}> Trayectoria</Text>
                    <View style = {{margin: 15, marginBottom: 30, marginLeft: 25}}>
                        <Text style = {{color: "gray"}}>{profileData.resumen}</Text>

                    </View>
                    
                    <Text style = {styles.sectionTitle}> Canales</Text>
                    <View style = {{marginLeft: 20}}>
                        <ChannelsSection channels = {profileData.interaccionesPredeterminadas}/>
                    </View>

                    <Text style = {styles.sectionTitle}> Categorías </Text>
                    
                    <CategoriesSection categories = {profileData.categorias}/>

                    <Text style = {styles.sectionTitle}> Reviews</Text>
                    
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
        shadowColor: "#000",
        marginBottom: 10,
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        // shadowOpacity: 0.15,
        // shadowRadius: 2.84,
        // elevation: 0.7,
        // backgroundColor: "white"
    }

});

const mapStateToProps = (state) => {
    return {
        interactionsData: state.interactionsData,
        profileData: state.profileData
    }
}

const mapDispatchToProps = dispatch => ({
    setProfileState: (object) => dispatch(setProfileState(object)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ConsultorProfile);
