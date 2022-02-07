import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput, Alert, FlatList } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useStripe} from '@stripe/stripe-react-native';
import DialogInput from 'react-native-dialog-input';
import changeBalanceState from '../../../redux/actions/admin/balanceActions';

import API_URL from '../../../apis/url';
import API from '../../../apis/payment/payment';
import API_ADMIN from '../../../apis/interaction/interaction'
import Wallet from '../../../assets/wallet.png';

function ClientBalance(props) {
    
        const insets = useSafeAreaInsets();
        const {initPaymentSheet, presentPaymentSheet} = useStripe();
        const [showAmountInput, setShowAmountInput] = useState(false);
        const [loading, setLoading] = useState(false);
        const [loaded, setLoaded] = useState(false);
        const [clientSecret, setClientSecret] = useState(''); 
        const { balanceData, adminData, changeBalanceState } = props;
        const [transactionType, setTransactionType] = useState(null);
        const [ transactions, setTransactions ] = useState([]);

        useEffect(() => {
            getTransactions();

            const interval = setInterval(() => {
                getTransactions();
            }, 4000);
            
            return () => clearInterval(interval);
        }, [])

        async function getTransactions(){

            try {
                const transactionResponse = await API.getTransactionsClient(adminData.idUsuario);

                if (transactionResponse.status == 200) {
                    setTransactions(transactionResponse.data);
                    setLoaded(true);

                    updateBalance();
                } else if(transactionResponse.errortipo == -2){
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

        async function updateBalance(){

            const ID = adminData.idUsuario;

            try {
                const consultorInteractionResponse = await API_ADMIN.getInteractionClient(ID);
                
                if(consultorInteractionResponse.status == 200){

                    if(consultorInteractionResponse.data.saldo){
                        changeBalanceState({balance: Number(consultorInteractionResponse.data.saldo).toFixed(2)})
                    } else {
                        changeBalanceState({balance: 0.00})
                    }

                } else {
                     console.log("error");
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
    //*STRIPE---------------STRIPE

        async function depositMoney(input){
            console.log('url', `${API_URL}payment-sheet`);

            console.log("deposit money")
            const response = await fetch(`${API_URL}payment-sheet`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_usuario: adminData.idUsuario, 
                saldo: input
              })
            });

            const { paymentIntent, ephemeralKey, customer } = await response.json();
            // updateBalance();

            // setTimeout(() => {
            //     getTransactions();
            // }, 1500);

            return {
              paymentIntent,
              ephemeralKey,
              customer,
            };
        };

        async function initializePaymentDeposit(input){
            
            console.log("initializePaymentDeposit")

             if(Number(input) < 100){
                return Alert.alert('El deposito minimo es de $100.00 MXN');
            } else {
                setShowAmountInput(false);
                const {paymentIntent, ephemeralKey, customer} =
                await depositMoney(input);
        
                const {error} = await initPaymentSheet({
                    customerId: customer,
                    customerEphemeralKeySecret: ephemeralKey,
                    paymentIntentClientSecret: paymentIntent,
                    merchantDisplayName: 'Aldel.io',
                    merchantCountryCode: 'MX',
                });

                if (!error) {
                    setClientSecret(paymentIntent);
                    setLoading(true);
                    openPaymentSheet();
                } else {
                    console.log(error);
                }
            }

        };
        
        const openPaymentSheet = async () => {

            console.log("openPaymentSheet")
        
            const response = await presentPaymentSheet({clientSecret});
            console.log('response', response);
    
            // if (error) {
            //     if(error.message!== "The payment has been canceled"){
            //         Alert.alert(`Error code: ${error.code}`, error.message);
            //     }
            // }
        };
    //STRIPE---------------STRIPE

        const renderItem = ({ item, index }) => (
            <View>
                <View style = {{backgroundColor: "white", marginTop: 14, padding: 15, borderRadius: 10}}>
                    <Text style = {{color: "gray", fontSize: 12, marginBottom: 10}}>{item.fecha_hora}</Text>
                    <View style = {{flexDirection: "row"}}>
                        <Text> {item.tipo === "agregado_saldo" ? "Deposito de " : "Retiro de " }</Text>
                        <Text style = {{color: item.tipo === "agregado_saldo" ? "#03B388" : "#DC143C" }}> {item.tipo === "agregado_saldo" ? "+ " : "- " }{ Number(item.valor).toFixed(2)} $</Text>
                    </View> 
                </View> 
            </View>
        );

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>

                <DialogInput 
                    isDialogVisible={showAmountInput}
                    title="Deposito"
                    message="Cuanto quieres depositar?"
                    hintInput ={"Cantidad"}
                    submitInput={ (inputText) => {{
                        if(inputText !== undefined ){
                            initializePaymentDeposit(inputText)
                        }
                    }}}
                    submitText = {'Continuar'}
                    textInputProps = {{
                        keyboardType: 'numeric'
                    }}
                    closeDialog={ () => setShowAmountInput(false)}
                >
                </DialogInput>
                 
                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Balance
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Aqui puedes ver todos tus depositos y retiros. (El retiro minimo es de $ 100.00 MXN)
                </Text>

                <ScrollView style = {{height: "100%"}}>

                    <View>
                        <Text style = {{color: "black", fontWeight: "700", textAlign: "center", margin: 15, fontSize: 29}}>$ {Number(balanceData.balance).toFixed(2)}  MXN</Text>
                        <Text style = {{fontSize: 12, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 0, fontStyle: "italic"}}>
                            A todos los retiros se cobrara un 5% por gastos de operación.
                        </Text>
                    </View> 

                    <View style = {{flexDirection: "row", justifyContent: 'space-around', marginTop: 10}}>
                        <TouchableOpacity style = {{backgroundColor: "#DC143C", borderRadius: 5, padding: 5, width: "30%", alignSelf: "center", marginBottom: 30}} 
                            onPress = {() => props.navigation.navigate("Withdraw", {user: adminData})}
                        >
                            <Text style = {{textAlign: "center", color: "white"}}>Retirar</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style = {{backgroundColor: "#03B388", borderRadius: 5, padding: 5, width: "30%", alignSelf: "center", marginBottom: 30}} 
                            onPress = {() => setShowAmountInput(true)}
                        >
                            <Text style = {{textAlign: "center", color: "white"}}>Depositar</Text>
                        </TouchableOpacity>
                    </View>

                    <View>

                        {
                            loaded ? 
                                transactions.length > 0 ?
                                    <>
                                        <Text style = {{color: "gray", fontStyle: "italic", fontSize: 16, fontWeight: "400", marginLeft: 14, marginTop: 20}}> Historial de depostios y retiros </Text>
                                        <FlatList
                                            style = {{marginLeft: 20, marginRight: 20, marginTop: 10}}
                                            data={transactions}
                                            keyExtractor={(item) => item.amount}
                                            renderItem={renderItem}
                                        />
                                    </>
                                :
                                    <View style = {{marginTop: 70}}>
                                        <Image source = {Wallet} style = {{height: 150, width: 150, alignSelf: "center"}}/>
                                        <Text style = {{alignSelf: "center", color: "gray", fontStyle: "italic"}}>No tienes ningun registro de deposito ni retiro.</Text>
                                    </View>
                            : 
                                null
                        }
   
                    </View>                
                </ScrollView>

            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5"
    },
    channelsContainer: {
        marginTop: 30
    },
    saveButton: {
        backgroundColor: "#03B388", position: "absolute", left: 10, right: 10, bottom: 15, padding: 12, 
        borderRadius: 5
    }, 
    infoCard: {
        backgroundColor: "white", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.0,
        padding: 9,
        elevation: 1, textAlignVertical: "top", borderRadius: 5, margin: 15, marginBottom: 4
    },
    infoTitle: {

    }

});

const mapStateToProps = (state) => {
    return {
        balanceData: state.balanceData,
        adminData: state.adminData,
    }
}

const mapDispatchToProps = dispatch => ({
    changeBalanceState: (object) => dispatch(changeBalanceState(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientBalance);
