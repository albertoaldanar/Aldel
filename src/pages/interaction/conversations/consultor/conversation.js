
import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, Alert, Image, ImageBackground, View, Dimensions, Text, SectionList, StyleSheet, TouchableOpacity, TextInput, Platform, TouchableWithoutFeedback, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import KeyboardListener from 'react-native-keyboard-listener';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
import * as firebase from 'firebase';
import Modal from 'react-native-modal';
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import { Rating, AirbnbRating } from 'react-native-ratings';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

import ImageModal from '../modals/imageModal';
import ConfirmMediaModal from '../modals/confirmMediaModal';
import DefaultUser from '../../../../assets/default_user.png';
import LoaderModal from '../../../../utils/modalLoader';
import Videocall from '../../../../assets/videocall.png';
import Call from '../../../../assets/call.png';
import RecordingIcon from '../../../../assets/recording-icon.gif';
import BlockedChat from '../../../../assets/blockedChat.png';
import API from '../../../../apis/conversation/conversation';
import API_INTERACTIONS from '../../../../apis/interaction/interaction';
import setConversationConfig from '../../../../redux/actions/interactions/conversationConfigActions';
import changeBlanceState from '../../../../redux/actions/admin/balanceActions';
import API_NOTIF from '../../../../apis/notifications/notifications';
import VideoCallModal from './videoCall';
import VoiceCall from './voiceCall';
import NoInternetModal from '../../../../utils/noInternetModal';

const audioRecorderPlayer = new AudioRecorderPlayer();

function ConsultorChat(props) {
        const { data } = props.route.params;
        const { conversationConfigData, setConversationConfig, changeBlanceState, balanceData, adminData, dictionary } = props;
        const [loading, setLoading] = useState(false);
        const [clientSecret, setClientSecret] = useState('');      
        const [showSearchModal, setSearchModal] = useState(false);
        const [messageInput, setMessageInput] = useState("");
        const [loadingModal, setLoadingModal] = useState(false);
        const [updateConsultaModal, setUpdateConsultaModal] = useState(false);
        const [updateConsultaMessage, setUpdateConsultaMessage] = useState('');
        const [showBlockedAlert, setShowBlockedAlert] = useState(false);
        const [blockedUserTitle, setBlockedUserTitle] = useState("");
        const [blockedUserMessage, setBlockedUserMessage] = useState("");
        const [ showImageModal, setShowImageModal ] = useState(false);
        const [ imageSelected, setImageSelected ] = useState("");
        const [ mediaSelected, setMediaSelected ] = useState("");
        const [ showConfirmMedia, setShowConfirmMedia ] = useState(false);
        const [ showModalVideoOrImage, setShowModalVideoOrImage ] = useState(false);
        const [imageLoaded, setImageLoaded] = useState(false);
        const [ mediaTypeConfirm, setShowMediaTypeConfirm ] = useState("");
        const [imageLoadingModal, setImageLoadingModal] = useState(false);
        const [keyboardOpened, setKeyboardOpened] = useState(false);
        const [showDeleteConversationModal, setShowDeleteConversationModal] = useState(false);
        const [newMessages, setNewMessages] = useState([{title: "", data:[] }]);
        const [disabledChannelTitle, setDisabledChannelTitle] = useState("");
        const [disabledChannelMessage, setDisabledChannelMessage] = useState("");
        const [showDisbaledAlert, setShowDisabledAlert] = useState(false);
        const [balanceSidebarOpen, setBalanceSidebarOpen] = useState(false);
        const [showSemiModal, setShowSemiModal] = useState(false);
        const [showReviewsModal, setShowReviewModal] = useState(false);
        const [conversationStatus, setConversationStatus] = useState(data.estatus);
        const [conversationIncome, setConversationIncome] = useState(0);
        const [filePath, setFilePath] = useState("");
        const [messages, setMessages ] = useState([]);
        const [userHasInternet, setUserHasInternet]= useState(false);        
        const [loadingReviewModal, setLoadingReviewModal] = useState(false);
        const [reviewStars, setReviewStars] = useState(data.cliente.estrellas);
        const [reviewComment, setReviewComment] = useState(data.cliente.comentario);
        const [showCallModal, setShowCallModal] = useState(false);
        const [voiceNote, setVoiceNote] = useState({ mediaReference: '', isPlaying: false, currentTime: 0 });
        const [playVN, setPlayVN] = useState(false);
        const [vnStatus, setVnStatus] = useState(0);
        const [recordingStatus, setRecordingStatus] = useState(0)
        const [recordingModal, setRecordingModal] = useState(false);
        const [recordSecond, setRecordSeconds] = useState(0);
        const [recordTime, setRecordTime] = useState(0);
        const [recordDuration, setRecordDuration] = useState("00:00:00");
        const [recordCurrentTime, setRecordCurrentTime] = useState("00:00:00");
        const [sendButtonBloacked, setSendButtonBlocked] = useState(false);
        const insets = useSafeAreaInsets();
        const db = firebase.firestore();
        const messagesRef = useRef(null);
        const [bottomReached, setBottomReached] = useState(false);
        const [numberOfMessages, setNumberOfMessages] = useState(0);
        const [scrollSectionList, setScrollSectionList] = useState(false); 
        const [videoDuration, setVideoDuration] = useState(0);
        const [showVideoCall, setShowVideoCall] = useState(false);
        const [showVoiceCall, setShowVoiceCall] = useState(false);
        const SECONDS = 5000;

        useEffect(() => {
            setScrollSectionList(true);

            const database = db.collection('interactions').where('conversationId', '==', data.id_consulta);
    
		    const unsubscribe = database.onSnapshot(onCollectionUpdate); 

            getConversationConfig();

            const interval = setInterval(() => {
                getConversationConfig();
                
            }, SECONDS);

            return () => clearInterval(interval);

        }, []);

        useEffect(() =>{
            if(scrollSectionList || bottomReached){
                setTimeout(() => {
                    scrollChatToBottom();
                }, 1000);
            }
        }, [numberOfMessages]);

        function scrollChatToBottom(){
            return messagesRef.current.scrollToLocation({
                animated: true,
                itemIndex: numberOfMessages
            })  
        }

        async function getConversationConfig(){
            try {
                
                const getConversationConfigResponse = await API.getConversationConfig(data.consultor.id_usuario, data.consultor.id_usuario,  data.id_consulta);

                if(getConversationConfigResponse.status == 200){
                    setConversationConfig({data: getConversationConfigResponse.data.precios});
                    changeBlanceState({balance: getConversationConfigResponse.data.saldo});
                    setConversationStatus(getConversationConfigResponse.data.consulta.estatus);
                    setConversationIncome(getConversationConfigResponse.data.consulta.transacciones);

                    cleanMessageConsultor();
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

        async function cleanMessageConsultor(){
            try {
                const saveLastMessageResponse = await API_INTERACTIONS.cleanUnreadedMessagesConsultor(data.id_consulta, 'reiniciar');

                if(saveLastMessageResponse.status == 200){
                    console.log("new messages unreaded cleaned");
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
                const saveLastMessageResponse = await API_INTERACTIONS.setNewLastMessage(data.id_consulta, adminData.iDtipoUsuario, message, messageType, 0, idFirebase);

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

        async function updateConsulta(status){
            setShowSemiModal(false);
            setLoadingReviewModal(true);

            let statusNumber;

            if(status === "delete"){
                conversationStatus === 6 ? statusNumber = 7 : statusNumber = 4;
            } else if (status === "review"){
                console.log('entro aqui')
                statusNumber = conversationStatus;
            }
            else {
                conversationStatus === 3 ? statusNumber = 2 : statusNumber = 3;
            }
            
            try {
                const updateConsulta = await API_INTERACTIONS.acceptDeclineInteraction(data, statusNumber, null, null, reviewStars, reviewComment);
                console.log("updata consulta", updateConsulta);

                if(updateConsulta.status == 200){
                    setConversationStatus(statusNumber);
                    if(statusNumber === 4 || statusNumber === 7){
                        props.navigation.navigate("Index");
                    } else if (status === "review"){
                        setLoadingReviewModal(1);
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
            console.log("selected", type)
            
            let options = {
              mediaType: type,
            };

            launchImageLibrary(options, (response) => {

                if(response.assets){
                    if(response.assets[0].fileName || response.assets[0].uri){
                        if(response.assets[0].type === "image/jpg" || response.assets[0].type === "image/png" || response.assets[0].type === "image/jpeg"){
                            setShowMediaTypeConfirm("Image")
                        } else {
                            setVideoDuration(response.assets[0].duration)
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
            console.log('media selected', mediaSelected, mediaTypeConfirm);
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
                price: mediaTypeConfirm === "Image" ? 
                        conversationConfigData.data["Imagenes"].costo 
                    : 
                        mediaTypeConfirm === "VoiceNote" ?
                            (conversationConfigData.data["Notas de Voz"].costo / 60) * (recordSecond / 1000) 
                        : 
                            (conversationConfigData.data["Videos"].costo / 60) * videoDuration,
                hidden: true, 
                sender: "consultor",
                type: messageType,
                client: data.cliente.nombre + " " + data.cliente.apellido_paterno,
                consultor: data.consultor.nombre + " " + data.consultor.apellido_paterno, 
                duration: (recordSecond / 1000),

            }).then((docRef) => {
                setImageLoadingModal(false);
                scrollChatToBottom();
                sendNotification();
                saveLastMessage('', messageType, id);
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
                sender: "consultor",
                hidden: true, 
                price: messageInput.length * conversationConfigData.data["Mensaje"].costo, 
                type: "text",
                client: data.cliente.nombre + " " + data.cliente.apellido_paterno,
                consultor: data.consultor.nombre + " " + data.consultor.apellido_paterno

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
            console.log("Se fue la notificacion");
            const header = 'Nuevo Mensaje';
            const message = data.consultor.nombre + ' ' + data.consultor.apellido_paterno + ' te ha enviado un mensaje';

            const notificationResponse = await API_NOTIF.sendNotification([data.cliente.notificacion_id], header, message);

            console.log("response notification",notificationResponse);
        }

        function onCollectionUpdate(querySnapshot){
            
            const messages = [];
            querySnapshot.forEach((doc) => {
                
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

            setNewMessages(msgArray);
            setNumberOfMessages(prevState => prevState += msgArray.length);
            setScrollSectionList(false);

            // scrollChatToBottom();
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

    //*VOICENOTES--------VOICENOTES

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

        async function onStopRecord(){
            setRecordingStatus(2);

            const uri = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();

            setShowMediaTypeConfirm('VoiceNote');
        };

        async function onStartPlay(){
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
            const paddingToBottom = 20;
            return layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;
        };

    //VOICENOTES--------VOICENOTES*
 
        function renderMessageType(item, index, section){
            switch(item.type) { 
                case "text":
                    return  (  
                            <View style = {item.sender == "consultor" ? styles.myMessage : styles.otherUserMessage} >
                                <Text 
                                    style = {{color: item.sender == "consultor" ? "white" : "black"}}
                                >
                                    {item.message}
                                    {
                                        item.sender == "consultor"? 
                                            <Text style = {{alignSlef:"flex-end", color: item.hidden ? "gray" : "#00ff40", fontSize: 10}}> + ${Number(item.price).toFixed(2)}</Text> 
                                        : null
                                    } 
                                </Text>
                                <Text style = {item.sender == "consultor" ? styles.myHour : styles.otherUserHour}>{item.hour}</Text>
                            </View>
                    )
                  break;
                case "image":
                    return(
                        <TouchableOpacity onPress = {() => chooseImageShow(item.mediaReference)} style = {item.sender == "consultor" ? styles.myImage : styles.otherUserImage}>
                            
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
                            {
                                item.sender === "consultor" ?
                                    <View style = {{position: "absolute", left: 15, top: 20, borderRadius: 5, padding: 5, backgroundColor: "white"}}>
                                        <Text style = {{fontSize: 12, color:  item.hidden? "gray" : "#03b388"}}>+ $ {Number(item.price).toFixed(2)}</Text>
                                    </View>
                                : null
                            }

                            {
                                item.sender == "consultor" ?
                                    <View style = {{position: "absolute", right: "2%", bottom: 5, borderRadius: 5, padding: 5, backgroundColor: "#696969"}}>
                                        <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                    </View>
                                : 
                                    <View style = {{position: "absolute", left: "8%", bottom: 5, borderRadius: 5, padding: 5, backgroundColor: "#696969"}}>
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
                            <Text style = {{color: "#03b388", fontSize: 10, marginLeft: 10}}>+ ${Number(item.price).toFixed(2)}</Text>
                        </View>
                    )
                  break;
                  case "Phonecall":
                    return(
                        <View style = {styles.videoandcallLabel}>
                            <Image source = {Call} style = {styles.callIcons}/>
                            <Text style = {{textAlign: "center", color: "gray"}}>{fancyTimeFormat(item.duration)}</Text>
                            <Text style = {{color: "#03b388", fontSize: 10, marginLeft: 10}}>+ ${Number(item.price).toFixed(2)}</Text>
                        </View>
                    )
                  break;
                case "Video":
                    return(
                        <View style = { item.sender  === "consultor" ? styles.myVideo : styles.otherUserVideo}>
                            <Video
                                source={{ uri: item.mediaReference }}
                                resizeMode={"contain"}
                                style = {{borderRadius: 10, height: 200}}
                                controls={true}
                                paused={true}
                            />
                            
                            {
                                item.sender === "consultor" ?
                                    <View style = {{position: "absolute", left: 5, top: 40, borderRadius: 5, padding: 5, backgroundColor: "white"}}>
                                        <Text style = {{fontSize: 12, color:  item.hidden? "gray" : "#03b388"}}>+ $ {Number(item.price).toFixed(2)}</Text>
                                    </View>
                                : null
                            }

                            {
                                    item.sender === 'consultor'?
                                        <View style = {{position: "absolute", right: '5%', bottom: 10, borderRadius: 5, padding: 5, zIndex: 1, backgroundColor: "gray"}}>
                                            <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                        </View>
                                    :
                                        <View style = {{position: "absolute", left: '5%', bottom: 40, borderRadius: 5, padding: 5, zIndex: 1, backgroundColor: "gray"}}>
                                            <Text style = {{color: "black", fontSize: 12,  color: "#f5f5f5"}}>{item.hour}</Text>
                                        </View>
                                }
                        </View>
                    )
                  break;
                  case "VoiceNote":
                    return(
                        <View style = { item.sender  === "consultor" ? styles.myVoiceNote : styles.otherUserVoiceNote}>
                            {                            
                                item.sender == "consultor"? 
                                    <Text style = {{color: item.hidden ? "gray" : "#00ff40", fontSize: 9, alignSelf: "flex-end"}}> + $ {Number(item.price).toFixed(2)}</Text>
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
                                            try {
                                                const msg = await audioRecorderPlayer.startPlayer(item.mediaReference);
                                                
                                                audioRecorderPlayer.addPlayBackListener((e) => {
                                                    console.log("eeeee", e)
                                                    setVoiceNote(prevState => ({...prevState, currentTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))}))
    
                                                    if(e.duration === e.currentPosition){
                                                        setVoiceNote({mediaReference: "", isPlaying: false, currentTime: 0})
                                                    }
                                                    return;
                                                })
                                            } catch (error){
                                                console.log('ERROR AUDIO !', error);
                                            }

                                        } else {
                                            if(voiceNote.vnSelected === item.messageId){
                                                setVnStatus(0);
                                                setVoiceNote(prevState => ({...prevState, currentTime: voiceNote.currentTime, isPlaying: true}))
    
                                                await audioRecorderPlayer.resumePlayer();
                                            } else {
                                                await audioRecorderPlayer.stopPlayer();
                                                setVoiceNote({ mediaReference: '', isPlaying: false, currentTime: 0 });
    
                                                setVoiceNote({ mediaReference: item.mediaReference, isPlaying: true, currentTime: 0});

                                                if (Platform.OS === 'android') {
                                                    try {
                                                      const granted = await PermissionsAndroid.request(
                                                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                                        {
                                                          title: 'Play audio Permission',
                                                          message: 'App needs audio permission',
                                                        },
                                                      );
                                                      // If CAMERA Permission is granted

                                                      if(granted === PermissionsAndroid.RESULTS.GRANTED){
                                                        const msg = await audioRecorderPlayer.startPlayer(item.mediaReference);
                                                        audioRecorderPlayer.addPlayBackListener((e) => {
                                                            setVoiceNote(prevState => ({...prevState, currentTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))}))
            
                                                            if(e.duration === e.currentPosition){
                                                                setVoiceNote({mediaReference: "", isPlaying: false, currentTime: 0})
                                                            }
                                                            return;
                                                        });
                                                      }
                                                     
                                                    } catch (err) {
                                                      console.warn(err);
                                                      return false;
                                                    }
                                                } else {
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
                                        }
                                    }}>
                                        <Icon name ="play" size = {20} color= { item.sender === "consultor" ? "white": "gray"}/>
                                    </TouchableOpacity>
                                : 
                                    <TouchableOpacity onPress = {async () => {
                                        await audioRecorderPlayer.pausePlayer();
                                        
                                        setVoiceNote({ mediaReference: item.mediaReference, isPlaying: false, currentTime: voiceNote.currentTime, vnSelected: item.messageId });
                                        setVnStatus(1);
                                    }}>
                                        <Icon name ="pause" size = {20} color=  {item.sender === "consultor" ? "white": "gray"}/>
                                    </TouchableOpacity>
                            }   

                                <Text style = {{color: item.sender === "consultor" ? "white": "gray", fontSize: 13, marginTop: 2, marginLeft: 10}}> 
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
                            <Text style = {item.sender == "consultor" ? styles.myHour : styles.otherUserHour}>{item.hour}</Text>
                        </View>
                    )
                  break;
                default:
                  return null
            }
        }   
        
        const renderItem = ({ item, index, section }) => (
            <View>
                {
                    renderMessageType(item, index, section)
                }
            </View>
        );

        function handleCallsBehavior(){
            return (
                <View>
                    {
                        conversationStatus !== 6 ?
                            <View style = {{flexDirection: "row"}}>
                                <TouchableOpacity 
                                    style ={{marginTop: 9, marginRight: 20}}
                                    onPress = {
                                        conversationStatus === 3 ? 
                                            () => handleBlockedUserAlert("Usuario bloqueado", "Has bloqueado a este usuario, para contactarlo, desbloquealo.")
                                        :
                                            conversationConfigData.data["Llamada"].estatus == 0 ?
                                                () => {
                                                    handleDisabledAlert("Llamadas bloquedas", "Desbloquea tus llamadas en tu administrador, para poder realizarlas.");
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
                                            () => handleBlockedUserAlert("Usuario bloqueado", "Has bloqueado a este usuario, para contactarlo, desbloquealo.")
                                        :
                                            conversationConfigData.data["Videollamada"].estatus == 0 ?
                                                () => {
                                                    handleDisabledAlert("Videollamadas bloquedas", "Desbloquea tus videollamadas en tu administrador, para poder realizarlas.");
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

        return( 
            <View style = {[styles.container, {paddingTop: insets.top -35, paddingBottom: insets.bottom }]}>
                
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
                    <VideoCallModal 
                        closeVideoCallModal = {() => setShowVideoCall(false)} 
                        price = { Number(conversationConfigData.data['Videollamada'].costo).toFixed(2)}
                        data = {data}
                        token = {dictionary.preciosMinimos.token}
                    />
                </Modal>

                <Modal isVisible = {showVoiceCall} style = {{margin: 0, backgroundColor: "white"}}>
                    <VoiceCall 
                        closeVideoCallModal = {() => setShowVoiceCall(false)} 
                        price = { Number(conversationConfigData.data['Llamada'].costo).toFixed(2)}
                        data = {data}
                        token = {dictionary.preciosMinimos.token}
                    />
                </Modal>

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
                                <Text style = {{textAlign: "center", marginBottom: 20, color: "#03b388"}}> ${((conversationConfigData.data["Notas de Voz"].costo / 60) * (recordSecond / 1000)).toFixed(2)} </Text>
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
                       style={[styles.halfModalDesign, {height: conversationStatus !== 6 ? "20%" : "10%"}]}
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
                            conversationStatus !== 6 ?
                                <>
                                    <View style = {{alignItems: "center"}}>
                                        
                                        <TouchableOpacity style = {{marginBottom: 25, justifyContent: "center"}} onPress = {() => updateConsulta()}>
                                            {
                                                conversationStatus === 3 ?
                                                    <Text style = {{fontSize: 15, textAlign: "center", color: "black", fontWeight: "400"}}> <Icon color ="#03b388" size = {15} name ="user"/>  Desbloquear usuario</Text>
                                                :
                                                    <Text style = {{fontSize: 15, textAlign: "center", color: "black", fontWeight: "400"}}> <Icon color ="red" size = {15} name ="user-times"/>  Bloquear usuario</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>

                                    <View style = {{alignItems: "center"}}>
                                        <TouchableOpacity style = {{marginBottom: 25, justifyContent: "center"}}                             
                                        onPress = {() => {
                                            setShowSemiModal(false)

                                            setTimeout(() => {
                                                setShowDeleteConversationModal(true)
                                            }, 1000);
                                    
                                        }}>
                                            <Text style = {{fontSize: 15, textAlign: "center", fontWeight: "400"}}> <Icon color ="#DC143C" size = {15} name ="trash"/>  Eliminar conversacion</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
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
                                    <Image source = {{uri: data.cliente.foto_perfil}} style = {{height: 100, width: 100, borderRadius: 50, marginBottom: 15}}/>
                                    <Text style = {{textAlign: "center"}}>Califica a {data.cliente.nombre} {data.cliente.apellido_paterno}</Text>
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
                    price = { 
                        mediaTypeConfirm === 'Image' ? conversationConfigData.data["Imagenes"].costo : (conversationConfigData.data["Videos"].costo / 60) * videoDuration
                    }
                    mediaType = {mediaTypeConfirm}
                    cleanModal = {() => setShowConfirmMedia(false)}
                    saveMedia = {() => saveInStorage()}
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
                                <Text style = {{marginTop: 10, fontWeight: "300"}}>Ganancia en este chat</Text>
                                <Text style = {{marginTop: 10, color: "#03b388", fontSize: 13}}>+${(Number(conversationIncome) * 1.2).toFixed(2) } </Text>
                                <Text style = {{marginTop: 10, color: "red", fontSize: 13, textDecorationLine: 'underline',}}>-${((Number(conversationIncome) * 1.2) - (Number(conversationIncome))).toFixed(2) } (aldel 20%) </Text>
                                <Text style = {{marginTop: 10, color: "#03b388", fontSize: 13, fontWeight: "bold"}}> ${(Number(conversationIncome)).toFixed(2) } </Text>
                            </View>

                            <TouchableOpacity style = {{alignSelf: "center", padding: 3, paddingLeft: 10, paddingRight: 10, borderRadius: 5,}} onPress = {() => props.navigation.navigate('ConsultorBalance')}>
                                <Text style  ={{textAlign: "center", textDecorationLine: 'underline', color: "#03b388", fontSize: 14}}><Icon color ="#03b388" size = {14} name ="credit-card"/>  Ver cuenta </Text> 
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
                                uri: data.cliente.foto_perfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("loaded")
                            }}
                        />
                        <Text style = {{marginLeft: 10, marginTop: 9, fontSize: 15}}> {data.cliente.nombre} {data.cliente.apellido_paterno} </Text>
                    </View>
                    {
                        handleCallsBehavior()
                    }
                </View>

                <KeyboardAwareView animated={false}>
                    <SectionList
                        sections={newMessages}
                        renderItem={renderItem}
                        ref = {messagesRef}
                        keyExtractor={item => item.messageId}
                        onScroll={({nativeEvent}) => {
                            if (isCloseToBottom(nativeEvent)) {
                                setBottomReached(true);
                            } else {
                                setBottomReached(false);
                            }
                        }}
                        style={{ marginBottom: 80}}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.groupByDayStyle}>
                                <Text>{title}</Text>
                            </View>
                        )}
                        // getItemLayout={(data, index) => {
                        //     console.log(`getItemLayout called with index: ${index} ${data}`);
                        //     return { length: 44, offset: 44 * index, index: index };
                        // }}
                    /> 

                    {
                        conversationStatus === 3 || conversationStatus === 6 ? 
                            <View style = {styles.chatDisabledContainer}>
                                {
                                    conversationStatus === 6 ? 
                                        <View>
                                            <Text style = {{color: "gray", fontSize: 12}}>El usuario {data.cliente.nombre} {data.cliente.apellido_paterno} ha eliminado la conversación</Text>
                                            <TouchableOpacity                             
                                                onPress = {() => setShowDeleteConversationModal(true)}
                                            >
                                                <Text style = {{textAlign: 'center', color: "red", marginTop: 5}}> Eliminar también</Text>
                                            </TouchableOpacity>
                                        </View>
                                    :
                                        <Text style = {{textAlign: 'center', color: "red", marginTop: 5}}> Has bloqueado a este usuario</Text>
                                }
                                
                            </View>
                        :
                                            
                            <View style = {styles.chatContainer}>
                                <TextInput 
                                    style={styles.chatInput}
                                    placeholder = {conversationConfigData.data["Mensaje"].estatus == 1 ?  "Enviar mensaje..." : ' Has bloaquedao tus mensajes'}
                                    autoCorrect = {false}
                                    editable = {conversationConfigData.data["Mensaje"].estatus == 1}
                                    placeholderTextColor = "gray"
                                    autoCapitalize = 'none'
                                    onChangeText = {message => setMessageInput(message)}
                                    value = {messageInput}
                                    returnKeyType={ 'done' }
                                    // multiline = {true}
                                /> 

                                <TouchableOpacity style = {{position: "absolute", left: 10, bottom: "26%"}}>
                                    <Icon color ="black" size = {18} name ="image" onPress={() => setShowModalVideoOrImage(true)}/> 
                                </TouchableOpacity>

                                {
                                    messageInput ?
                                        <TouchableOpacity 
                                            style = {{position: "absolute", right: 16, bottom: "20%"}} 
                                            onPress = {() => sendMessageToFirestore()}
                                            disabled = {sendButtonBloacked}
                                        >
                                            <Icon color ="#03b388" size = {14} name ="paper-plane" style = {{textAlign: 'center'}}/>
                                            <Text style = {{textAlign: "center", color: "#03b388", fontSize: 10, marginTop: 2}}>${(messageInput.length * conversationConfigData.data["Mensaje"].costo).toFixed(2)}</Text>
                                        </TouchableOpacity>
                                    :
                                        conversationConfigData.data["Notas de Voz"].estatus == 1 ?
                                            <TouchableOpacity style = {{position: "absolute", right: 20, bottom: "26%"}} onPress = {async () => {
                                                try {   
                                                    await audioRecorderPlayer.stopPlayer();
                                                } catch (error) {
                                                    console.log(error)
                                                }
                                                setRecordingModal(true)
                                                setRecordingStatus(0)
                                                setVoiceNote({mediaReference: '', isPlaying: false, currentTime: 0, vnSelected: 0})
                                                setRecordDuration("00:00:00")
                                                setRecordSeconds(0)
                                                setRecordCurrentTime(0)

                                            }}
                                            >
                                                <Icon color ="black" size = {18} name ="microphone"/>
                                            </TouchableOpacity>
                                        :
                                            <TouchableOpacity style = {{position: "absolute", right: 20, bottom: "26%"}} onPress = {() => handleDisabledAlert("Audios bloquedas", "Has bloqueado tus audios")}>
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
    //   flex: 1,
      backgroundColor: "white", 
      position: "relative"
    },
    chatInput: {
        borderRadius: 10,
        height: 50,
        padding: 3,
        paddingTop: 5,
        paddingLeft: 6,
        marginTop: 13,
        marginLeft: 50,
        marginRight: 50,
        borderColor: "gray", 
        backgroundColor: "white",
        color: "black",
        backgroundColor: "#f5f5f5",
        paddingRight: 10,
    }, 
    chatDisabledContainer: {
        position: "absolute", bottom: 20, left: 0, right: 0, flexDirection: "row", justifyContent: "center"
    },
    chatContainer: {
        position: "absolute", bottom: 6, left: 0, right: 0, backgroundColor: "white", height: 60, borderTopColor: "#dcdcdc", borderTopWidth: 0.4
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
        marginRight: 20, width: 200, height: 200, borderRadius: 10, marginBottom: 10
    }, 
    otherUserImage: {
        marginTop: 20, padding: 8, borderRadius: 10, alignSelf:'flex-start', marginLeft: 2, width: 200, height: 200, borderRadius: 10, marginBottom: 10
    },
    myHour: {
        color: "#f5f5f5", fontSize: 10, marginTop: 10, fontStyle: "italic", alignSelf: "flex-end"
    }, 
    otherUserHour: {
        color: "gray", fontSize: 10, marginTop: 10, fontStyle: "italic"
    },
    myVideo: {
        width: 200, borderRadius: 10, margin: 20, marginTop: 25, marginRight: 10, marginBottom: 5, backgroundColor: "black", alignSelf: "flex-end", 
    }, 
    otherUserVideo:{
        width: 200, borderRadius: 10, margin: 20, marginTop: 25, marginBottom: 5, marginLeft: 10, backgroundColor: "black", alignSelf: "flex-start"
    },
    myVoiceNote: {
        borderRadius: 10, alignSelf: "flex-end", padding: 10,  backgroundColor: "#03b388", marginRight: 10, marginBottom: 10, marginTop: 10
    }, 
    otherUserVoiceNote:{
        borderRadius: 10, alignSelf: "flex-start", padding: 10, backgroundColor: "#f5f5f5", margin: 16, marginLeft: 10, marginBottom: 10, marginTop: 10
    },
    lockImage: {
        width: 30, 
        height: 30, 
        marginRight: 10
    }, 
    videoandcallLabel: {
        alignSelf: "center", borderRadius: 10,padding: 2, backgroundColor: "#E0FFFF", flexDirection: "row", paddingLeft: 30, paddingRight: 30, marginTop: 10, marginBottom: 10
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
        position: "absolute", width: "40%", right: 0, top: "20%",
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
        borderRadius: 5, left: 20, right: 20, bottom: 50
    },
  });

const mapDispatchToProps = dispatch => ({
    setConversationConfig: (object) => dispatch(setConversationConfig(object)), 
    changeBlanceState: (object) => dispatch(changeBlanceState(object)), 
});

const mapStateToProps = (state) => {
    return {
        conversationConfigData: state.conversationConfigData,
        balanceData: state.balanceData,
        adminData: state.adminData,
        dictionary: state.dictionaryData
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultorChat);
