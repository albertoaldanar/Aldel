import React from 'react';
import { View, Text, Image } from 'react-native';
import Modal from "react-native-modal";
import NoInternet from '../assets/noInternet.png';
function NoInternetModal(props) {
    const { visibleModal } = props;

    return (
        <Modal 
            transparent={true}
            isVisible={visibleModal}
            style = {{backgroundColor: "white", marginTop: "50%", marginBottom: "50%", borderRadius: 20}}
        >
            <Image source = {NoInternet} style = {{height: 100, width: 100, alignSelf: "center"}}/>
            <Text style = {{fontSize: 15, fontWeight: "bold", marginTop: 15, textAlign: "center"}}>No tienes conexión a internet</Text>
            <Text style = {{fontSize: 12, fontWeight: "400", marginTop: 7, textAlign: "center", color: "gray", marginLeft: 20, marginRight: 20}}>Asegura tu conexión para poder brindarte el mejor servicio.</Text>
        </Modal>
    )
}

export default NoInternetModal;
