import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, Image, View, Text, Alert, FlatList, SectionList, StyleSheet, StatusBar, TouchableOpacity, TextInput, ScrollView, Platform, Dimensions} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
import FastImage from 'react-native-fast-image';
import * as firebase from 'firebase';
import KeyboardListener from 'react-native-keyboard-listener';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import AwesomeAlert from 'react-native-awesome-alerts';
import Video from 'react-native-video';
import moment from "moment";
import Modal from 'react-native-modal';
import NetInfo from "@react-native-community/netinfo";
import { Rating, AirbnbRating } from 'react-native-ratings';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {useStripe} from '@stripe/stripe-react-native';
import DialogInput from 'react-native-dialog-input';
import RNFetchBlob from 'rn-fetch-blob'
//local imports
import ImageModal from '../modals/imageModal';
import ConfirmMediaModal from '../modals/confirmMediaModal';
import DefaultUser from '../../../../assets/default_user.png';
import LoaderModal from '../../../../utils/modalLoader';
import Lock from '../../../../assets/lock.png';
import Videocall from '../../../../assets/videocall.png';
import RecordingIcon from '../../../../assets/recording-icon.gif';
import Call from '../../../../assets/call.png';
import setConversationConfig from '../../../../redux/actions/interactions/conversationConfigActions';
import changeBlanceState from '../../../../redux/actions/admin/balanceActions';
import API_NOTIF from '../../../../apis/notifications/notifications';
import API from '../../../../apis/conversation/conversation';
import API_INTERACTIONS from '../../../../apis/interaction/interaction';
import setMessagesList from '../../../../redux/actions/interactions/messagesActions';
import NoInternetModal from '../../../../utils/noInternetModal';
import VideoCall from './videoCall';
import VoiceCall from './voiceCall';
import API_URL from '../../../../apis/url';

const audioRecorderPlayer = new AudioRecorderPlayer();

function ClientChat(props) {
        const { data } = props.route.params;
        const { conversationConfigData, setConversationConfig, changeBlanceState, balanceData, adminData, setMessagesList, messagesData, dictionary } = props;
        const {initPaymentSheet, presentPaymentSheet} = useStripe();
        const [loading, setLoading] = useState(false);
        const [clientSecret, setClientSecret] = useState(''); 
        const [amountPayment, setAmountPayment] = useState(0);
        const [showAmountInput, setShowAmountInput] = useState(false);
        const [noMoneyModal, setNoMoneyModal] = useState(false);
        const [messageInput, setMessageInput] = useState("");
        const [loadingModal, setLoadingModal] = useState(false);
        const [updateConsultaModal, setUpdateConsultaModal] = useState(false);
        const [updateConsultaMessage, setUpdateConsultaMessage] = useState('');
        const [showBlockedAlert, setShowBlockedAlert] = useState(false);
        const [blockedUserTitle, setBlockedUserTitle] = useState("");
        const [blockedUserMessage, setBlockedUserMessage] = useState("");
        const [ imageSelected, setImageSelected ] = useState("");
        const [ mediaSelected, setMediaSelected ] = useState("");
        const [ showImageModal, setShowImageModal ] = useState(false);
        const [ showConfirmMedia, setShowConfirmMedia ] = useState(false);
        const [ showModalVideoOrImage, setShowModalVideoOrImage ] = useState(false);
        const [ mediaTypeConfirm, setShowMediaTypeConfirm ] = useState("");
        const [imageLoadingModal, setImageLoadingModal] = useState(false);
        const [keyboardOpened, setKeyboardOpened] = useState(false);
        const [disabledChannelTitle, setDisabledChannelTitle] = useState("");
        const [disabledChannelMessage, setDisabledChannelMessage] = useState("");
        const [showDisbaledAlert, setShowDisabledAlert] = useState(false);
        const [showDeleteConversationModal, setShowDeleteConversationModal] = useState(false);
        const [filePath, setFilePath] = useState("");
        const [balanceSidebarOpen, setBalanceSidebarOpen] = useState(false);
        const [showSemiModal, setShowSemiModal] = useState(false);
        const [newMessages, setNewMessages] = useState([{title: "", data:[] }]);
        const [conversationStatus, setConversationStatus] = useState(data.estatus);
        const [conversationExpenses, setConversationExpenses] = useState(0);
        const [showReviewsModal, setShowReviewModal] = useState(false);
        const [userHasInternet, setUserHasInternet]= useState(false);
        const [loadingReviewModal, setLoadingReviewModal] = useState(false);
        const [reviewStars, setReviewStars] = useState(data.consultor.estrellas);
        const [reviewComment, setReviewComment] = useState(data.consultor.comentario);
        const [vnStatus, setVnStatus] = useState(0);
        const [voiceNote, setVoiceNote] = useState({ mediaReference: '', isPlaying: false, currentTime: 0 });
        const [recordingStatus, setRecordingStatus] = useState(0)
        const [recordingModal, setRecordingModal] = useState(false);
        const [recordSecond, setRecordSeconds] = useState(0);
        const [recordTime, setRecordTime] = useState(0);
        const [recordDuration, setRecordDuration] = useState("00:00:00");
        const [recordCurrentTime, setRecordCurrentTime] = useState("00:00:00");
        const messagesRef = useRef(null);
        const [numberOfMessages, setNumberOfMessages] = useState(0);
        const [scrollSectionList, setScrollSectionList] = useState(false);
        const [userIsAtBottom, setUserIsAtBottom] = useState(false);
        const [imageLoaded, setImageLoaded] = useState(false);
        const [videoLoaded, setVideoLoaded] = useState(false);
        const [sendButtonBloacked, setSendButtonBlocked] = useState(false);
        const [showVideoFullScreen, setShowVideoFullScreen] = useState(false);
        const [videoSelected, setVideoSelected] = useState('');
        const db = firebase.firestore();
        const insets = useSafeAreaInsets();
        const [showVideoCall, setShowVideoCall] = useState(false);
        const [showVoiceCall, setShowVoiceCall] = useState(false);
        const [refreshDetected, setRefreshDetected] = useState(false);
        const [bottomReached, setBottomReached] = useState(false);
        const [messagesLimitCount, setMessageLimitCount] = useState(20);
        const [sectionListRefreshing, setSectionListRefreshing] = useState(false);
        const SECONDS = 5000;
        let currentValue = false;
        let limitMsgCount = 20;
        const limitNumber = useRef(20);

        let database = db.collection('interactions').where('conversationId', '==', data.id_consulta).orderBy('dateTime', 'desc').limit(limitNumber.current);
        console.log("bottom reached", bottomReached);
        console.log("message limit", limitNumber.current)

        useEffect(() => {
            setScrollSectionList(true);

		    const unsubscribe = database.onSnapshot(onCollectionUpdate); 
            getConversationConfig();

            const interval = setInterval(() => {
                getConversationConfig();
            }, SECONDS);
            
            return () => clearInterval(interval);
        }, []);

        useEffect(() =>{
            if(scrollSectionList || bottomReached){
                console.log("se llamo el scroll to bottom", currentValue)
                setTimeout(() => {
                    scrollChatToBottom();
                }, 1000);
            }
        }, [numberOfMessages]);

        // useEffect(() => {

        //     const unsubscribeInternet = NetInfo.addEventListener(state => {
        //         if(!state.isConnected){
        //             setUserHasInternet(true);
        //         } else {
        //             setUserHasInternet(false);
        //         }
        //     });
        
        //     unsubscribeInternet();
        // })

        //*STRIPE---------------STRIPE
        async function fetchPaymentSheetParams (input){
            const response = await fetch(`${API_URL}payment-sheet`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_usuario: adminData.idUsuario, 
                saldo: Number(input)
              })
            });
            const {paymentIntent, ephemeralKey, customer} = await response.json();
        
            return {
              paymentIntent,
              ephemeralKey,
              customer,
            };
        };
        
        async function initializePaymentSheet(input){
            setShowAmountInput(false);
            const {paymentIntent, ephemeralKey, customer} =
              await fetchPaymentSheetParams(input);
        
            const {error} = await initPaymentSheet({
              customerId: customer,
              customerEphemeralKeySecret: ephemeralKey,
              paymentIntentClientSecret: paymentIntent,
              merchantDisplayName: 'Aldel.io',
              merchantCountryCode: 'MX',
            });
            if (!error) {
              setClientSecret(paymentIntent);
              setLoading(true);
              openPaymentSheet();

            } else {
              console.log(error);
            }
        };
        
        const openPaymentSheet = async () => {
            
            const {error} = await presentPaymentSheet({clientSecret});

            if (error) {
                if(error.message!== "The payment has been canceled"){
                    Alert.alert(`Error code: ${error.code}`, error.message);
                }
            } else {
              Alert.alert('Listo', 'Pago exitoso!');
            }
        };

    //STRIPE---------------STRIPE*

        function scrollChatToBottom(){
            return messagesRef.current.scrollToLocation({
                animated: true,
                itemIndex: numberOfMessages
            })  
        }

        async function getConversationConfig(){
            try {
                const getConversationConfigResponse = await API.getConversationConfig(data.consultor.id_usuario, data.cliente.id_usuario, data.id_consulta);

                if(getConversationConfigResponse.status == 200){
                    setConversationConfig({data: getConversationConfigResponse.data.precios});
                    changeBlanceState({balance: getConversationConfigResponse.data.saldo});
                    setConversationStatus(getConversationConfigResponse.data.consulta.estatus);
                    setConversationExpenses(getConversationConfigResponse.data.consulta.transacciones);

                    cleanMessageClient();
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

        async function saveLastMessage(message, messageType, idFirebase){

            try {
                const saveLastMessageResponse = await API_INTERACTIONS.setNewLastMessage(data.id_consulta, adminData.iDtipoUsuario, message, messageType, 1, idFirebase);

                if(saveLastMessageResponse.status == 200){
                    console.log("new message saved");
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

        async function cleanMessageClient(){
            try {
                const saveLastMessageResponse = await API_INTERACTIONS.cleanUnreadedMessagesClient(data.id_consulta, 'reiniciar');

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

        async function updateConsulta(status){
            setShowSemiModal(false);
            setLoadingReviewModal(true)

            let statusNumber;

            if(status === "delete"){
                conversationStatus === 4 ? statusNumber = 5 : statusNumber = 6;
            } else if(status === "review"){
                statusNumber = conversationStatus
            }
            
            try {
                const updateConsulta = await API_INTERACTIONS.acceptDeclineInteraction(data, statusNumber, reviewStars, reviewComment);

                if(updateConsulta.status == 200){
                    setConversationStatus(statusNumber);
                    if(status === "review"){
                        setLoadingReviewModal(1);
                    } else {
                        props.navigation.navigate("Index")
                    }
        
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

        async function createTransaction(item){

            const channelsIds = {'Phonecall': 2, 'Videocall': 1, 'text': 3, 'VoiceNote': 4, 'image': 5, 'Video': 6};
            let description = item.type ==  "text" ? item.message : item.type;

            try {
                const createTransactionResponse = await API.createTransaction(data, item.price, description, data.cliente.id_usuario, channelsIds[item.type], item.messageId);
                
                if(createTransactionResponse.status == 200){
                    updateMessage(item);
                    setLoadingModal(false);

                } else if (createTransactionResponse.status == 201) {
                    setLoadingModal(false);
                    setNoMoneyModal(true);
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
        // const requestCameraPermission = async () => {
        //     if (Platform.OS === 'android') {
        //       try {
        //         const granted = await PermissionsAndroid.request(
        //           PermissionsAndroid.PERMISSIONS.CAMERA,
        //           {
        //             title: 'Camera Permission',
        //             message: 'App needs camera permission',
        //           },
        //         );
        //         // If CAMERA Permission is granted
        //         return granted === PermissionsAndroid.RESULTS.GRANTED;
        //       } catch (err) {
        //         console.warn(err);
        //         return false;
        //       }
        //     } else return true;
        //   };
        
        //   const requestExternalWritePermission = async () => {
        //     if (Platform.OS === 'android') {
        //       try {
        //         const granted = await PermissionsAndroid.request(
        //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //           {
        //             title: 'External Storage Write Permission',
        //             message: 'App needs write permission',
        //           },
        //         );
        //         // If WRITE_EXTERNAL_STORAGE Permission is granted
        //         return granted === PermissionsAndroid.RESULTS.GRANTED;
        //       } catch (err) {
        //         console.warn(err);
        //         alert('Write permission err', err);
        //       }
        //       return false;
        //     } else return true;
        // };

        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;

            for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        }

        function chooseImageShow(image){
            setShowImageModal(true)
            setImageSelected(image);
        }

        const chooseFile = (type) => {
            let options = {
              mediaType: type,
            };

            launchImageLibrary(options, (response) => {

                if(response.assets){
                    if(response.assets[0].fileName || response.assets[0].uri){
                        console.log("selected media type", response.assets[0].type)
                        if(response.assets[0].type === "image/jpg" || response.assets[0].type === "image/png" || response.assets[0].type === "image/jpeg"){
                            setShowMediaTypeConfirm("Image")
                        } else {
                            setShowMediaTypeConfirm("Video")
                        }

                        setShowConfirmMedia(true);
                        setMediaSelected({uri: response.assets[0].uri, fileName: response.assets[0].fileName});           
                    }
        
                    setFilePath(response);
                }
            });
        };

        async function saveInStorage(){
            const mediaName = mediaTypeConfirm === 'Video' ? mediaSelected.uri : mediaSelected.fileName;

            setShowConfirmMedia(false);
            const reference = storage().ref(mediaName);
            setImageLoadingModal(true);

            try {
                await reference.putFile(mediaSelected.uri).then(response =>{                    
                    if(response.state == "success"){
                        sendMultimediaToFirestore(mediaName)
                    }
                });
            } catch (error) {
                console.log("este es el error", error);
            }
        }

        async function sendMultimediaToFirestore(refName){
            const url = await storage().ref(refName).getDownloadURL();

            const id =  makeid(20);

            const messageType = mediaTypeConfirm === "Image" ? "image" : mediaTypeConfirm === "VoiceNote" ? "VoiceNote" : "Video";

            await db.collection('interactions').doc(id).set({
                messageId: id,
                conversationId: data.id_consulta,
                mediaReference: url,
                message: messageInput, 
                dateTime: new Date(),
                price: 0,
                hidden: false, 
                sender: "client",
                type: messageType,
                client: data.cliente.nombre + " " + data.cliente.apellido_paterno,
                consultor: data.consultor.nombre + " " + data.consultor.apellido_paterno, 
                duration: (recordSecond / 1000),

            }).then((docRef) => {
                setImageLoadingModal(false);
                sendNotification();
                scrollChatToBottom();
                saveLastMessage("", messageType, id)
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }   

        async function sendMessageToFirestore(){

            setSendButtonBlocked(true);

            const id =  makeid(20);

            await db.collection('interactions').doc(id).set({
                messageId: id,
                conversationId: data.id_consulta,
                message: messageInput, 
                dateTime: new Date(),
                sender: "client",
                hidden: false, 
                price: messageInput.length,
                type: "text",
                client: data.cliente.nombre + " " + data.cliente.apellido_paterno,
                consultor: data.consultor.nombre + " " + data.consultor.apellido_paterno, 
            }).then(() => {
                setMessageInput("")
                // sendNotification();
                scrollChatToBottom();
                saveLastMessage(messageInput, 'text', id);
                setSendButtonBlocked(false);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        } 

        async function sendNotification(){

            const header = 'Nuevo Mensaje';
            const message = data.cliente.nombre + ' ' + data.cliente.apellido_paterno + ' te ha enviado un mensaje';

            const notificationResponse = await API_NOTIF.sendNotification([data.consultor.notificacion_id], header, message);
            
            console.log("response notification ", header, message, notificationResponse);
        }

        async function sendCallToFirestore(duration, price, type){
            const id =  makeid(20);

            await db.collection('interactions').doc(id).set({
                messageId: id,
                conversationId: data.id_consulta,
                dateTime: new Date(),
                endTime: new Date(),
                sender: "client",
                duration: duration,
                price: price,
                type: type,
                client: data.cliente.nombre + " " + data.cliente.apellido_paterno,
                consultor: data.consultor.nombre + " " + data.consultor.apellido_paterno
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        } 


        function onCollectionUpdate(querySnapshot){
            
            const messages = [];

            querySnapshot.forEach((doc) => {
                console.log("entro al oncollection update", limitNumber.current)
                let date = doc.data().dateTime.toDate();
                let hour = moment(date).format('LT');
                let day = moment(date).format('ll');

                const { client, consultor, conversationId, dateTime, hidden, message, price, sender, type, messageId, mediaReference, duration } = doc.data();

                messages.push({
                    key: messageId, messageId, client, consultor, conversationId, dateTime, hidden, message, price, sender, type, mediaReference, hour, day, duration
                });
            });

            const sortedMessages = messages.sort((a, b) => (a.dateTime > b.dateTime) ? 1 : -1);

            setNumberOfMessages(sortedMessages.length);
            
            structureMessages(groupMessages(sortedMessages, "day"))
        }

        const groupMessages = (items, key) => items.reduce(
            (result, item) => ({
              ...result,
              [item[key]]: [
                ...(result[item[key]] || []),
                item,
              ],
            }), 
            {},
        );

        function structureMessages(messagesObjects){
            const msgArray = [];
            for (let [key, value] of Object.entries(messagesObjects)) {
              msgArray.push({"title": key, "data": value})
            }

            setMessagesList({msg: msgArray});
            setNumberOfMessages(prevState => prevState += msgArray.length);
            setScrollSectionList(false);
        }

        async function updateMessage(item){
            const interactionRef = db.collection('interactions').doc(item.messageId);
            const res = await interactionRef.update({hidden: false});
        }

        function unlockMessage(item){
            console.log("entro")
            setLoadingModal(true);

            setTimeout(() => {
                createTransaction(item);
            }, 2000)
        }

        function handleDisabledAlert(title, message){
            setShowDisabledAlert(true);
            setDisabledChannelTitle(title);
            setDisabledChannelMessage(message);
        }

        function handleBlockedUserAlert(title, message){
            setShowBlockedAlert(true);
            setBlockedUserTitle(title);
            setBlockedUserMessage(message);
        }

        async function onStartRecord (){

            const dirs = RNFetchBlob.fs.dirs;
            const id =  makeid(10);
            const path = Platform.select({
                ios: `${id}.mp4`,
                android: `${dirs.CacheDir}/${id}.mp4`,
            });

            setRecordingStatus(1);

            const uri = await audioRecorderPlayer.startRecorder(path);
            audioRecorderPlayer.addRecordBackListener((e) => {
                setRecordSeconds(e.currentPosition);
                setRecordDuration(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
                return;
            });

            setMediaSelected({uri: uri, fileName: uri, duration: recordSecond});

        };

        async function onStopRecord () {
            setRecordingStatus(2);

            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setMediaSelected({uri: result, fileName: result, duration: recordSecond});
            setShowMediaTypeConfirm('VoiceNote');
        };

        async function onStartPlay (){
            try {
                const msg = await audioRecorderPlayer.startPlayer(mediaSelected.uri);
                audioRecorderPlayer.addPlayBackListener((e) => {
                    setRecordDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)))
                    setRecordCurrentTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
    
                    return;
                })
                setRecordingStatus(2);
            } catch (error){
                console.log("ERROR AUDIO!", error)
            }
        };

        function cleanRecording(){
            setRecordingStatus(0)
            setRecordDuration(0)
            setRecordCurrentTime(0)
        }

        function fancyTimeFormat(duration){   
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        }

        const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
            const paddingToBottom = 100;
            
            return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
        };

        // const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
        //     const paddingToTop = 80;
        //     return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
        // }

        function renderMessageType(item){
            switch(item.type) {
                case "text":
                    return  (  
                        item.hidden ?
                            <View style = {styles.otherUserMessage}>
                                <TouchableOpacity style = {{flexDirection: "row"}} onPress = {() => unlockMessage(item)}>
                                    <Image source = {Lock} style = {styles.lockImage}/>
                                    <Text style = {{textAlign: "center", color: "#03b388", textDecorationLine: "underline", marginTop: 6}}>Desbloquear mensaje por {Number(item.price).toFixed(2)} $</Text>
                                </TouchableOpacity>
                            </View>
                        :
                            <View>
                                <View style = {item.sender == "client" ? styles.myMessage : styles.otherUserMessage}>
                                    <Text 
                                        style = {{color: item.sender == "client" ? "white" : "black"}}
                                    >
                                        {item.message} 
                                        {
                                            item.sender == "consultor"? 
                                                <Text style = {{alignSlef:"flex-end", color: "red", fontSize: 10}}> - ${Number(item.price).toFixed(2)}</Text> 
                                            : null
                                        } 
                                    </Text>
                                    <Text style = {item.sender == "client" ? styles.myHour : styles.otherUserHour}>{item.hour}</Text>
                                    
                                </View>
                            </View>
                    )
                  break;
                case "image":
                    return(
                        item.hidden ?
                            <View style = {styles.blockedImage}>
                                <TouchableOpacity style = {{alignItems: "center", marginTop: "30%"}}  onPress = {() => unlockMessage(item)}>
                                    <Image source = {Lock} style = {styles.lockImage}/>
                                    <Text style = {{textAlign: "center", color: "#03b388", textDecorationLine: "underline", marginTop: 6, fontSize: 12}}>
                                        Desbloquear imagen por $ {Number(item.price).toFixed(2)} $
                                    </Text>
                                </TouchableOpacity>
                                <View style = {{position: "absolute", right: "8%", bottom: 10, borderRadius: 5, padding: 5, backgroundColor: "gray"}}>
                                    <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                </View>
                            </View>
                        :
                            <TouchableOpacity onPress = {() => chooseImageShow(item.mediaReference)} style = {item.sender == "client" ? styles.myImage : styles.otherUserImage}>
                                <View >
                                    <ActivityIndicator size="large" color="black" style = {{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}} />
                                        <FastImage
                                            style = {{width: 200, height: 200, borderRadius: 10}}
                                            source = {{
                                                uri: item.mediaReference,
                                                headers: { Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal
                                            }} 
                                            onLoadEnd={() => {
                                                setImageLoaded(true)
                                            }}
                                        />
                                </View>

                                {
                                    item.sender === "consultor" ?
                                        <View style = {{position: "absolute", right: 2, top: 20, borderRadius: 5, padding: 5, backgroundColor: "white"}}>
                                            <Text style = {{fontSize: 12, color: "red"}}>- $ {Number(item.price).toFixed(2)}</Text>
                                        </View>
                                    : null
                                }
                                {
                                    item.sender == "client" ?
                                        <View style = {{position: "absolute", right: "2%", bottom: 5, borderRadius: 5, padding: 5, backgroundColor: "gray"}}>
                                            <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                        </View>
                                    : 
                                        <View style = {{position: "absolute", left: "8%", bottom: 5, borderRadius: 5, padding: 5, backgroundColor: "gray"}}>
                                            <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                    )
                  break;
                case "Videocall":
                    return(
                        <View style = {styles.videoandcallLabel}>
                            <Image source = {Videocall} style = {styles.callIcons}/>
                            <Text style = {{textAlign: "center", color: "gray"}}>{fancyTimeFormat(item.duration)}</Text>
                            <Text style = {{color: "red", fontSize: 10, marginLeft: 10}}>- ${Number(item.price).toFixed(2)}</Text>
                        </View>
                    )
                  break;
                case "Phonecall":
                    return(
                        <View style = {styles.videoandcallLabel}>
                            <Image source = {Call} style = {styles.callIcons}/>
                            <Text style = {{textAlign: "center", color: "gray"}}>{fancyTimeFormat(item.duration)}</Text>
                            <Text style = {{color: "red", fontSize: 10, marginLeft: 10}}>- ${Number(item.price).toFixed(2)}</Text>
                        </View>
                    )
                  break;
                case "Video":
                    return(
                        !item.hidden ?
                            <View style = { item.sender  === "client" ? styles.myVideo : styles.otherUserVideo}>

                                {/* {
                                    Platform.OS === "android" ?
                                        <VideoFullScreen 
                                            visibleModal = {showVideoFullScreen} 
                                            mediaReference = {videoSelected} 
                                            closeModal = {() => setShowVideoFullScreen(false)}
                                        /> 
                                    : null
                                } */}
                                
                                {
                                    !videoLoaded ?
                                        <ActivityIndicator size="large" color="white" style = {{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}} />
                                    : null
                                }
                                
                                <Video
                                    source={{ uri: item.mediaReference }}
                                    resizeMode={"contain"}
                                    style = {
                                        videoSelected === item.mediaReference && Platform.OS === 'android'? 
                                            {
                                                height: Dimensions.get("window").height,
                                                width: Dimensions.get("window").width, 
                                                alignSelf: 'center'
                                            } 
                                        : 
                                            {borderRadius: 10, height: 200} 
                                    }
                                    controls={Platform.OS === 'ios' || videoSelected === item.mediaReference}
                                    // onLoadStart = {() => setVideoLoaded(false)}
                                    onLoadEnd={() => setVideoLoaded(true)}
                                    paused={true}
                                />

                                {   
                                    Platform.OS === 'android' ?
                                        <TouchableOpacity 
                                            style = {{position: 'absolute', top: '45%', left: '47%'}} 
                                            onPress = {() => {
                                                setShowVideoFullScreen(true);
                                                setVideoSelected(item.mediaReference)
                                            }}
                                        >
                                            <Icon name = "play" color = "white" size = {25} />
                                        </TouchableOpacity>
                                    : null 
                                }

                                {
                                    item.sender === "consultor" ?
                                        <View style = {{position: "absolute", right: 5, top: 10, borderRadius: 5, padding: 5, backgroundColor: "white"}}>
                                            <Text style = {{fontSize: 12, color:  item.hidden? "gray" : "red"}}>+ $ {Number(item.price).toFixed(2)}</Text>
                                        </View>
                                    : null
                                }
                                {
                                    item.sender === 'client'?
                                        <View style = {{position: "absolute", right: '5%', bottom: 10, borderRadius: 5, padding: 5, zIndex: 1, backgroundColor: "gray"}}>
                                            <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                        </View>
                                    :
                                        <View style = {{position: "absolute", left: '5%', bottom: 10, borderRadius: 5, padding: 5, zIndex: 1, backgroundColor: "gray"}}>
                                            <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                        </View>
                                }
                            </View>
                        : 
                            <View style = {styles.blockedImage}>
                                <TouchableOpacity style = {{alignItems: "center", marginTop: "30%"}}  onPress = {() => unlockMessage(item)}>
                                    <Image source = {Lock} style = {styles.lockImage}/>
                                    <Text style = {{textAlign: "center", color: "#03b388", textDecorationLine: "underline", marginTop: 6, fontSize: 12}}>
                                        Desbloquear video por $ {Number(item.price).toFixed(2)}
                                    </Text>
                                </TouchableOpacity>
                                <View style = {{position: "absolute", right: "8%", bottom: 10, borderRadius: 5, padding: 5, backgroundColor: "gray"}}>
                                    <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                </View>
                            </View>
                    )
                  break;

                  case "VoiceNote":
                    return(
                        !item.hidden ?
                            <View style = { item.sender === "client" ? styles.myVoiceNote : styles.otherUserVoiceNote}>
                                {                            
                                    item.sender == "consultor"? 
                                        <Text style = {{color: item.hidden ? "gray" : "red", fontSize: 9, alignSelf: "flex-end"}}> + $ {Number(item.price).toFixed(2)}</Text>
                                    : null
                                }

                                <View style = {{flexDirection: "row"}}>

                                {
                                    !voiceNote.isPlaying || voiceNote.mediaReference !== item.mediaReference ? 
                                        <TouchableOpacity  onPress = { async () => {
                                            
                                            if(vnStatus === 0){
                                                await audioRecorderPlayer.stopPlayer();
                                                setVoiceNote({ mediaReference: '', isPlaying: false, currentTime: 0 });

                                                setVoiceNote({ mediaReference: item.mediaReference, isPlaying: true, currentTime: 0});
                                                
                                                const msg = await audioRecorderPlayer.startPlayer(item.mediaReference);
                                                audioRecorderPlayer.addPlayBackListener((e) => {
                                                    setVoiceNote(prevState => ({...prevState, currentTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))}))

                                                    if(e.duration === e.currentPosition){
                                                        setVoiceNote({mediaReference: "", isPlaying: false, currentTime: 0})
                                                    }
                                                    return;
                                                })
                                            } else {
                                                if(voiceNote.vnSelected === item.messageId){
                                                    setVnStatus(0);
                                                    setVoiceNote(prevState => ({...prevState, currentTime: voiceNote.currentTime, isPlaying: true}))
        
                                                    await audioRecorderPlayer.resumePlayer();
                                                } else {
                                                    await audioRecorderPlayer.stopPlayer();
                                                    setVoiceNote({ mediaReference: '', isPlaying: false, currentTime: 0 });
        
                                                    setVoiceNote({ mediaReference: item.mediaReference, isPlaying: true, currentTime: 0});
                                                    
                                                    const msg = await audioRecorderPlayer.startPlayer(item.mediaReference);
                                                    audioRecorderPlayer.addPlayBackListener((e) => {
                                                        setVoiceNote(prevState => ({...prevState, currentTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))}))
        
                                                        if(e.duration === e.currentPosition){
                                                            setVoiceNote({mediaReference: "", isPlaying: false, currentTime: 0})
                                                        }
                                                        return;
                                                    })
                                                }
                                            }
                                        }}>
                                            <Icon name ="play" size = {20} color= { item.sender === "client" ? "white": "gray"}/>
                                        </TouchableOpacity>
                                    : 
                                        <TouchableOpacity onPress = {async () => {
                                            await audioRecorderPlayer.pausePlayer();
                                            
                                            setVoiceNote({ mediaReference: item.mediaReference, isPlaying: false, currentTime: voiceNote.currentTime, vnSelected: item.messageId });
                                            setVnStatus(1);
                                        }}>
                                            <Icon name ="pause" size = {20} color=  {item.sender === "client" ? "white": "gray"}/>
                                        </TouchableOpacity>
                                }   
                                    <Text style = {{color: item.sender === "client" ? "white": "gray", fontSize: 13, marginTop: 2, marginLeft: 10}}> 
                                        { 
                                            item.mediaReference === voiceNote.mediaReference && voiceNote.isPlaying ?
                                                voiceNote.currentTime
                                            : 
                                            vnStatus === 1 && item.mediaReference === voiceNote.mediaReference ? 
                                                fancyTimeFormat(item.duration) + " (pausa)"
                                            : 
                                                fancyTimeFormat(item.duration)
                                        }
                                    </Text>
                                </View>
                                <Text style = {item.sender == "client" ? styles.myHour : styles.otherUserHour}>{item.hour}</Text>
                            </View> 
                        :
                        <View style = {styles.otherUserMessage}>
                            <TouchableOpacity style = {{flexDirection: "row"}} onPress = {() => unlockMessage(item)}>
                                <Image source = {Lock} style = {styles.lockImage}/>
                                <Text style = {{textAlign: "center", color: "#03b388", textDecorationLine: "underline", marginTop: 6}}>Desbloquear audio por {Number(item.price).toFixed(2)} $</Text>
                            </TouchableOpacity>
                        </View>
                    )
                  break;
                default:
                  return null
              }
        }   

        const renderItem = ({ item }) => (
            <View>
                {renderMessageType(item)}
            </View>
        );

        function handleCallsBehavior(){
            return (
                <View>
                    {
                        conversationStatus !== 4 ?
                            <View style = {{flexDirection: "row"}}>
                                <TouchableOpacity 
                                    style ={{marginTop: 9, marginRight: 20}}
                                    onPress = {
                                        conversationStatus === 3 ? 
                                            () => handleBlockedUserAlert("Este usuario te ha bloqueado", "Para poder contactarlo tiene que desbloquearte.")
                                        :
                                            conversationConfigData.data["Llamada"].estatus == 0 ?
                                                () => {
                                                    handleDisabledAlert("Llamadas bloquedas", "Este usuario ha bloqueado sus llamadas");
                                                }
                                            : 
                                            () => setShowVoiceCall(true)
                                    }
                                >
                                    <Icon 
                                        name ="phone" 
                                        size = {20}
                                        color = {conversationStatus === 3 ? "red" : conversationConfigData.data["Llamada"].estatus == 1 ? "#03b388": "#dcdcdc" }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity  
                                    style ={{marginTop: 8, marginRight: 20}}

                                    onPress = {
                                        conversationStatus === 3 ? 
                                            () => handleBlockedUserAlert("Este usuario te ha bloqueado", "Para poder contactarlo tiene que desbloquearte.")
                                        :
                                            conversationConfigData.data["Videollamada"].estatus == 0 ?
                                                () => {
                                                    handleDisabledAlert("Videollamadas bloquedas", "Este usuario ha bloqueado sus videollamadas");
                                                }
                                            : 
                                                () => setShowVideoCall(true)
                                    }
                                >
                                    <Icon 
                                        name ="tv" 
                                        size = {20} 
                                        color = {conversationStatus === 3 ? "red" : conversationConfigData.data["Videollamada"].estatus == 1 ? "#03b388": "#dcdcdc" }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity  style ={{marginTop: 8, marginRight: 5}} onPress = {() => setShowSemiModal(prevState => !prevState) }>
                                    <Icon name ="ellipsis-h" size = {20} color ="black"/>
                                </TouchableOpacity>
                            </View>
                        :
                            <TouchableOpacity  style ={{marginTop: 8, marginRight: 5}} onPress = {() => setShowSemiModal(prevState => !prevState) }>
                                <Icon name ="ellipsis-h" size = {20} color ="black"/>
                            </TouchableOpacity>
                            
                    }
                </View>
            )
        }

        console.log("dictionary", dictionary)

        return( 
            <View style = {[styles.container, {paddingTop: insets.top -35, paddingBottom: insets.bottom + 20}]}>
                <NoInternetModal visibleModal = {userHasInternet} />
                <AwesomeAlert
                    show={showDisbaledAlert}
                    showProgress={false}
                    title={disabledChannelTitle}
                    message= {disabledChannelMessage}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Entendido"
                    confirmButtonColor= "#03b388"
                    onConfirmPressed={() => {
                        setShowDisabledAlert(false);
                    }}
                />

                <AwesomeAlert
                    show={showBlockedAlert}
                    showProgress={false}
                    title={blockedUserTitle}
                    message= {blockedUserMessage}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Entendido"
                    confirmButtonColor= "#03b388"
                    onConfirmPressed={() => {
                        setShowBlockedAlert(false);
                    }}
                />

                <AwesomeAlert
                    show={showDeleteConversationModal}
                    showProgress={false}
                    title="Estas seguro?"
                    message= "Si elimnas esta conversación todos los registros de conversacion quedaran borrdos."
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmText="Si, entiendo"
                    cancelText="Cancelar"
                    confirmButtonColor= "#03b388"
                    cancelButtonColor= "red"
                    onConfirmPressed={() => {
                        updateConsulta("delete")
                    }}
                    onCancelPressed={() => {
                        setShowDeleteConversationModal(false)
                    }}
                />
                
                <Modal isVisible = {showVideoCall} style = {{margin: 0, backgroundColor: "white"}}>
                    <VideoCall 
                        closeVideoCallModal = {() => setShowVideoCall(false)} 
                        token = {dictionary.preciosMinimos.token}
                        price = { Number(conversationConfigData.data['Videollamada'].costo).toFixed(2)}
                        balance = { Number(balanceData.balance).toFixed(2) }
                        data = {data}
                        saveCallInFirestore = {(duration, price, type) => sendCallToFirestore(duration, price, type)}
                    />
                </Modal>

                <Modal isVisible = {showVoiceCall} style = {{margin: 0, backgroundColor: "white"}}>
                    <VoiceCall 
                        closeVideoCallModal = {() => setShowVoiceCall(false)} 
                        price = { Number(conversationConfigData.data['Llamada'].costo).toFixed(2)}
                        balance = { Number(balanceData.balance).toFixed(2) }
                        token = {dictionary.preciosMinimos.token}
                        data = {data}
                        saveCallInFirestore = {(duration, price, type) => sendCallToFirestore(duration, price, type)}
                    />
                </Modal>

                <DialogInput 
                    isDialogVisible={showAmountInput}
                    title={"Deposito"}
                    message={"Cuanto quieres depositar?"}
                    hintInput ={"Cantidad"}
                    submitInput={ (inputText) => {{
                        if(inputText !== undefined ){
                            initializePaymentSheet(inputText) 
                            console.log('inputss', inputText, adminData.idUsuario)
                        }
                    }
                    }}
                    submitText = {'Continuar'}
                    textInputProps = {{
                        keyboardType: 'numeric'
                    }}
                    closeDialog={ () => setShowAmountInput(false)}
                >
                </DialogInput>

                <Modal
                    animationIn = 'slideInUp'
                    isVisible = {recordingModal}
                    style = {{
                        backgroundColor: "white",
                        marginTop: "50%", 
                        marginBottom: "50%", 
                        borderRadius: 10
                    }}
                    animationInTiming = {400}
                >
                    <TouchableOpacity 
                        onPress = {() => {
                            setRecordingModal(false)
                            cleanRecording()
                        }} 
                        style = {{position: "absolute", top: 10, left: 10}}
                    >
                        <Text style = {{fontSize: 20}}>X</Text>
                    </TouchableOpacity>

                    {
                        recordingStatus === 2 ?
                            <TouchableOpacity 
                                style = {{backgroundColor: "#03b388", padding: 10, borderRadius: 5, position: "absolute", bottom: 20, alignSelf: "center", left: 20, right: 20}}
                                onPress = {() => {
                                    // setMediaSelected({uri: , fileName: })
                                    setRecordingModal(false)
                                    setTimeout(() => {
                                        saveInStorage();
                                    }, 1000);
                                }}
                            >
                                <Text style = {{color: "white", textAlign: "center"}}> Enviar </Text>
                            </TouchableOpacity>
                        : null
                    }

                    {
                        recordingStatus >= 2  ? 
                            <View>
                                <Text style = {{textAlign: "center", marginTop: -10}}> {recordCurrentTime} / {recordDuration} </Text>
                                <View style = {{flexDirection: "row", justifyContent: "space-around", marginTop: 30}}>

                                    {
                                        recordingStatus === 3 ?
                                            null
                                        :                                         
                                            <TouchableOpacity style = {{alignItems:"center"}} onPress = {() => onStartPlay()}>
                                                <Icon color ="#03b388" size = {25} name ="play"/>
                                                <Text style = {{ textAlign: "center"}}> 
                                                    Reproducir
                                                </Text>
                                            </TouchableOpacity>
                                    }


                                    <TouchableOpacity style = {{alignItems:"center"}} 
                                        onPress = {() => cleanRecording()}
                                    >
                                        <Icon color ="red" size = {25} name ="trash"/>
                                        <Text style = {{ textAlign: "center"}}> 
                                            Eliminar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        : 
                            <>
                                <TouchableOpacity style = {{backgroundColor: "#03b388", padding: 10, borderRadius: 5, marginLeft: 20, marginRight: 20}} 
                                    onPressIn = {() => onStartRecord()} 
                                    onPressOut = {() => onStopRecord()}
                                >
                                    <Text style = {{color: "white", textAlign: "center"}}> Manten pulsado para grabar  <Icon color ="white" size = {15} name ="microphone"/></Text>
                                </TouchableOpacity>

                                {
                                    recordingStatus === 1 ?
                                        <>
                                            <Image source = {RecordingIcon} style = {{position: "absolute", top: 20, right: 20, height: 80, width: 80}}/>
                                            <Text style = {{textAlign: "center", marginTop: 10}}>{recordDuration}</Text>
                                        </>
                                    : null
                                } 
                                
                            </>
                    }

                </Modal>

                <Modal
                    transparent={true}
                    animationIn = 'slideInUp'
                    isVisible = {showSemiModal}
                    style = {{margin: 0}}
                    animationInTiming = {400}
                >
                    <View 
                       style={[styles.halfModalDesign, {height: conversationStatus !== 4 ? "15%" : "10%"}]}
                    >
                        <TouchableOpacity style = {{position: "absolute", left: 10, top: 10}} onPress = {() => setShowSemiModal(false)}>
                            <Text style = {{fontSize: 16}}>X</Text>
                        </TouchableOpacity>

                        <View style = {{alignItems: "center", marginTop: "6%"}}>
                            <TouchableOpacity style = {{marginBottom: 25, justifyContent: "center"}} onPress = {() => {
                                setShowSemiModal(false)
                                            
                                setTimeout(() => {
                                    setShowReviewModal(true)
                                }, 800);
                            }}>
                                <Text style = {{fontSize: 15, textAlign: "center", fontWeight: "400"}}> <Icon color ="orange" size = {15} name ="star"/>  Calificar usuario</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            conversationStatus !== 4 ?
                                <View style = {{alignItems: "center"}}>
                                    <TouchableOpacity 
                                        style = {{marginBottom: 25, justifyContent: "center"}}                             
                                        onPress = {() => {
                                            setShowSemiModal(false)
                                            
                                            setTimeout(() => {
                                                setShowDeleteConversationModal(true)
                                            }, 800);
                                        }}        
                                    >
                                        <Text style = {{fontSize: 15, textAlign: "center", fontWeight: "400"}}> <Icon color ="#DC143C" size = {15} name ="trash"/>  Eliminar conversacion</Text>
                                    </TouchableOpacity>
                                </View>
                            : null
                        }

                    </View>
                </Modal>

                <Modal
                    animationIn = 'slideInUp'
                    isVisible = {showModalVideoOrImage}
                    style = {{backgroundColor: "white", marginTop: "50%", marginBottom: "50%", borderRadius: 20}}
                    animationInTiming = {400}
                >   
                    <TouchableOpacity style = {{position: "absolute", left: 15, top: 15}} onPress = {() => setShowModalVideoOrImage(false)}>
                        <Text style = {{fontSize: 18}}>X</Text>
                    </TouchableOpacity>
                    <View style = {{flexDirection: "row", justifyContent: "space-around"}}>
                        {
                            conversationConfigData.data["Imagenes"].estatus == 1 ?
                                <TouchableOpacity 
                                    onPress = {() => {
                                        setShowModalVideoOrImage(false)
                                        setTimeout(() => {
                                            chooseFile('photo')
                                        }, 1000);                            
                                    }}
                                >
                                    <Image source = {{uri: "https://image.flaticon.com/icons/png/512/964/964073.png"}} style = {{width: 80, height: 80}}/> 
                                    <Text style = {{textAlign: "center", marginTop: 10}}>Imagen</Text>
                                </TouchableOpacity>
                            :
                                    <TouchableOpacity>
                                        <Image source = {{uri: "https://image.flaticon.com/icons/png/512/3342/3342555.png"}} style = {{width: 80, height: 80, marginLeft: 25}}/> 
                                        <Text style = {{textAlign: "center", marginTop: 10}}>Imagenes bloqueadas</Text>
                                    </TouchableOpacity>   
                        }

                        {
                            conversationConfigData.data["Videos"].estatus == 1 ?
                                <TouchableOpacity
                                    onPress = {() => {
                                        setShowModalVideoOrImage(false)
                                        setTimeout(() => {
                                            chooseFile('video')
                                        }, 1000);      
                                    }}
                                >
                                    <Image source = {{uri: "https://image.flaticon.com/icons/png/512/3844/3844644.png"}} style = {{width: 80, height: 80, justifyContent: "center"}}/> 
                                    <Text style = {{textAlign: "center", marginTop: 10}}>Video</Text>
                                </TouchableOpacity>
                            : 
                                <TouchableOpacity>
                                    <Image source = {{uri: "https://image.flaticon.com/icons/png/512/4237/4237688.png"}} style = {{width: 80, height: 80, marginLeft: 20}}/> 
                                    <Text style = {{textAlign: "center", marginTop: 10}}>Videos bloqueados</Text>
                                </TouchableOpacity>
                        }
                    </View>
                </Modal>

                <Modal
                    animationIn = 'slideInUp'
                    isVisible = {showReviewsModal}
                    style = {{
                        backgroundColor: "#f5f5f5",
                        margin: 0
                    }}
                    animationInTiming = {400}
                >   

                    {
                        loadingReviewModal !== 1 ? 
                            <>
                                <TouchableOpacity style = {{position: "absolute", left: 20, top: 35}} onPress = {() => setShowReviewModal(false)}>
                                    <Text style = {{fontSize: 18}}>X</Text>
                                    </TouchableOpacity>
                                <View style = {{position: "absolute", top: Platform.OS === "android" ? keyboardOpened ? "3%" : "6%" : "10%", alignSelf: "center", marginBottom: 40, alignItems: "center"}}>
                                    <Image source = {{uri: data.consultor.foto_perfil}} style = {{height: 100, width: 100, borderRadius: 50, marginBottom: 15}}/>
                                    <Text style = {{textAlign: "center"}}>Califica a {data.consultor.nombre} {data.consultor.apellido_paterno}</Text>
                                </View>

                                <AirbnbRating
                                    defaultRating = {reviewStars}
                                    count={5}
                                    showRating = {false}
                                    size={30}
                                    onFinishRating = {stars => setReviewStars(stars)}
                                />

                                <TextInput 
                                    style={styles.inputStyle} 
                                    autoCorrect={false} 
                                    placeholder = "Escribe tu comentario..."
                                    placeholderTextColor={'#9e9e9e'} selectionColor={'#03B388'} autoCapitalize="none" autoCorrect={false}
                                    returnKeyType={"done"}
                                    blurOnSubmit = {true} 
                                    value = {reviewComment}
                                    onChangeText = {text => setReviewComment(text)}
                                />

                                <TouchableOpacity style = {styles.reviewButton} onPress = {() => updateConsulta("review")}>   
                                    {
                                        loadingReviewModal ? 
                                            <ActivityIndicator style = {{alignSelf: "center"}} color = "white"/>
                                        :
                                            <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Enviar</Text>
                                    }
                                </TouchableOpacity>
                            </>
                        : 
                            <>
                                <Image source = {{uri: "https://uxwing.com/wp-content/themes/uxwing/download/48-checkmark-cross/success-green-check-mark.png"}} style = {{height: 100, width: 100, alignSelf: "center", marginTop: -40}}/>
                                <Text style = {{textAlign: "center", marginTop: 20}}>Tu calificacion se ha enviado con exito!</Text>
                                <TouchableOpacity style = {styles.reviewButton} onPress = {() => {
                                    setShowReviewModal(false)
                                    setLoadingReviewModal(false)

                                }}>   
                                    <Text style = {{color: "#ffffff", textAlign: "center", fontSize: 16}}>Continuar</Text>
                                </TouchableOpacity>
                            </>
                            
                    }
                </Modal>
                
                <KeyboardListener
                    onWillShow={() => { setKeyboardOpened(true)}}
                    onWillHide={() => { setKeyboardOpened(false)}}
                />

                <LoaderModal visibleModal={loadingModal} text={'Desbloquenado mensaje...'} />
                <LoaderModal visibleModal={updateConsultaModal} text={updateConsultaMessage} />
                <LoaderModal visibleModal={imageLoadingModal} text={ mediaTypeConfirm === "Image" ? 'Enviando imagen...' : mediaTypeConfirm === "VoiceNote"? 'Enviando Audio' : 'Enviando video...' } />
                <ImageModal visibleModal = {showImageModal} image = {imageSelected} cleanModal = {() => setShowImageModal(false)}/>
                <ConfirmMediaModal 
                    visibleModal = {showConfirmMedia} 
                    file = {mediaSelected} 
                    mediaType = {mediaTypeConfirm}
                    cleanModal = {() => setShowConfirmMedia(false)}
                    saveMedia = {() => saveInStorage()}
                />

                <AwesomeAlert
                    show={noMoneyModal}
                    showProgress={false}
                    title="No tienes saldo suficiente"
                    message= "Quieres añadir saldo para seguir conversando? "
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmText="Si, claro"
                    cancelText="Cerrar"
                    confirmButtonColor= "#03b388"
                    cancelButtonColor= "red"
                    onConfirmPressed={() => {
                        setNoMoneyModal(false)
                        setShowAmountInput(true)
                    }}
                    onCancelPressed={() => {
                        setNoMoneyModal(false)
                    }}
                />

                {
                    balanceSidebarOpen ? 
                        <View style = {styles.balanceBox}>
                            <TouchableOpacity 
                                onPress = {() => setBalanceSidebarOpen(false)}
                                style = {{position: "absolute", left: 0, top: 0, fontSize: 12, padding: 10}}
                            >
                                    <Icon color ="black" size = {15} name ="times"/>
                            </TouchableOpacity>
                            <View style = {{marginTop: 20}}>
                                <Text style = {{marginTop: 10, fontWeight: "300"}}>Mi Balance</Text>
                                <Text style = {{marginTop: 5, color: "#03b388", fontSize: 13}}> $ {Number(balanceData.balance).toFixed(2)} </Text>
                            </View>

                            <View style = {{marginTop: 20, marginBottom: 20}}>
                                <Text style = {{marginTop: 10, fontWeight: "300"}}>Gastos en este chat</Text>
                                <Text style = {{marginTop: 5, color: "red", fontSize: 13}}> - $ {conversationExpenses.toFixed(2)} </Text>
                            </View>

                            <TouchableOpacity style = {{alignSelf: "center", padding: 3, paddingLeft: 10, paddingRight: 10, borderRadius: 5}} onPress ={() => setShowAmountInput(true)}>
                                <Text style  ={{textAlign: "center",  textDecorationLine: 'underline', color: "#03b388", fontSize: 14}}> + Saldo </Text> 
                            </TouchableOpacity>
                        </View>
                    : 
                        <TouchableOpacity onPress = {() => setBalanceSidebarOpen(true)} style = {styles.closedBalanceBox}>
                            <Image source = {{uri: "https://cdn.dribbble.com/users/1573779/screenshots/4060579/dollar-glass.gif"}} style = {{width: 30, height: 30, alignSelf: "center"}}/>
                        </TouchableOpacity>
                }

                <View style= {styles.chatHeader}>
                    <View style = {{flexDirection:"row"}}>
                        <TouchableOpacity onPress = {() => props.navigation.goBack()} style ={{marginTop: 10}}>
                            <Icon color ="black" size = {18} name ="arrow-left"/>
                        </TouchableOpacity>
                        <FastImage
                            style ={{width: 35, height: 35, marginLeft: 16, marginTop: 2, borderRadius: 50}}
                            source = {{
                                uri: data.consultor.foto_perfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("loaded")
                            }}
                        />
                        <Text style = {{marginLeft: 10, marginTop: 9, fontSize: 15}}> {data.consultor.nombre + " " + data.consultor.apellido_paterno} </Text>
                    </View>

                    {
                        handleCallsBehavior()
                    }
                </View>

                <KeyboardAwareView animated={false}>
                    <SectionList
                        ref = {messagesRef}
                        sections={messagesData.msg}
                        onEndReached = {(number) => setUserIsAtBottom(true)}
                        progressViewOffset={50}
                        refreshing = {sectionListRefreshing}
                        onScroll={({nativeEvent}) => {
                            if (isCloseToBottom(nativeEvent)) {
                                setBottomReached(true);
                            } else {
                                setBottomReached(false);
                            }
                        }}
                        onRefresh = {() => {
                            setRefreshDetected(true);
                            // setMessageLimitCount(prevState => prevState +=20)
                            let newNumber = limitNumber.current = limitNumber.current + 20;

                            console.log('new', newNumber)

                            const newDB = db.collection('interactions').where('conversationId', '==', data.id_consulta).orderBy('dateTime', 'desc').limit(newNumber);

                            setSectionListRefreshing(true)
                            const unsusc = newDB.onSnapshot(onCollectionUpdate); 
                            // consol.log('limit uto', limitMsgCount);
                            // unsusc();

                            setTimeout(async () => {
                                // const id =  makeid(10);
                                // const interactionRef = db.collection('interactions').doc('2tGtPGLllWbYdpbScoqA');
                                // const res = await interactionRef.update({message: id});
                                // limitMsgCount = limitMsgCount + 20


                                setSectionListRefreshing(false)
                                // unsusc();
                            }, 2000);
                            
                        }}
                        renderItem={renderItem}
                        keyExtractor={item => item.messageId}
                        style={{ marginBottom: 80}}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.groupByDayStyle}>
                                <Text>{title}</Text>
                            </View>
                        )}
                        // onContentSizeChange={() => messagesRef.current.scrollToEnd({animated: false})}
                        // onLayout={() => messagesRef.current.scrollToEnd({animated: false})}
                    /> 

                    {
                        conversationStatus === 3 || conversationStatus === 4 ? 
                            <View style = {styles.chatDisabledContainer}>
                                {
                                    conversationStatus === 4 ? 
                                        <View>
                                            <Text style = {{color: "gray", fontSize: 12}}>El usuario {data.consultor.nombre} {data.consultor.apellido_paterno} ha eliminado la conversación</Text>
                                            <TouchableOpacity                             
                                                onPress = {() => setShowDeleteConversationModal(true)}
                                            >
                                                <Text style = {{textAlign: 'center', color: "red", marginTop: 5}}> Eliminar también</Text>
                                            </TouchableOpacity>
                                        </View>
                                    :
                                        <Text style = {{textAlign: 'center', color: "red", marginTop: 5}}> Este usuario te ha bloqueado.</Text>
                                }
                            </View>
                        :
                            <View style = {styles.chatContainer}>
                                <TextInput 
                                    style={styles.chatInput}
                                    placeholder = {conversationConfigData.data["Mensaje"].estatus == 1 ?  "Enviar mensaje..." : 'Mensajes bloqueados'}
                                    autoCorrect = {false}
                                    editable = {conversationConfigData.data["Mensaje"].estatus == 1}
                                    placeholderTextColor = "gray"
                                    autoCapitalize = 'none'
                                    onChangeText = {message => setMessageInput(message)}
                                    value = {messageInput}
                                    returnKeyType={ 'done' }
                                    // multiline = {true}
                                /> 

                                <TouchableOpacity style = {{position: "absolute", left: 10, bottom: "25%"}}>
                                    <Icon color ="black" size = {18} name ="image" onPress={() => setShowModalVideoOrImage(true)}/> 
                                </TouchableOpacity>

                                {
                                    messageInput ?
                                        <TouchableOpacity 
                                            style = {{position: "absolute", right: 20, bottom: "25%"}} 
                                            onPress = {() => sendMessageToFirestore()}
                                            disabled = {sendButtonBloacked}
                                        >
                                            <Icon color ="#03b388" size = {18} name ="paper-plane"/>
                                        </TouchableOpacity>
                                    :
                                        conversationConfigData.data["Notas de Voz"].estatus == 1 ?
                                        <TouchableOpacity style = {{position: "absolute", right: 20, bottom: "25%"}} onPress = {() => {
                                            setRecordingModal(true)
                                            setRecordingStatus(0)
                                            setRecordDuration("00:00:00")
                                            setRecordSeconds(0)
                                        }}>
                                            <Icon color ="black" size = {18} name ="microphone"/>
                                        </TouchableOpacity>
                                        :
                                            <TouchableOpacity style = {{position: "absolute", right: 20, bottom: "25%"}} onPress = {() => handleDisabledAlert("Audios bloquedas", "Este usuario ha bloqueado sus audios")}>
                                                <Icon color ="#D3D3D3" size = {18} name ="microphone"/>
                                            </TouchableOpacity>
                                }
                            </View> 
                    }

                </KeyboardAwareView>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   paddingLeft: 10,
    //   paddingRight: 10,
      backgroundColor: "white", 
      position: "relative"
    },
    chatInput: {
        height: 50,
        padding: 3,
        paddingLeft: 6,
        borderRadius: 10,
        marginTop: 8,
        marginLeft: 50,
        marginRight: 50,
        borderColor: "gray", 
        backgroundColor: "white",
        color: "black",
        backgroundColor: "#f5f5f5",
        paddingRight: 10,
    }, 
    chatHeader: {
        padding: 15, 
        paddingLeft: 5,
        paddingTop: Platform.OS === 'ios' ? 29 : 10,
        margin: 0,
        flexDirection: "row", 
        justifyContent: "space-between", 
        backgroundColor: "white", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    chatContainer: {
        position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", height: 50, borderTopColor: "#dcdcdc", borderTopWidth: 0.4
    },
    chatDisabledContainer: {
        position: "absolute", bottom: 20, left: 0, right: 0, flexDirection: "row", justifyContent: "center"
    },
    textInputContainer: {
        position: "absolute", left: 10, right: 10, bottom: "4%", zIndex: 3
    },
    blockedImage: {
        width: 200, height: 200, alignSelf: "flex-start", backgroundColor: "#f5f5f5", 
        borderRadius: 10, marginTop: 20, marginLeft: 10, position: "relative"
    },
    blockedAudio : {
        width: 250, height: 50, alignSelf: "flex-start", backgroundColor: "#f5f5f5", 
        borderRadius: 10, marginTop: 20, marginLeft: 10, position: "relative"
    },
    myMessage: {
        marginTop: 20, padding: 8, borderRadius: 10, alignSelf:'flex-end', 
        backgroundColor: "#03b388", marginLeft: 10, marginRight: 10, borderBottomRightRadius: 0
    }, 
    otherUserMessage: {
        marginTop: 20, padding: 8, borderRadius: 10, alignSelf:'flex-start', marginLeft: 10, 
        marginRight: 10, backgroundColor: "#edf3fb", borderBottomLeftRadius: 0
    },
    myImage: {
        marginTop: 20, padding: 8, borderRadius: 10, alignSelf:'flex-end', 
        marginRight: 15, width: 200, height: 200, borderRadius: 10, marginBottom: 10
    }, 
    otherUserImage: {
        marginTop: 20, padding: 8, borderRadius: 10, alignSelf:'flex-start', width: 200, height: 200, borderRadius: 10, marginBottom: 15
    },
    myHour: {
        color: "#f5f5f5", fontSize: 10, marginTop: 10, fontStyle: "italic", alignSelf: "flex-end"
    }, 
    otherUserHour: {
        color: "gray", fontSize: 10, marginTop: 10, fontStyle: "italic"
    },
    myVideo: {
        width: 200, borderRadius: 10, margin: 20, marginTop: 25, marginRight: 10, marginBottom: 5, backgroundColor: "black", alignSelf: "flex-end"
    }, 
    otherUserVideo:{
        width: 200, borderRadius: 10, margin: 20, marginTop: 25, marginBottom: 5, marginLeft: 10, backgroundColor: "black", alignSelf: "flex-start"
    },
    otherUserVideo:{
        width: 200, borderRadius: 10, margin: 20, marginTop: 25, marginBottom: 5, marginLeft: 10, backgroundColor: "black", alignSelf: "flex-start"
    },
    myVoiceNote: {
        borderRadius: 10, alignSelf: "flex-end", padding: 10,  backgroundColor: "#03b388", marginRight: 10, marginBottom: 10, marginTop: 10
    }, 
    otherUserVoiceNote:{
        borderRadius: 10, alignSelf: "flex-start", padding: 10, backgroundColor: "#f5f5f5", margin: 16, marginLeft: 10, marginBottom: 10, marginTop: 25
    },
    lockImage: {
        width: 30, 
        height: 30, 
        marginRight: 10
    }, 
    videoandcallLabel: {
        alignSelf: "center", borderRadius: 10,padding: 2, backgroundColor: "#E0FFFF", flexDirection: "row", paddingLeft: 35, paddingRight: 35, marginTop: 10, marginBottom: 10
    },
    callIcons :{
        width: 15, height: 15, marginRight: 16
    }, 
    groupByDayStyle: {
        backgroundColor: "white", borderColor: "gray", borderWidth: 0.4, 
        borderRadius: 10, color: "gray", alignSelf: "center",  
        padding: 10, marginTop: 15, marginBottom: 10
    },
    balanceBox: {
        position: "absolute", width: "30%", right: 0, top: "20%",
        backgroundColor: "white", borderColor: "gray", borderRadius: 5, zIndex: 10, 
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    closedBalanceBox: {
        position: "absolute", width: "10%", right: 0, top: "20%",
        backgroundColor: "white", borderColor: "gray", borderRadius: 5, zIndex: 10, 
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    halfModalDesign: {
        height: '20%',
        marginTop: 'auto',
        // borderTopColor: Platform.OS === "android" ? "gray" : "transparent",
        // borderTopWidth: Platform.OS === "android" ? 0.4 : 0,
        backgroundColor:'white', 
        borderTopLeftRadius: 15, 
        borderTopRightRadius: 15, 
        shadowColor: "#000",
        shadowOffset: {
            width: 2.4,
            height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 10,
    },
    inputStyle: {
        backgroundColor: "#ffffff",
        padding: 12,
        margin: 10,
        marginLeft: 15,
        marginTop: 20,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        paddingTop: 12,
        elevation: 1, textAlignVertical: "top"
    },
    reviewButton: {
        backgroundColor: "#03B388", position: "absolute", padding: 6, 
        borderRadius: 5, left: 20, right: 20, bottom: 30
    },
});

const mapStateToProps = (state) => {
    return {
        conversationConfigData: state.conversationConfigData,
        balanceData: state.balanceData,
        adminData: state.adminData,
        dictionary: state.dictionaryData, 
        messagesData: state.messagesData
    }
}

const mapDispatchToProps = dispatch => ({
    setConversationConfig: (object) => dispatch(setConversationConfig(object)),
    changeBlanceState: (object) => dispatch(changeBlanceState(object)), 
    setMessagesList: (object) => dispatch(setMessagesList(object)), 
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientChat);
