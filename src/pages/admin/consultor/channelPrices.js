import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
  Switch,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
//local imports
import API from '../../../apis/admin/adminSetup';
import LoaderModal from '../../../utils/modalLoader';
import {
  setChannels,
  changeChannelsState,
} from '../../../redux/actions/admin/channels/channelsActions';

function ChannelPrices(props) {
  const {channelsData, changeChannelsState, setChannels, dictionary} = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState({name: '', price: ''});
  const [errorObject, setErrorObject] = useState({"Videollamada": false, "Llamada": false, "Mensaje": false, "Notas de Voz": false, "Imagenes": false, "Videos": false});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getChannelsData();
  }, []);

  async function getChannelsData() {
    try {
      const ID = await AsyncStorage.getItem('USER');
      const getChannelsResponse = await API.getChannels(ID);

      if (getChannelsResponse.status == 200) {
        setChannels({data: getChannelsResponse.data});
      } else if (getChannelsResponse.errortipo == -2) {
        setLoadingModal(false);
        console.log('error!');
      }
    } catch (err) {
      alert(err);

      if (err instanceof TypeError) {
        if (err.message == 'Network request failed') {
          alert('No hay internet');
          console.log('No hay internet');
        } else {
          alert('El servicio esta fallando.');
          console.log(
            'Ups..',
            'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde',
          );
        }
      }
    }
  }

  function iconName(channel){
    switch (channel.nombre) {
        case "Videollamada" || "Video Llamada": {
            return {icon: "tv", measurament: 'minuto'}
            break;
        }
        case "Llamada": {
            return {icon: "phone", measurament: 'minuto'}
            break;
        }
        case "Mensaje": {
            return {icon: "comments", measurament: 'caracter'}
            break;
        }
        case "Notas de Voz": {
            return {icon: "microphone", measurament: 'minuto'}
            break;
        }
        case "Imagenes": {
            return {icon: "image", measurament: 'unidad'}
            break;
        }
        case "Videos": {
            return {icon: "play", measurament: 'minuto'}
            break;
        }
        default:
          return channel
    }
  }

  function validateMinimumPrice(channel, minimumPrice, currentPrice){
    console.log("numeros", minimumPrice, currentPrice, channel);

    const isValidPrice = currentPrice >= minimumPrice;

    switch (channel) {
      case "Videollamada":
        if(!isValidPrice){
          return setErrorObject((prevState) => ({
            ...prevState,
            Videollamada: true
          }));
        } else {
          return setErrorObject((prevState) => ({
            ...prevState,
            Videollamada: false
          }));
        }
        break;
      case "Llamada": 
        if(!isValidPrice){
          return setErrorObject((prevState) => ({
            ...prevState,
            Llamada: true
          }));
        } else {
          return setErrorObject((prevState) => ({
            ...prevState,
            Llamada: false
          }));
        }
        break;
      case "Mensaje": 
        if(!isValidPrice){
          return setErrorObject((prevState) => ({
            ...prevState,
            Mensaje: true
          }));
        } else {
          return setErrorObject((prevState) => ({
            ...prevState,
            Mensaje: false
          }));
        }
        break;
      case "Notas de Voz": 
        if(!isValidPrice){
          return setErrorObject((prevState) => ({
            ...prevState,
            "Notas de Voz": true
          }));
        } else {
          return setErrorObject((prevState) => ({
            ...prevState,
            "Notas de Voz": false
          }));
        }
        break;
      
      case "Imagenes": 
        if(!isValidPrice){
          return setErrorObject((prevState) => ({
            ...prevState,
            "Imagenes": true
          }));
        } else {
          return setErrorObject((prevState) => ({
            ...prevState,
            "Imagenes": false
          }));
        }
        break;
      case "Videos": 
        if(!isValidPrice){
          return setErrorObject((prevState) => ({
            ...prevState,
            "Videos": true
          }));
        } else {
          return setErrorObject((prevState) => ({
            ...prevState,
            "Videos": false
          }));
        }
        break;
    
      default:
        return channel
    }

  }

  async function changeChannelsData() {

    const validPrices = !errorObject.Llamada && !errorObject.Videollamada && !errorObject['Notas de Voz'] && !errorObject.Videos && !errorObject.Imagenes && !errorObject.Mensaje

    if(validPrices){
      setLoadingModal(true);

      try {
        const changeChannelsResponse = await API.updateChannels(channelsData);
  
        if (changeChannelsResponse.status == 200) {
          setLoadingModal(false);
          props.navigation.goBack();
        } else if (changeChannelsResponse.errortipo == -2) {
          console.log('error!');
        }
      } catch (err) {
        alert(err);
  
        if (err instanceof TypeError) {
          if (err.message == 'Network request failed') {
            alert('No hay internet');
            console.log('No hay internet');
          } else {
            alert('El servicio esta fallando.');
            console.log(
              'Ups..',
              'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde',
            );
          }
        }
      }
    } else {
      Alert.alert('Error', 'Hay valores que no son validos');
    }
  }

  function showRecomendedPrice(item){
      let selectedBasePrice = dictionary.preciosRecomendados[item.nombre];
      
      setShowTooltip(true);
      setSelectedChannel({
        price: selectedBasePrice, 
        name: item.nombre, 
        measurement: item.unidad
      })
  }

  const renderItem = ({item, index}) => (
    <View style={styles.channelsContainer}>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            margin: 15,
            color: 'gray',
            marginLeft: 30,
            marginTop: 10,
            marginBottom: 3,
          }}>
            <Icon name= {iconName(item).icon} size= {14} color =  "gray"/> {item.nombre}{' '}
        </Text>
      </View>

      <TouchableOpacity onPress = {() => showRecomendedPrice(item)}>
        <Text style = {styles.recomendedValue}>Ver precio de mercado</Text>
      </TouchableOpacity>
     
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputStyle}
          autoCorrect={false}
          placeholderTextColor={'#9e9e9e'}
          selectionColor={'#03B388'}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={'done'}
          blurOnSubmit={true}
          value={item.costo}
          keyboardType={'numeric'}
          onChangeText={(text) => {
              changeChannelsState({
                index: item.id_tipo_interaccion,
                value: text,
                type: 'costo',
              })
              validateMinimumPrice(item.nombre, dictionary.preciosMinimos[item.nombre], Number(text));
          }}
        />
        <Text style={{marginTop: 20, marginLeft: -30, color: "gray"}}>$ </Text>
      </View>
      <Text style = {{marginLeft: 30, marginBottom: 6, color: "gray", fontSize: 12, fontWeight: '300'}}>Por {iconName(item).measurament}</Text>
      <Text style = {{marginLeft: 30, marginBottom: 6, color: "red", fontSize: 12, fontWeight: '300'}}>
        {errorObject[item.nombre] ? `El precio minmo de ${item.nombre} es $ ${Number(dictionary.preciosMinimos[item.nombre]).toFixed(2)}` : null }
      </Text>
    </View>
  );

  console.log("dictionary --", dictionary.preciosMinimos, channelsData)

  return (
    <View
      style={styles.container}
      style={[
        styles.container,
        {paddingTop: insets.top - 20, paddingBottom: insets.bottom},
      ]}>
      <LoaderModal visibleModal={loadingModal} text={'Actualizando...'} />
      <AwesomeAlert
        show={showTooltip}
        showProgress={false}
        title= {`Precio de mercado`}
        message= {`El precio promedio de mercado de ${selectedChannel.name}, es de $ ${selectedChannel.price} por ${selectedChannel.measurement}, pero tu puedes asignar el que tu quieras, por encima del precio minimo. Esto solo es un punto de referencia.`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        messageStyle = {{
            textAlign: "center"
        }}
        confirmText="Entendido."
        cancelText="Cancelar"
        cancelButtonColor="red"
        confirmButtonColor="#03b388"
        onConfirmPressed={() => {
          setShowTooltip(false)
        }}
      />
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            margin: 35,
            marginLeft: 12,
            marginBottom: 0,
            fontSize: 18,
            fontWeight: '700',
            marginTop: Platform.OS == 'android' ? 45 : 41,
            marginRight: 15,
          }}
          onPress={() => props.navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 25,
            fontWeight: '700',
            margin: 35,
            marginBottom: 10,
            marginLeft: 0,
          }}>
          Precios Canales
        </Text>
      </View>

      <Text
        style={{
          fontSize: 14,
          fontWeight: '400',
          margin: 15,
          color: 'gray',
          marginLeft: 20,
          marginTop: 10,
          fontStyle: 'italic',
        }}>
        Aqui puedes administrar los precios de tus canales.
      </Text>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: Dimensions.get('window').height * 0.3,
          flexGrow: 1,
        }}
        extraScrollHeight={Dimensions.get('window').height * 0.1}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'android'}>
        <FlatList
          data={channelsData.data}
          keyboardShouldPersistTaps='handled'
          keyExtractor={(item) => item.nombre}
          renderItem={renderItem}
        />
      </KeyboardAwareScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => changeChannelsData()}>
          <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 16}}>
            Guardar cambios
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  channelsContainer: {
    marginTop: 30,
  },
  inputsContainer: {
    flexDirection: 'row',
    marginLeft: 17,
  },
  recomendedValue: {
    color: '#03B388', 
    fontWeight: '300',
    fontSize: 12, 
    marginLeft: 30, 
    marginTop: 4
   },
  inputStyle: {
    backgroundColor: '#ffffff',
    padding: 12,
    paddingRight: 30,
    margin: 10,
    width: '40%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.0,
    paddingTop: 12,
    elevation: 1,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#03B388',
    padding: 12,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  bottomContainer: {
    backgroundColor: '#f5f5f5',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
});

const mapStateToProps = (state) => {
  return {
    channelsData: state.channelsData,
    dictionary: state.dictionaryData
  };
};

const mapDispatchToProps = (dispatch) => ({
  setChannels: (object) => dispatch(setChannels(object)),
  changeChannelsState: (object) => dispatch(changeChannelsState(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelPrices);
