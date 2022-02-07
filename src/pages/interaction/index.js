import React, { useState, useEffect } from "react";
import { Image, View, Text, FlatList, StyleSheet, StatusBar, TextInput, Modal, TouchableOpacity, BackHandler} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialTabs from 'react-native-material-tabs';
import * as firebase from 'firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import FastImage from 'react-native-fast-image';
//local imports
import API from '../../apis/interaction/interaction';
import NOTIF_API from '../../apis/notifications/notifications';
import API_SEARCH from'../../apis/search/search';
import ConsultorRequest from './requests/consultor/index';
import ClientRequest from './requests/client/index';
import ConversationsConsultor from './conversations/consultor/index';
import ConversationsClient from './conversations/client/index';
import setInteractionsData from '../../redux/actions/interactions/interactionsActions';
import setListData  from '../../redux/actions/search/search';
import changeBalanceState from '../../redux/actions/admin/balanceActions';
import badSearch from '../../assets/badsearch.png';
import NoInternetModal from '../../utils/noInternetModal';
import VerifiedIcon from '../../assets/verified_icon.png';
import changeAdminState from "../../redux/actions/admin/adminActions";
import IncomingCallModal from '../interaction/conversations/modals/incomingCall';

function Interactions(props) {

        const insets = useSafeAreaInsets();
        const { searchListData, setListData, setInteractionsData, interactionsData, balanceData, adminData, changeBalanceState, changeAdminState } = props;
        const [inputText, setInputText] = useState("");
        const [selectedTab, setSelectedTab] = useState(0);
        const [showSearchModal, setSearchModal] = useState(false);
        const [loading, setLoading] = useState(true);
        const [watingInteractions, setWatingInteractions] = useState([]);
        const [userHasInternet, setUserHasInternet]= useState(false);
        const [acceptedInteractions, setAcceptedWatingInteractions] = useState([]);
        const [searchConversation, setSearchConversation] = useState('');
        const [filteredConversation, setFilteredConversation] = useState([])
        const [showIncommingCallModal, setShowIncommingCallModal] = useState(true);
        const [toggle, setToggle] = useState(false);
 
        useEffect(() => {
            const unsubscribe = props.navigation.addListener('focus', () => {
                getInteractions();
           });

            if(Platform.OS== "android"){
                StatusBar.setBarStyle( 'dark-content', true)
                StatusBar.setBackgroundColor("white")
            }  

           return unsubscribe;
        }, [props.navigation]);

        useEffect(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)

            const interval = setInterval(() => {
                const unsubscribeInternet = NetInfo.addEventListener(state => {
                    if(!state.isConnected){
                        setUserHasInternet(true);
                    } else {
                        setUserHasInternet(false);
                    }
                }, []);
                unsubscribeInternet();
            }, 5000);
            
            return () => {
                clearInterval(interval)
                backHandler.remove()
            }
        }, [])

         async function getInteractions(){

            setSearchConversation('');
            const user = await AsyncStorage.getItem("USER");
            const step = await AsyncStorage.getItem("STEP_NUMBER");

            const ID = props.adminData.idUsuario;
            setLoading(true);
            setAcceptedWatingInteractions([])
            setWatingInteractions([])

            try {
                const consultorInteractionResponse =  props.adminData.iDtipoUsuario == 3 ? await API.getInteractionConsultor(ID) : await API.getInteractionClient(ID);

                console.log("consulta =>", consultorInteractionResponse);
                
                if(consultorInteractionResponse.status == 200){
                    setInteractionsData({allConversation: consultorInteractionResponse.data.consultas});

                    if(consultorInteractionResponse.data.saldo){
                        changeBalanceState({balance: Number(consultorInteractionResponse.data.saldo).toFixed(2)})
                    } else {
                        changeBalanceState({balance: 0.00})
                    }

                    changeAdminState({verified: consultorInteractionResponse.data.estatus_verificacion})

                    separateConversations(consultorInteractionResponse.data.consultas)

                } else {
                     console.log("error");
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

        async function search(text){
            try {
                const searchConsultorResponse =  await API_SEARCH.findConsultor(text);
                
                if(searchConsultorResponse.status == 200){

                    setListData({data: searchConsultorResponse.data || []});
                    setInputText(text);
                } else {
                     console.log("error");
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

        function separateConversations(data){

            setInteractionsData({accepted: [], wating: []});
            let wating = [];
            let accepted = [];

            data.map(interaction => {
                if(interaction.estatus == 1){
                    wating.push(interaction);

                    setInteractionsData({wating: wating});
                    // setWatingInteractions(wating);

                } else if(adminData.iDtipoUsuario === 3){
                    if(interaction.estatus === 2 || interaction.estatus === 3 || interaction.estatus === 6){
                        accepted.push(interaction);
                        
                        setInteractionsData({accepted: accepted});
                        // setAcceptedWatingInteractions(accepted);
                    }
                } else {
                    if(interaction.estatus === 2 || interaction.estatus === 3 || interaction.estatus === 4){
                        accepted.push(interaction);
                        setInteractionsData({accepted: accepted});
                        // setAcceptedWatingInteractions(accepted);
                    }
                }
            });

            setLoading(false);
        }

        function userType() {
            if(!loading || interactionsData.allConversation.length > 0){
                 
                if(props.adminData.iDtipoUsuario == 3){

                    if(selectedTab == 0){
                        return <ConversationsConsultor {...props} list = {interactionsData.accepted}/> 
                    } else {
                        return <ConsultorRequest {...props} list = {interactionsData.wating} />
                    }
                } else {
                    
                    if(selectedTab == 0){
                        return <ConversationsClient {...props} list = {interactionsData.accepted}/> 
                    } else {
                        return <ClientRequest {...props} list = {interactionsData.wating}/>
                    }
                }
            } else return null
        }

        function navigateToConsultor(consultor){
            setListData({data: []})
            setInputText("")
            setSearchModal(false);
            
            props.navigation.navigate("ConsultorProfile", { usuarioID: consultor.id_usuario})
        }

        function closeModal(){
            setSearchModal(false)
            setListData({data: []})
            setInputText("")
        }

        function filterConversations(text){
            // const filtered = interactionsData.accepted.filter(conversation => ((conversation.cliente.nombre).toLowerCase()).includes((text).toLowerCase()));

            // // setFilteredConversation(filtered);
            // // console.log(text, filteredConversation);
            // setSearchConversation(text)
            console.log(text)
        }

        const renderItem = ({ item, index }) => (
            <TouchableOpacity style = {{flexDirection: "row", margin: 10}} onPress = {() => navigateToConsultor(item)}>
                <FastImage
                    style = {{width:45, height: 45, marginRight: 10, marginBottom: 5, borderRadius: 50}}
                    source = {{
                        uri: item.foto_perfil,
                        headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal
                    }} 
                />

                <View style = {{flexDirection: "row"}}>
                    <Text style = {{fontSize: 16, fontWeight: "300", marginTop: 12, marginRight: 5}}>{item.nombre} {item.apellido_paterno}</Text>
                    {
                        item.estatus_verificacion === 2 ?
                            <Image source = {VerifiedIcon} style = {{height: 20, width: 20, marginLeft: 6, marginTop: 12}}/>
                        : null
                    }
                </View>
            </TouchableOpacity>
        );  

        return(
            <View style = {[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
                <NoInternetModal visibleModal = {userHasInternet} />
                <IncomingCallModal visibleModal = {false}/>
                
                <Modal 
                    transparent={false}
                    animationType="slide"
                    visible={showSearchModal}
                    onRequestClose={() => {
                    //  alert('Modal has been closed.');
                    }}
                >
                    <View 
                        style= {{
                            flex: 1,
                            paddingTop: insets.top,
                            paddingRight: 10,
                            paddingLeft:10,
                            paddingBottom: insets.bottom
                        }}
                    >
                        <TouchableOpacity style = {{margin: 5}} onPress = {() => closeModal()}>
                            <Text style = {{fontSize: 15}}>X</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={{
                                height: 40,  width: "100%", borderColor: 'gray', borderWidth: 0, marginTop: 10, 
                                marginBottom: 5,  color: "black", borderRadius: 5, padding: 9, backgroundColor: "#f5f5f5", 
                                marginTop: 15
                            }}
                            placeholder = "Busca por nombre o pega el id de usuario"
                            placeholderTextColor = "gray"
                            autoCapitalize = 'none'
                            onChangeText ={text => search(text)}
                            // value = {this.state.comments}
                            returnKeyType={ 'done' }
                        />

                        {      
                            searchListData.data.length == 0 && inputText.length > 0 ? 
                                <View style = {{marginTop: "50%"}}>
                                    <Image source = {badSearch} style = {{width: 180, heigth: 180, alignSelf:"center"}}/>
                                    <Text style = {{textAlign: "center", fontSize: 18, marginTop: 15}}>No hay resultados</Text>
                                </View>       
                            :
                                <FlatList 
                                    // data = {searchConversation.length > 0 ? "" : searchListData.data}
                                    data = {searchListData.data}
                                    keyExtractor = {item => item.name}
                                    renderItem = {renderItem} 
                                    style = {{margin: 20, marginLeft: 2, paddingTop: 20, marginTop:0}}
                                />
                               
                        }
                    </View>
                </Modal>

                 <View style = {styles.interactionHeader}>
                    <Text style = {styles.title}>Balance: $ {Number(balanceData.balance).toFixed(2)} </Text>

                    <View style ={styles.toolIcons}>
                        <TouchableOpacity style= {{marginLeft: 8, maringTop:  Platform.OS == "ios" ? 9 : 15}} 
                            onPress = {
                                props.adminData.iDtipoUsuario == 3? 
                                    () => props.navigation.navigate("ConsultorBalance")
                                : 
                                () => props.navigation.navigate("ClientBalance")
                            }
                        > 
                            <Icon name="credit-card" size={20} color="#03B388"/>
                        </TouchableOpacity>
                    </View>
                 </View>

                 <TextInput
                    style={{height: 40,  width: "100%", borderColor: 'gray', borderWidth: 0, marginTop: 20, marginBottom: 5,  color: "black", borderRadius: 5, padding: 9, backgroundColor: "#f5f5f5"}}
                    placeholder = "Buscar contacto..."
                    placeholderTextColor = "gray"
                    autoCapitalize = 'none'
                    onChangeText ={text => filterConversations(text)}
                    value = {searchConversation}
                    returnKeyType={ 'done' }
                />

                <View style = {{marginTop: 3, marginBottom: 10}}>
                    <MaterialTabs
                        items={['Conversaciones', 'Solicitudes']}
                        selectedIndex={selectedTab}
                        onChange={setSelectedTab}
                        barColor="white"
                        style = {{marginBottom: 15}}
                        indicatorColor="#03b388"
                        activeTextColor="#03b388"
                        inactiveTextColor = "gray"
                        uppercase = {false} 
                        textStyle= {
                            {
                                fontSize: 14
                            }
                        }
                    />  
                </View>

                {
                    userType()
                }

                <TouchableOpacity style = {styles.newInteraction} onPress = {() => setSearchModal(true)}>
                    <Text style = {{textAlign: "center", color: "white", fontSize: 20}}>+</Text>
                </TouchableOpacity> 
            
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? 19 : 10,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: "white"
    },
    backgroundVideo: {
        width:100, 
        height:100
    },
    interactionHeader: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 10
    },
    title: {
        marginLeft: 10, 
        fontSize: 19,
        marginTop: 6, 
        fontWeight: "700"
    }, 
    newInteraction: {
        position: "absolute", 
        padding: 15,
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
    chatList: {
        padding: 15, 
        borderBottomColor: "#f5f5f5", 
        borderBottomWidth: 0.5, 
        borderTopColor: "#f5f5f5", 
        borderTopWidth: 0.5, 
        flexDirection: "row", 
        justifyContent: "space-between", 
    }, 
    toolIcons: {
        flexDirection: "row", 
        marginRight: 10, 
        marginTop: 5
    }, 
    imageStyle: {
        height: 40, 
        width: 40, 
        marginRight: 19,
    }, 
    searchModalButton: {
        backgroundColor: "#03b388",
        padding: 10,
        position: "absolute", left: 5, right: 5, bottom: 5, borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    emptyImageStyle: {
        height: 250, 
        width: 250,
        marginBottom: 15
    }, 
});

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData,
        interactionsData: state.interactionsData,
        searchListData: state.searchListData, 
        balanceData: state.balanceData
    }   
}

const mapDispatchToProps = dispatch => ({
    setListData: (object) => dispatch(setListData(object)),
    setInteractionsData: (object) => dispatch(setInteractionsData(object)),
    changeBalanceState: (object) => dispatch(changeBalanceState(object)),
    changeAdminState: (object) => dispatch(changeAdminState(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Interactions);
