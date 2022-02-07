
import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import { connect } from "react-redux";

import LoaderModal from '../../../utils/modalLoader';
import SuccessWithDraw from '../modals/successWithdraw';
import API from '../../../apis/payment/payment';

function WithdrawModal(props) {

    let defaultBank = 'Escoje un banco'
    let defaultTransactionType = 'Escoje tipo de enumeración'

    const banks = [
        {value: 'Escoje un banco', label: "Escoje un banco"}, {label: 'Actinver', value: 'Actinver'}, {label: 'American Express', value: 'American Express'}, {label: 'Banco Azteca', value: 'Banco Azteca'},  {value: 'BBVA', label: "BBVA"}, {label: 'Banamex', value: 'Banamex'},  
        {label: 'Banca Afirme', value: 'Banca Afirme'}, {label: 'Bancoppel', value: 'Bancoppel'},  {label: 'Banco del Bajío', value: 'Banco del Bajío'}, 
        {label: 'Banregio', value: 'Banregio'}, {label: 'HSBC', value: 'HSBC'},  {label: 'Inbursa', value: 'Inbursa'}, {label: 'INVEX', value: 'INVEX'}, 
        {label: 'Ixe Banco', value: 'Ixe Banco'}, {label: 'Citibank México', value: 'Citibank México'}, {label: 'Santander', value: 'Santander'}, {label: 'ScotiaBank', value: 'ScotiaBank'},
    ];

    const transactionsTypes = [
        {value: 'Escoje tipo de enumeración', label: "Escoje tipo de enumeración"}, {value: 'Tarjeta', label: "Tarjeta"}, {label: 'Clabe interbancaria', value: 'Clabe interbancaria'}, {label: 'No. de cuenta', value: 'No. de cuenta'} 
    ];

    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState(0);
    const [showBanks, setShowBanks] = useState(false);
    const [showTransactionTypes, setShowTransactionTypes] = useState(false);
    const [transactionNumber, setTransactionNumber] = useState('');
    const [bankSelected, setBankSelected] = useState(defaultBank);
    const [transactionTypeSelected, setTransactionTypeSelected] = useState(defaultTransactionType);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [succesfullTransaction, setSuccesfullTransaction] = useState(false);
    const [validationModal, setValidationModal] = useState(false);
    const [validationTitle, setValidationTitle] = useState('');
    const [validationMessage, setValidationMessage] = useState('');


    const { adminData, balanceData } = props;

    async function createWitdhraw(){

        if(Number(balanceData.balance) >= Number(amount)){
            if(!transactionNumber || bankSelected === defaultBank || transactionTypeSelected === defaultTransactionType || (amount === 0 || !amount)){
                
                setValidationModal(true);
                setValidationTitle('Información incompleta');
                setValidationMessage('Favor de llenar toda la información para completar retiro.');
            } else {
                setShowLoadingModal(true);
    
                try {
                    const withDrawResponse = await API.balanecWithdraw(adminData.idUsuario, amount, bankSelected, transactionTypeSelected, transactionNumber);

                    console.log('data ->', adminData.idUsuario, amount, bankSelected, transactionTypeSelected, transactionNumber)
                    console.log("withdraw response ->", withDrawResponse);

                    if (withDrawResponse.status == 200) {   
                        setShowLoadingModal(false);
                        setSuccesfullTransaction(true)
                    } else{
                        console.log("error!")
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
            }
        } else {
            console.log("entro aqui")
            setValidationModal(true);
            setValidationTitle('Error en retiro');
            setValidationMessage('Tu retiro no puede ser mayor a tu balance');
        }
    }

    function handleAfterWithdraw(){
        adminData.iDtipoUsuario === 2 ? 
            props.navigation.navigate("ClientBalance")
        : 
            props.navigation.navigate("ConsultorBalance")

        setTimeout(() => {
            setSuccesfullTransaction(false)
        }, 1000);
    }

    return (
        <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>
                <SuccessWithDraw 
                    isVisible = {succesfullTransaction} 
                    closeModal = {() => handleAfterWithdraw()}
                    bank = {bankSelected}
                    amount = {amount}
                    transactionNumber = {transactionNumber}
                />

                <AwesomeAlert
                    show={validationModal}
                    showProgress={false}
                    title={validationTitle}
                    message= {validationMessage}
                    style = {{textAlign: 'center'}}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Entendido"
                    confirmButtonColor= "#03b388"
                    onConfirmPressed={() => {
                        setValidationModal(false)
                    }}
                />

                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Retiro de {adminData.iDtipoUsuario === 2 ? "saldo" : "ingresos"}
                    </Text>
                </View>

                <LoaderModal visibleModal = {showLoadingModal} text = 'Cargando...'/>

                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        marginTop: 30,
                        marginLeft: 25, 
                        marginRight: 20,
                        paddingBottom: Dimensions.get('window').height * 0.3,
                        flexGrow: 1,
                    }}
                    extraScrollHeight={Dimensions.get('window').height * 0.05}
                    enableOnAndroid={true}
                    enableAutomaticScroll={Platform.OS === 'ios'}
                >
                    <Text style = {styles.title}>Cantidad:</Text>
                    <View style = {{flexDirection: "row", marginBottom: 20}}>
                        <Text style = {{fontSize: 20, marginTop: 25, color: "gray"}}>$</Text>
                        <TextInput
                            value = {amount}
                            keyboardType = 'numeric'
                            placeholder = '0.00'
                            style = {styles.amountInput}
                            returnKeyType = 'done'
                            onChangeText = {text => setAmount(text)}
                        />
                        <Text style = {{fontSize: 20, marginTop:25, color: "gray"}}>MXN</Text>
                    </View>

                    <Text style = {{fontSize: 15, marginRight: 10, color: "gray"}}>Tu balance: ${Number(balanceData.balance).toFixed(2)}</Text>
                    <Text style = {{fontSize: 12, marginRight: 10, color: "gray", marginTop: 10, fontStyle: 'italic'}}>
                        {
                            adminData.iDtipoUsuario === 2 ? `Aldel retendra $${(Number(amount) * .035).toFixed(2)} (3.5%) de este retiro por gastos operativos` : null
                        }
                    </Text>

                    <Text style = {styles.title}>Tipo de numeración:</Text>

                    <DropDownPicker
                        open={showTransactionTypes}
                        value={transactionTypeSelected}
                        setOpen={setShowTransactionTypes}
                        items={transactionsTypes}
                        setValue={setTransactionTypeSelected}
                        containerStyle={{
                            width: "65%",
                        }}
                        listMode="MODAL"
                        modalProps={{
                            animationType: "slide"
                        }}
                    />

                    <Text style = {styles.title}>Banco:</Text>

                    <View style = {{zIndex: 40}}>
                        <DropDownPicker
                            open={showBanks}
                            value={bankSelected}
                            setOpen={setShowBanks}
                            items={banks}
                            setValue={setBankSelected}
                            containerStyle={{
                                width: "65%", 
                                zIndex: 10
                            }}
                            listMode="MODAL"
                            modalProps={{
                                animationType: "slide"
                            }}
                        />
                    </View>
                    {
                        transactionTypeSelected !== defaultTransactionType ?
                            <>
                            <Text style = {styles.title}>{transactionTypeSelected}:</Text>
                                <TextInput
                                    value = {transactionNumber}
                                    placeholder = '4242 4242 4242 4242'
                                    keyboardType = 'numeric'
                                    returnKeyType = 'done'
                                    style = {[styles.amountInput, {width: '100%'}]}
                                    onChangeText = {text => setTransactionNumber(text)}
                                />
                            </>
                        : 
                            null
                    }
                </KeyboardAwareScrollView>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={
                            () => createWitdhraw()
                        }
                    >
                    <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 16}}>
                        Generar retiro 
                    </Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5"
    },
    amountInput: {
        padding: 20,
        paddingBottom: 10, 
        marginTop: 0,
        borderBottomColor: "gray", 
        borderBottomWidth: 0.3, 
        width: '65%', 
        fontSize: 22
    },
    title: {
        fontWeight: '300', 
        fontSize: 20, 
        marginBottom: 15, 
        marginTop: 50
    }, 
    infoContainer:  {
        marginTop: 30,
        marginLeft: 25, 
        marginRight: 20
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
        balanceData: state.balanceData,
        adminData: state.adminData,
    }
}

export default connect(mapStateToProps)(WithdrawModal);
