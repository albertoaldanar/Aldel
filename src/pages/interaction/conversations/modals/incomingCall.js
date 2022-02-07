import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

function IncomingCall(props) {

    const { visibleModal } = props;

    return (
        <Modal
            visible={visibleModal}
            animationType= "fade"
            onRequestClose={() => {
               //  alert('Modal has been closed.');
              }}
        >

            <FastImage
                style = {{ width: 200, height: 200, alignSelf: 'center', marginTop: '30%', borderRadius: 50}}
                source = {{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/aldel-13924.appspot.com/o/profileEmpty.png?alt=media&token=17db22ff-7c37-4246-a3c7-209a179d5086',
                    headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal
                }} 
            />

            <View style = {{marginTop: 25}} >
                <Text style = {{textAlign: "center", fontSize: 20}}>Alberto Aldana</Text>
                <Text style = {{marginTop: 12, fontSize: 14, fontWeight: '300', textAlign: 'center'}}> <Icon name = 'tv'/>  Videollamada</Text>
            </View>

            <View style = {styles.container}>
                <View style = {styles.buttons}>
                    <View>
                        <TouchableOpacity style = {styles.answer}>
                            <Icon name ="phone" size = {30} color= 'white'/>
                        </TouchableOpacity>
                        <Text style = {{textAlign: 'center', fontSize: 13, fontWeight: '300', marginTop: 10}}>Contestar</Text>
                    </View>

                    <View>
                        <TouchableOpacity style = {styles.decline}>
                            <Icon name ="times" size = {30} color= 'white'/>
                        </TouchableOpacity>

                        <Text style = {{textAlign: 'center', fontSize: 13, fontWeight: '300', marginTop: 10}}>Ignorar</Text>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }, 
    buttons: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        position: 'absolute', 
        bottom: '20%', 
        width: '100%'
    }, 
    answer: {
        borderRadius: 20, 
        padding: 20, 
        alignItems: "center", 
        backgroundColor: '#03b388'
    }, 
    decline: {
        borderRadius: 20, 
        padding: 20, 
        alignItems: "center", 
        backgroundColor: '#DC143C'
    }
});

export default IncomingCall;

