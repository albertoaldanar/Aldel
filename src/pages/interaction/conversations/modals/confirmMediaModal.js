import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';

function ConfirmMediaModal(props) {

    const { mediaType, file, visibleModal, saveMedia, usage } = props;

    return (
        <Modal
            visible={visibleModal}
            animationType= "fade"
            onRequestClose={() => {
               //  alert('Modal has been closed.');
              }}
        >
            {
                mediaType === "Image" ? 
                    <View style = {{height: "100%", backgroundColor: "black"}}>
                        {
                            props.price? 
                                <Text style = {{alignSelf: "center", position: 'absolute', color: 'white', top: '5%', backgroundColor: "black", padding: 15, zIndex: 20}}>$ {Number(props.price).toFixed(2)}</Text>
                            : null
                        }
                        
                        <Image source = {{uri: file.uri}} style = {{height: "75%", width: "100%", resizeMode: 'contain', marginTop: "10%"}}/>

                        <View style = {{position: 'absolute', bottom: "10%", flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                            <TouchableOpacity onPress = {() => saveMedia()}>
                                <Text style = {{color: "white", fontSize: 20}}>Enviar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress = {() => props.cleanModal()}>
                                <Text style = {{color: "white", fontSize: 20}}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                :
                    <View style = {{height: "100%", backgroundColor: "black", paddingTop: "50%"}}>

                        <Video
                            source={{ uri: file.uri }}
                            resizeMode={"contain"}
                            style = {{borderRadius: 10, height: '50%'}}
                            controls={true}
                            paused={true}
                        />

                        {
                            props.price? 
                                <Text style = {{alignSelf: "center", position: 'absolute', color: 'white', top: '20%', backgroundColor: "black", padding: 15, zIndex: 20}}>$ {Number(props.price).toFixed(2)}</Text>
                            : null
                        }
                        

                        <View style = {{position: 'absolute', bottom: "10%", flexDirection: "row", justifyContent: "space-around", width: "100%"}} >
                            <TouchableOpacity 
                                onPress = {() => saveMedia()}
                            >
                                <Text style = {{color: "white", fontSize: 20}}> {usage === "adminPhoto" ? "Seleccionar" : "Enviar"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress = {() => props.cleanModal()}>
                                <Text style = {{color: "white", fontSize: 20}}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            }

        </Modal>
    )
}

export default ConfirmMediaModal;
