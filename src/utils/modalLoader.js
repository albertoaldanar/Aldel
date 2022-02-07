import React from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';

function LoaderModal(props) {

    return (
        <Modal transparent={true}
            visible={props.visibleModal}
            onRequestClose={() => {
               //  alert('Modal has been closed.');
              }}
        >
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

            }}>
                <View style={{
                    borderRadius: 10,
                    backgroundColor: 'rgba(52, 52, 52, 0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 20
                }}>

                    <View style={{ padding: 20 }}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={{ marginTop: 20, color: 'white' }}>{props.text}</Text>
                    </View>

                </View>
            </View>


        </Modal>
    )
}

export default LoaderModal;
