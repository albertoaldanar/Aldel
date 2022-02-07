import React, {useState} from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';

function ImageModal(props) {

    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Modal
            visible={props.visibleModal}
        >
            <TouchableOpacity style = {{position: "absolute", top: 40, left: 20, zIndex: 2}} onPress = {() => props.cleanModal()}>
                <Text style = {{color: "red", fontSize: 20}}>X</Text>
            </TouchableOpacity>

            <View>
                <ActivityIndicator size="large" color="black" style = {{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}} />
                
                <FastImage
                    style = {{height: "100%", width: "100%", resizeMode: 'contain'}}
                    resizeMode={"contain"}
                    source = {{
                        uri: props.image,
                        headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal
                    }} 
                    onLoadEnd={() => {
                        setImageLoaded(true)
                    }}
                />
            </View>
        </Modal>
    )
}

export default ImageModal;
