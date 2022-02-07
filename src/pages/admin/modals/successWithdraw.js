
import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Checkgreen from '../../../assets/green-check.gif'

function SuccessWithdraw(props) {

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const { isVisible, transactionNumber, amount, bank, folio, closeModal } = props;
    const insets = useSafeAreaInsets();

    return (
        <Modal visible = {isVisible} animationType = "slide">
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
                
                <View style = {{marginTop: '30%'}}>
                    <Image 
                        source = {Checkgreen}
                        style = {{width: 150, height: 150, alignSelf: 'center', borderRadius: 100}}
                    />
                    <Text style = {styles.title}>Tu retiro se ha registrado con exito!</Text>    
                    <Text style = {styles.subTitle}>Esta transferencia se realazira en un lapso maximo de dos dias habiles.</Text>
                </View>

                <View style = {styles.transactionData}>
                    <Text style = {styles.transactionText}>Folio: 1502902</Text>
                    <Text style = {styles.transactionText}>Fecha: {date}</Text>
                    <Text style = {styles.transactionText}>Banco: {bank}</Text>
                    <Text style = {styles.transactionText}>Terminación: *{transactionNumber.substr(transactionNumber.length - 4)}</Text>
                    <Text style = {styles.transactionText}>Monto: ${Number(amount).toFixed(2)}</Text>
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                            onPress={
                                () => closeModal()
                            }
                    >
                        <Text style={{textAlign: 'center', fontSize: 16, color: "white"}}>
                            Continuar 
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#03B388"
    },
    title: {
        fontWeight: '300', 
        fontSize: 25, 
        textAlign: 'center', 
        marginBottom: 15,
        marginTop: 25, 
        color: "white"
    }, 
    transactionData: {
       alignItems: "center", 
       marginTop: '10%'
    },
    transactionText:{
        marginBottom: 10, 
        color: "white"
    },
    subTitle:{
        fontWeight: '300', 
        fontSize: 14, 
        textAlign: 'center', 
        marginBottom: 35, 
        color: "white",
        marginLeft: 30, marginRight: 30
    },
    saveButton: {
        backgroundColor: "#03B388",
        padding: 12,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    bottomContainer: {
        backgroundColor: '#03B388',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        padding: 12,
    },

});

export default SuccessWithdraw;
