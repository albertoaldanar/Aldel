import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';

function VideoFullScreen(props) {

    const [isLoaded, setIsLoaded] = useState(false);

    const { mediaReference, visibleModal, closeModal } = props;


    function onDismissVideo(){
        closeModal();
        setIsLoaded(false);
    }

    return (
        <Modal 
            visible = {visibleModal}
            animationType = "slide" 
        >   
            <View style = {{flex: 1, backgroundColor: "black"}}>

                {
                    Platform.OS === 'android' ?
                        <TouchableOpacity style = {{position: "absolute", left: 20, top: 35, zIndex: 20}} onPress = {() => onDismissVideo()}>
                            <Text style = {{ color: "white", fontSize: 18 }}>X</Text>
                        </TouchableOpacity>
                    : null
                }

                {
                    !isLoaded ?
                        <ActivityIndicator size="large" color="white" style = {{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 20}} />
                    : null
                }

                <View>
                    <Video
                        source={{ uri: mediaReference }}
                        resizeMode={"contain"}
                        style = {{borderRadius: 10, height: '100%'}}
                        controls={true}
                        onLoad = {() => setIsLoaded(true)}
                        paused={true}
                        onFullscreenPlayerDidDismiss = {() => onDismissVideo()}
                        onFullscreenPlayerWillDismiss = {() => onDismissVideo()}
                    />  
                </View>
            </View>
        </Modal>
    )
}

export default VideoFullScreen;
