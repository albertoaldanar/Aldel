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
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import LoaderModal from '../../../../utils/modalLoader';
import requestCameraAndAudioPermission from '../../../../utils/permissionAndroid';
const Calling = require('../../../../assets/calling.gif');
const Invoice = require('../../../../assets/invoice.gif');

var timer = null;
var callTimer = null;

interface Props { closeVideoCallModal, price, balance, dictionary }

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
  inCallSeconds: number;
  peerIds: number[];
  incommingCallSeconds: number;
  showNotAnsweredAlert: boolean;
  isVideoMuted: boolean;
  dismissCall: boolean;
  callFinishedByHangout: boolean;
  finishCallModal: boolean;
  finalDuration: any;
  finalPrice: any;
  finalReaseon: string;
  creatingTransactionModal: boolean;
}

export default class VideoCall extends Component<Props, State> {
  _engine?: RtcEngine;

  constructor(props) {
    super(props);
    this.state = {
      appId: '397fa87fd3fb4295bfd3e5bcabee7050',
      token: this.props.dictionary,
      channelName: 'Aldel',
      joinSucceed: false,
      peerIds: [],
      incommingCallSeconds: 0,
      showNotAnsweredAlert: false, 
      isVideoMuted: false, 
      dismissCall: false, 
      inCallSeconds: 0,
      callFinishedByHangout: false,
      finishCallModal: false,
      finalDuration: 0,
      finalPrice: 0,
      finalReaseon: 'Has finalizado la videollamada', 
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
          this.endCall();

          this.setState({
            finalReaseon: 'Has finalizado la videollamada', 
            finalPrice: Number((this.state.inCallSeconds / 60 ) * this.props.price).toFixed(2),
            finalDuration: this.state.inCallSeconds,
          });
        }
        }
      ]
    );
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
      console.log("Limipiame la cuenta")

      this.setState({inCallSeconds: 0})

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

      this.timeHandling('stop');
      this.inCallingTime('start');

      // Get current peer IDs
      const { peerIds } = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = this.state;

      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
        finalPrice: Number((this.state.inCallSeconds / 60 ) * this.props.price).toFixed(2),
        finalDuration: this.state.inCallSeconds,
        callFinishedByHangout: true, 
        finalReaseon: 'Han finalizado la llamada', 
      });

      this.inCallingTime('stop');

      this.endCall()
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      // this.incommingCallCount(null);
      this.timeHandling('start')

      this.setState({
        joinSucceed: true,
      });
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
    this.setState({finishCallModal: false});

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

      this.setState({ joinSucceed: false, showNotAnsweredAlert: false, dismissCall: true, finishCallModal: false, inCallSeconds: 0});

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
      finalPrice: '0', finishCallModal: false
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

        <Text style = {{marginTop: '10%', color: "gray", textAlign: "center", fontStyle: 'italic', fontWeight: '300', fontSize: 13}}> *Si el usuario no contesta, no se cobrara.</Text>
        <Text style = {{marginTop: 10, color: "gray", textAlign: "center", fontStyle: 'italic', fontWeight: '300', fontSize: 13, marginLeft: 10, marginRight: 10}}> *En caso de que el usuario se quede sin saldo Aldel te notificara 10 segundos antes de finalizar la llamada</Text>

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
    const { joinSucceed, incommingCallSeconds } = this.state;
    
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

        {this._renderRemoteVideos()}  

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
    zIndex: 10,
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
    zIndex: 50,
  },
  remote: {
    width: 100,
    height: 150,
    marginHorizontal: 2.5,
    borderRadius: 10,
    zIndex: 50,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  continueButton: {
    backgroundColor: "#03B388", 
    position: 'absolute', 
    padding: 10,
    bottom: 10, 
    left: 10, 
    right: 10
  }
});
