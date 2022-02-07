import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet, 
  Dimensions,
  Image, 
  Alert
} from 'react-native';
import RtcEngine,{
  RtcLocalView,
  RtcRemoteView,
  RtcStats,
  VideoRenderMode,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
// import {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} from 'agora-access-token';

import requestCameraAndAudioPermission from '../../../../utils/permissionAndroid';
import LoaderModal from '../../../../utils/modalLoader';
import API from '../../../../apis/conversation/conversation';
// import AccessToken from './token';
const Calling = require('../../../../assets/calling.gif');
const Invoice = require('../../../../assets/invoice.gif');

// const appID = '397fa87fd3fb4295bfd3e5bcabee7050';
// const appCertificate = '39909703ef4c428583eb3c25f17286da';
// const channelName = 'Aldel';
// const uid = 2882341273;
// const account = "2882341273";
// const role = RtcRole.PUBLISHER;

// const expirationTimeInSeconds = 3600

// const currentTimestamp = Math.floor(Date.now() / 1000)

// const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

var timer = null;
var callTimer = null;
var balanceTimer = null;

interface Props { closeVideoCallModal, price, balance, data, saveCallInFirestore, token }

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */
interface State {
  appId: string;
  token: string;
  channelName: string;
  joinSucceed: boolean;
  peerIds: number[];
  inCallSeconds: number;
  showNotAnsweredAlert: boolean;
  isVideoMuted: boolean;
  dismissCall: boolean;
  alreadyLoaded: boolean;
  callFinishedByHangout: boolean;
  finishCallModal: boolean;
  finalDuration: any;
  finalPrice: any;
  finalReaseon: any;
  creatingTransactionModal: boolean;
}

export default class VideoCall extends Component<Props, State> {
  _engine?: RtcEngine;

  constructor(props) {
    super(props);
    this.state = {
      appId: '397fa87fd3fb4295bfd3e5bcabee7050',
      token: this.props.token,
      channelName: 'Aldel',
      joinSucceed: false,
      peerIds: [],
      inCallSeconds: 0,
      showNotAnsweredAlert: false, 
      isVideoMuted: false, 
      dismissCall: false, 
      alreadyLoaded: false,
      callFinishedByHangout: false, 
      finishCallModal: false, 
      finalDuration: '',
      finalPrice: '',
      finalReaseon: '', 
      creatingTransactionModal: false
    };

    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    this.init();
    // const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
    console.log("token")
  }

  finishAlert(){
    Alert.alert(
      "Finalizar llamada",
      "Estas seguro de finalizar la llamada?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          this.createCallTransaction(null, 'me');
        }
        }
      ]
    );
  }

  saveFirestore(){
    const { finalPrice, finalDuration } = this.state;
    this.props.saveCallInFirestore(finalDuration, finalPrice, "Videocall");
    this.endCall();
  }

  async createCallTransaction(uid, callFinisher){
    
    const { peerIds } = this.state;

    const finisher = callFinisher === 'me' ? 'Has' : 'Han'

    this.inCallingTime('stop');
    this.validateBalance('stop');

    this.setState({
      finalPrice: Number((this.state.inCallSeconds / 60 ) * this.props.price).toFixed(2),
      finalDuration: this.state.inCallSeconds,
      finalReaseon: `${finisher} finalizado la llamada`,
    });

    if(peerIds.length > 0){
      this.setState({ creatingTransactionModal: true });

      try {
        const createTransactionResponse = await API.createTransaction(this.props.data, Number(this.state.finalPrice), 'videocall', this.props.data.cliente.id_usuario, 1, '');
        
        console.log("response de transaction", createTransactionResponse);

        if(createTransactionResponse.status == 200){
          this.setState({ 
            creatingTransactionModal: false,
            callFinishedByHangout: true, 
            peerIds: peerIds.filter((id) => id !== uid),
          });
          
          this.saveFirestore();
        } else {
          alert('Ha ocurrido un error')
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
    } else {
      this.endCall()
    }
  }

  fancyTimeFormat(duration){   
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

  timeHandling(action){
    if (timer !== null || action === 'stop') {
      window.clearTimeout(timer); 
      console.log("YA ES NUll")
      timer = null;

    } else {
      timer = window.setTimeout( () => {
        if(this.state.peerIds.length < 1){
          this.setState({
            showNotAnsweredAlert: true
          })
        }
      }, 20000);

      console.log("YA ES TIMER")
    }
  }

  inCallingTime(action){
    let { inCallSeconds } = this.state;

    if (action === 'stop'){
      console.log("Limipiame la cuenta");

      window.clearInterval(callTimer);

      callTimer = null;
    } else {

      callTimer = window.setInterval(() => {
        console.log("sigue la cuenta");

        this.setState({
          inCallSeconds: inCallSeconds += 1
        })
      }, 1000);
    }
  }

  validateBalance(action){
    
    if(action === 'stop'){
      console.log("SE CORTO LA LLAMADA POR EL BALANCE")
      window.clearInterval(balanceTimer);
      balanceTimer = null;
      
    } else {
      balanceTimer = window.setInterval(() => {

        const priceBySecond = Number(this.props.price / 60 );
        const balanceLeft = Number(this.props.balance - (priceBySecond * this.state.inCallSeconds)).toFixed(2);
        
        console.log("sigue la cuenta de balance timer");

        console.log("numeros", Number(balanceLeft) - priceBySecond, priceBySecond);

        if((Number(balanceLeft) - priceBySecond ) <= priceBySecond){
          console.log("ya no tienes saldo para otro segundo", (Number(balanceLeft)));
          this.createCallTransaction(null, 'me');
        }    
      }, 1000);
    }
  }
  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  init = async () => {
    const { appId } = this.state;
    this._engine = await RtcEngine.create(appId);

    await this._engine.enableVideo();

    this._engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIds } = this.state;
      // If new user
      this.timeHandling('stop');
      this.inCallingTime('start');
      this.validateBalance('start');

      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);

      this.createCallTransaction(uid, 'other');
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log("SE LLAMO EL JOIN SUCCESS");
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true
      });

      this.timeHandling('start')
    });
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      0
    );
  };

  async onLeaveChannel(){
    return await this._engine?.leaveChannel();
  }
  /**
   * @name endCall
   * @description Function to end the call
   */

  endCall = async () => {
    this.onLeaveChannel().then(() => {
      this.timeHandling('stop');
      this.inCallingTime('stop');

      this.setState({ creatingTransactionModal: false, joinSucceed: false, showNotAnsweredAlert: false, dismissCall: true, finishCallModal: false, inCallSeconds: 0, });

      if(this.state.peerIds.length > 0){
        this.setState({
          callFinishedByHangout: true,
          peerIds: [], 
          inCallSeconds: 0
        })
      }
    });
  };

  switchCamera(){
    this._engine.switchCamera()
  }

  muteVideo(value){
    this._engine.muteLocalAudioStream(value);
    this.setState({
      isVideoMuted: value
    })
  }

  cleanData(){
    this.setState({
      isVideoMuted: false, peerIds: [], callFinishedByHangout: false, showNotAnsweredAlert: false, joinSucceed: false, inCallSeconds: 0, finalDuration: '0', finalReaseon: '', 
      finalPrice: '0'
    });

    this.props.closeVideoCallModal();
  }

  beforeCallStartsDesign(){
    return(
      <View style={styles.buttonHolderInit}>
        <TouchableOpacity style = {{position: "absolute", left: 20, top: 30}} onPress = {() => this.props.closeVideoCallModal()}>
          <Text style = {{fontSize: 20, padding: 10}}>X</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.startCall} style={styles.button}>
          <Text style={styles.buttonTextCall}> Iniciar videollamada  <Icon name = "camera" color = "white" size = {18} /> </Text>
        </TouchableOpacity>

        <View style = {{marginTop: '15%', width: '100%', paddingLeft: 50, paddingRight: 50}}>
          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style = {{marginBottom: 10, marginTop: 10, fontWeight: '300', color: "gray"}}>Precio p/m: </Text>
            <Text style = {{ marginBottom: 10, marginTop: 10, fontWeight: '600'}}> ${this.props.price} </Text>
          </View>

          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style = {{marginBottom: 10, marginTop: 10, fontWeight: '300', color: "gray"}}>Tu Saldo: </Text>
            <Text style = {{ marginBottom: 10, marginTop: 10, fontWeight: '600'}}> ${this.props.balance} </Text>
          </View>

          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style = {{marginBottom: 10, marginTop: 10, fontWeight: '300', color: "gray"}}>Tiempo max: </Text>
            <Text style = {{ marginBottom: 10, marginTop: 10, fontWeight: '600'}}> {Number( this.props.balance / this.props.price ).toFixed(1)} min. </Text>
          </View>
        </View>

        <Text style = {{marginTop: '10%', color: "gray", textAlign: "center", fontStyle: 'italic', fontWeight: '300', fontSize: 13}}> *Si el usuario no contesta, no se cobrara.</Text>
        <Text style = {{marginTop: 10, color: "gray", textAlign: "center", fontStyle: 'italic', fontWeight: '300', fontSize: 13, marginLeft: 10, marginRight: 10}}> *En caso de quedarte sin saldo Aldel te notificara 10 segundos antes de finalizar la llamada</Text>

      </View>
    )
  }

  inCallToolDesign(){
    let { isVideoMuted } = this.state;

    return(
      <View style={styles.buttonHolder}>
        <TouchableOpacity style = {styles.toolButton} onPress = {() => this.muteVideo(!isVideoMuted)}>
          <Text style={styles.buttonText}> <Icon name = {isVideoMuted ? "microphone-slash" : "microphone"} color = "#03B388" size = {30} /></Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.toolButton} onPress={() => this.finishAlert()}>
          <Text style={styles.buttonText}> <Icon name = "phone" color = "red" size = {30} /></Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.toolButton} onPress = {() => this.switchCamera()}>
          <Text style={styles.buttonText}> <Icon name = "undo" color = "#03B388" size = {30} /></Text>
        </TouchableOpacity>
      </View>
    )
  }

  inCallDataDesign(){
    return(
      <View style={styles.buttonHolder}>
          <View>
            <Text style = {{textAlign: 'center'}}>Tiempo</Text>
            <Text style = {{textAlign: 'center', marginTop: 5, color: '#03B388'}}>{this.fancyTimeFormat(this.state.inCallSeconds)}</Text>
          </View>

          <View>
            <Text style = {{textAlign: 'center'}}>Precio</Text>
            <Text style = {{textAlign: 'center', marginTop: 5, color: '#03B388'}}>
              ${Number((this.state.inCallSeconds / 60 ) * this.props.price).toFixed(2) }
            </Text>
          </View>

          <View>
            <Text style = {{textAlign: 'center'}}>Saldo</Text>
            <Text style = {{textAlign: 'center', marginTop: 5, color: '#03B388'}}>
              $ {Number(this.props.balance - ((this.props.price / 60 ) * this.state.inCallSeconds)).toFixed(2) }
            </Text>
          </View>
      </View>
    )
  }

  callResume(){
    return(
      <View style = {{height: '100%'}}>
        <Text style = {{marginTop: '30%', textAlign: 'center', fontWeight: '600', fontSize: 19}}>Resumen de videollamada</Text>

        <Text style = {{marginTop: 10, textAlign: 'center', fontWeight: '300', fontSize: 14}}>{this.state.finalReaseon}</Text>

        <Image source = {Invoice} style = {{width: 150, height: 150, alignSelf: 'center', marginTop: 50}}/>

        <View style = {{marginTop: '15%', width: '100%', paddingLeft: 50, paddingRight: 50}}>
          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style = {{marginBottom: 10, marginTop: 10, fontWeight: '300', color: "gray"}}>Costo: </Text>
            <Text style = {{ marginBottom: 10, marginTop: 10, fontWeight: '600'}}> ${this.state.finalPrice} </Text>
          </View>

          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style = {{marginBottom: 10, marginTop: 10, fontWeight: '300', color: "gray"}}>Duracion: </Text>
            <Text style = {{ marginBottom: 10, marginTop: 10, fontWeight: '600'}}> {this.fancyTimeFormat(this.state.finalDuration)} </Text>
          </View>
        </View>

        <TouchableOpacity style = {styles.continueButton} onPress = {() => this.cleanData()}>
          <Text style = {{textAlign: "center", color: 'white', fontSize: 16}} >Continuar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    console.log('data', this.props.data);
    return (
      <View style={styles.max}>
        <LoaderModal visibleModal={this.state.creatingTransactionModal} text={'Finalizando llamada...'} />
        <AwesomeAlert
          show={this.state.showNotAnsweredAlert}
          title="Llamada no contestada"
          message= "El usuario no contesto, intenta llamarlo en otro momento."
          showConfirmButton={true}
          confirmText="Entendido"
          confirmButtonColor= "#03b388"
          onConfirmPressed={() => {
            this.endCall();
            // this.props.closeVideoCallModal();
          }}
        />

        <View style={styles.max}>
          {
            !this.state.callFinishedByHangout ?
              this._renderVideos()
            : this.callResume()
          }
        </View>
      </View>
    );
  }

  _renderVideos = () => {
    const { joinSucceed, inCallSeconds } = this.state;
    
    return joinSucceed ? (
      <View style={styles.fullView}>
        {
          this.state.peerIds.length < 1 ?
            <>
              <View style = {styles.calling}>
                <View style = {{alignItems: 'center'}}>
                  <Image source = {Calling} style = {{width: 110, height: 110, marginLeft: 5}}/>
                  <Text style = {{fontSize: 20, marginTop: 10, textAlign: 'center'}}>Llamando </Text>
                </View>
              </View>
              <View style = {styles.toolsContainer}>
                {this.inCallToolDesign()}
              </View>
            </>
          :
            <>
              <View style = {{backgroundColor: 'white', padding: 10, position: "absolute", left: 0, right: 0, bottom: 0, height: '10%', zIndex: 30, borderTopColor: 'gray', borderTopWidth: 0.3, paddingBottom: 10}}>
                {this.inCallDataDesign()}
              </View> 
              <View style = {styles.toolsContainer}>
                {this.inCallToolDesign()}
              </View>
            </>
        }

        {
          this.state.peerIds.length > 0 ?   
            <RtcRemoteView.SurfaceView
              style={styles.max}
              uid={this.state.peerIds[0]}
              channelId={this.state.channelName}
              renderMode={VideoRenderMode.Hidden}
            />
          : 
              <View style={styles.max}>
              </View>
            
        }
        {this._renderRemoteVideos()}
      </View>
    ) : this.beforeCallStartsDesign();
  };

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}
      > 
        <RtcLocalView.SurfaceView
          style={styles.remote}
          channelId={this.state.channelName}
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay = {true}
        />
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
    backgroundColor: '#fdfcfe',
  },
  buttonHolder: {
    height: '10%',
    flex: 1,
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'space-around',
  },
  toolButton: {
    borderRadius: 10, 
    padding: 10, 
    height: 50, 
    alignSelf: 'center',
    backgroundColor: "#f5f5f5"
  },
  buttonHolderInit: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  calling: {
    position: 'absolute', 
    bottom: '50%', alignSelf: 'center',
    zIndex: 20,
    borderRadius: 30,
    padding: 20
  },
  toolsContainer: {
    position: 'absolute', 
    bottom: '15%', 
    zIndex: 20, 
    padding: 20, 
    width: '100%'
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#03B388',
    borderRadius: 25,
  },
  endCallButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonTextCall: {
    color: '#fff',
    textAlign: 'center', 
    fontWeight: '300', 
    fontSize: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center', 
    alignSelf: 'center'
  },
  fullView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  remoteContainer: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 100,
    height: 150,
    marginHorizontal: 2.5,
    borderRadius: 10
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  continueButton: {
    backgroundColor: "#03B388", 
    position: 'absolute', 
    padding: 12,
    bottom: '5%', 
    left: 10, 
    right: 10
  }
});
