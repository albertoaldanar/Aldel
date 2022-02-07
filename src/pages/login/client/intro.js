import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Platform, TextInput, TouchableOpacity} from "react-native";
import { Pages } from 'react-native-pages';

//local imports
import CreditCard from '../../../assets/payment.gif';
import VideoCallMobile from '../../../assets/videocall-mobile.jpg';
import Verified from '../../../assets/verified.gif';

function Intro(props) {
    console.log(props);
    
    useEffect(() => {
        if(Platform.OS== "android"){
            StatusBar.setBarStyle( 'dark-content',true)
            StatusBar.setBackgroundColor("white")
        }      
    })

    return(
        <View style = {styles.container}>

            <Pages
                indicatorColor = "#03b388"
                containerStyle= {{marginBottom: 130}}
            >

                <View style={{ flex: 2, backgroundColor: 'white' }} >
                    <Image style = {[styles.imageStyle, {height: 250, width: 250}]} source = {Verified}/>
                    <Text style = {{fontSize: 23, fontWeight: "400", textAlign: "center",  margin: Platform.OS == "android" ? 5 : 10, marginTop: 35}}>
                        Acceso a lo mejor
                    </Text>

                    <Text style = {{fontSize: 13, fontWeight: "400", textAlign: "center", color: "gray", fontStyle: "italic", marginLeft: 15, marginRight: 15}}>
                       Interactua con instructores, influencers, famosos y todo tipo de usuarios destacados y verificados de Aldel.
                    </Text>
                </View>

                {/* <View style={{ flex: 2, backgroundColor: 'white' }} >
                    <Image style = {[styles.imageStyle, {height: 310, width: 280}]} source = {VideoCallMobile}/>
                    <Text style = {{fontSize: 23, fontWeight: "400", textAlign: "center",  margin: Platform.OS == "android" ? 5 : 10, marginTop: 35}}>
                        Monetiza tu tiempo (CLIENTE)
                    </Text>

                    <Text style = {{fontSize: 14, fontWeight: "400", textAlign: "center", color: "gray", fontStyle: "italic", marginLeft: 15, marginRight: 15}}>
                       Monetiza tu interacción con usuarios de Aldel ya sea por mensaje, llamada o video llamada.
                    </Text>
                </View> */}

                <View style={{ flex: 2, backgroundColor: 'white' }} >
                    <Image style = {[styles.imageStyle, {height: 250, width: 250}]} source = {CreditCard}/>

                    <View style = {{marginTop: 55}}>
                        <Text style = {{fontSize: 23, fontWeight: "400", textAlign: "center",  margin: Platform.OS == "android" ? 5 : 10, marginTop: 35}}>
                            Paga lo justo
                        </Text>

                        <Text style = {{fontSize: 13, fontWeight: "400", textAlign: "center", color: "gray", fontStyle: "italic", marginLeft: 15, marginRight: 15}}>
                            Aldel se cobra por minuto de interacción, por lo cual pagas justo por el tiempo que se te brindo.
                        </Text>
                    </View>
                </View>
            </Pages>

            <TouchableOpacity style = {styles.loginButton} onPress = {() => props.navigation.navigate("Step1MainDataClient")}>
                <Text style = {styles.textButton}>Continuar</Text>
            </TouchableOpacity>
             
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    imageStyle: {
        width: 200,
        height: 200,
        marginTop: '30%',
        alignSelf: "center", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    inputsContainers: {
        marginTop: 60, 
        marginRight: 20
    }, 
    inputStyle: {
        height: 40,  margin: 10, width: "100%", borderColor: 'gray', 
        borderWidth: 0, marginTop: 20, 
        marginBottom: 10,  color: "black", borderRadius: 5, padding: 9, 
        backgroundColor: "#f5f5f5", marginRight: 10
    }, 
    loginButton: {
        position: "absolute", bottom: 30, left: 15, right: 15, padding: 15, backgroundColor: "#03b388",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 
    textButton: {
        textAlign:"center", color: "white", fontSize: 14
    }
});


export default Intro;
