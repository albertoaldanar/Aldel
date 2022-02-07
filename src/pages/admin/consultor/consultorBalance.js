import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Switch, TextInput, Alert, FlatList, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useStripe} from '@stripe/stripe-react-native';
import DialogInput from 'react-native-dialog-input';
import DropDownPicker from 'react-native-dropdown-picker';

import API_URL from '../../../apis/url';
import API from '../../../apis/payment/payment';
import Wallet from '../../../assets/wallet.png';

function ConsultorBalance(props) {
        
        const date = new Date();
        let currentMonth = date.getMonth() + 1;
        let currentYear = date.getFullYear();

        const months = [
            {label: 'Enero', value: 1}, {label: 'Febrero', value: 2}, {label: 'Marzo', value: 3}, {label: 'Abril', value: 4}, 
            {label: 'Mayo', value: 5}, {label: 'Junio', value: 6}, {label: 'Julio', value: 7}, {label: 'Agosto', value: 8}, 
            {label: 'Septiembre', value: 9}, {label: 'Octubre', value: 10}, {label: 'Noviembre', value: 11}, {label: 'Diciembre', value: 12}
        ];
        const years = [
            {label: '2021', value: 2021}, {label: '2022', value: 2022}
        ];
        const [monthsSelected, setMonthSelected] = useState(currentMonth);
        const [yearSelected, setYearSelected] = useState(currentYear);
        const [open, setOpen] = useState(false);
        const [yearsOpen, setYearsOpen] = useState(false);
        const [incomeThisMonth, setIncomeThisMonth] = useState(0);
        const [incomeLoaded, setIncomeLoaded] = useState(false);
        const insets = useSafeAreaInsets();
        const {initPaymentSheet, presentPaymentSheet} = useStripe();
        const [showAmountInput, setShowAmountInput] = useState(false);
        const [loading, setLoading] = useState(false);
        const [clientSecret, setClientSecret] = useState(''); 
        const [ transactions, setTransactions ] = useState([]);
        const [messagesBalance, setMessagesBalance] = useState({channel: "Mensaje", amount: 0});
        const [voiceNoteBalance, setVoiceNoteBalance] = useState({channel: "Notas de Voz", amount: 0});
        const [callBalance, setCallBalance] = useState({channel: "Llamada", amount: 0});
        const [videoCallBalance, setVideoCallBalance] = useState({channel: "Videollamada", amount: 0});
        const [videoBalance, setVideoBalance] = useState({channel: "Videos", amount: 0});
        const [imageBalance, setImageBalance] = useState({channel: "Imagenes", amount: 0});
        const [channelsLoading, setChannelStatsLoading] = useState(false);
        const [channelsReady, setChannelsReady] = useState(false);
        const [channelList, setChannelList] = useState([]);
        const [loaded, setLoaded] = useState(false);
        const [showWithdrawModal, setShowWithdrawModal] = useState(false);
        const { balanceData, adminData } = props;

        useEffect(() => {
            getTransactions();
        }, []);

        function channelIcon(channel){
            switch (channel) {
                case "Mensaje":
                    return "comments"
                case "Videollamada":
                    return "tv"
                case "Llamada":
                    return "phone"
                case "Notas de Voz":
                    return "microphone"
                case "Imagenes":
                    return "photo"
                case "Videos":
                    return "play"
                default:
                  return ""
            }
        }

        async function getTransactions(){
            try {
                const transactionResponse = await API.getTransactionsConsultor(adminData.idUsuario);
                if (transactionResponse.status == 200) {
                    console.log("transaction", transactionResponse);

                    setTransactions(transactionResponse.data)
                    setLoaded(true);

                    getIncomeFiltered();

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

        async function getIncomeFiltered(){
            setIncomeLoaded(false);

            try {
                const transactionResponse = await API.getIncomeByMonth(adminData.idUsuario, monthsSelected, yearSelected);

                if (transactionResponse.status == 200) {   
                    setIncomeLoaded(true);
                    setIncomeThisMonth(transactionResponse.data.ingresos) 
                    getChannelsStats();
                } else{
                    setIncomeLoaded(true);
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

        async function getChannelsStats(){

            setChannelStatsLoading(true);

            try {
                const transactionResponse = await API.getConsultorChannelsStats(adminData.idUsuario);
                if (transactionResponse.status == 200) {
                   
                    analyzeChannelData(transactionResponse.data);

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

        function analyzeChannelData(channelsStats){

            console.log("channelstats =>", channelsStats)
            channelsStats.map(channel => {
                switch (channel.id_tipo_interaccion) {
                    case 3:
                        return setMessagesBalance(prevState => ({...prevState, amount: channel.ganancias.toFixed(2)}));
                        break;
                    case 1:
                        return setVideoCallBalance({channel: "Videollamada", amount: channel.ganancias.toFixed(2)});
                        break;
                    case 2:
                        return setCallBalance({channel: "Llamada", amount: channel.ganancias.toFixed(2)});
                        break;
                    case 4:
                        return setVoiceNoteBalance({channel: "Notas de Voz", amount: channel.ganancias.toFixed(2)});
                        break;
                    case 5:
                        return setImageBalance({channel: "Imagenes", amount: channel.ganancias.toFixed(2)});
                        break;
                    case 6:
                        return setVideoBalance({channel: "Videos", amount: channel.ganancias.toFixed(2)});
                        break;
                    default:
                      return ""
                  }
            });

            setChannelStatsLoading(false);
            setChannelsReady(true);
        }

        const renderItem = ({ item, index }) => (
            <View>
                <View style = {{backgroundColor: "white", marginTop: 14, padding: 15, borderRadius: 10}}>
                    <Text style = {{color: "gray", fontSize: 12, marginBottom: 10}}>{item.fecha_hora}</Text>
                    <View style = {{flexDirection: "row"}}>
                        <Text>  Retiro de</Text>
                        <Text style = {{color: "#DC143C" }}> - { Number(item.valor).toFixed(2)} $</Text>
                    </View> 
                </View> 
            </View>
        );

        const renderItemChannel = ({ item, index }) => (
            <View style = {{backgroundColor: "white", marginTop: 14, padding: 8, borderRadius: 10}}>
                <Text style = {{color: "gray", fontSize: 13, fontWeight: "400"}}> <Icon name = {channelIcon(item.channel)}/> {item.channel} </Text>
                <View style = {{flexDirection: "row"}}>
                    <Text style = {{color: "black", fontWeight: "300", margin: 15, fontSize: 15}}>$ {Number(item.amount).toFixed(2)}</Text>
                </View>
                
            </View> 
        );

        return(
            <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>                 
                <View style = {{flexDirection:"row"}}>
                    <TouchableOpacity style = {{margin: 35, marginLeft: 12, marginBottom: 0, fontSize: 18, fontWeight: "700", marginTop: Platform.OS == "android" ? 45 : 41, marginRight: 15}} onPress = {() => props.navigation.goBack()}>
                        <Icon name= "arrow-left" size= {18} color = "black"/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25, fontWeight: "700", margin: 35, marginBottom: 10, marginLeft: 0}}>
                        Balance
                    </Text>
                </View>

                <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                    Aqui puedes ver toda la información financiera de tu cuenta. (El retiro minimo es de $ 100.00 MXN)
                </Text>

                <ScrollView style = {{felx: 1}}>

                    <View>
                        <Text style = {{color: "black", fontWeight: "700", textAlign: "center", margin: 15, fontSize: 29, marginBottom: 5}}>$ {Number(balanceData.balance).toFixed(2)}  MXN</Text>
                        <Text style = {{fontSize: 12, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 0, fontStyle: "italic"}}>
                            A este monto ya se le ha descontado la comision de 20% de aldel.
                        </Text>
                    </View> 

                    <TouchableOpacity style = {{backgroundColor: "#03B388", borderRadius: 5, padding: 5, width: "50%", alignSelf: "center", marginBottom: 30}} onPress = {() => props.navigation.navigate("Withdraw", {userId: adminData.idUsuario})}>
                        <Text style = {{textAlign: "center", color: "white"}}>Retirar</Text>
                    </TouchableOpacity>

                    {/* <Text style = {{fontSize: 14, fontWeight: "400", margin: 15, color: "gray", marginLeft: 20, marginTop: 10, fontStyle: "italic"}}>
                        Aldel cobrara el 20% de comision sobre cada retiro
                    </Text> */}

                    <Text style = {styles.infoTitle}> Historial de retiros </Text>

                    <View>
                        {
                            loaded ? 
                                transactions.length > 0 ?
                                    <FlatList
                                        style = {{marginLeft: 20, marginRight: 20, marginTop: 10}}
                                        data={transactions}
                                        keyExtractor={(item) => item.amount}
                                        renderItem={renderItem}
                                    />
                                :
                                    <View style = {{marginTop: 30}}>
                                        <Image source = {Wallet} style = {{height: 150, width: 150, alignSelf: "center"}}/>
                                        <Text style = {{alignSelf: "center", color: "gray", fontStyle: "italic", fontSize: 12}}>No tienes ningun registro de retiro.</Text>
                                    </View>
                            : 
                                null
                        }
                    </View>  

                    <Text style = {styles.infoTitle}> Ingresos por mes </Text>
                    
                    <View style = {{ marginLeft: 5, marginRight: 20, marginTop: 15, zIndex: 20, flexDirection: "row", justifyContent: "space-around", minHeight: 80}}>
                        <DropDownPicker
                            listMode="MODAL"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            open={open}
                            value={monthsSelected}
                            setOpen={setOpen}
                            items={months}
                            setValue={setMonthSelected}
                            zIndex = {1000}
                            containerStyle={{
                                width: "35%"
                            }}
                            modalProps={{
                                animationType: "slide"
                            }}
                        />

                        <DropDownPicker
                            listMode="MODAL"
                            modalProps={{
                                animationType: "slide"
                            }}
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            open={yearsOpen}
                            value={yearSelected}
                            setOpen={setYearsOpen}
                            items={years}
                            setValue={setYearSelected}
                            zIndex = {1000}
                            containerStyle={{
                                width: "35%"
                            }}
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}

                        />

                        <TouchableOpacity style = {{marginTop: 12}} onPress = {() => getIncomeFiltered()}>
                            <Icon name ="search" color= "black" size = {20}/>
                        </TouchableOpacity>
                    </View>
                        
                    <View style = {{backgroundColor: "white", marginTop: 14, padding: 8, borderRadius: 10, marginLeft: 20, marginRight: 20}}>
                        <View style = {{flexDirection: "row"}}>
                            {
                                !incomeLoaded ?
                                    <ActivityIndicator size="large" color="black" style = {{justifyContent: "center"}}/>
                                :
                                    <Text style = {{color: "black", fontWeight: "300", margin: 15, fontSize: 15}}>$ {(incomeThisMonth).toFixed(2)}</Text>
                            }
                        </View>
                    </View> 
                        

                    <Text style = {styles.infoTitle}> Ingreso por canal </Text>
                    {
                        channelsReady ?
                            <FlatList
                                style = {{marginLeft: 20, marginRight: 20, marginTop: 10}}
                                data={[imageBalance, videoBalance, videoCallBalance, voiceNoteBalance, messagesBalance, callBalance]}
                                keyExtractor={(item) => item.amount}
                                renderItem={renderItemChannel}
                            />
                        : null
                    }

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
        color: "gray", fontSize: 16, fontWeight: "bold", marginLeft: 14, marginTop: 20, fontStyle: "italic", marginBottom: 8
    }

});

const mapStateToProps = (state) => {
    return {
        balanceData: state.balanceData,
        adminData: state.adminData,
    }
}


export default connect(mapStateToProps)(ConsultorBalance);
