import React from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
//local imports
import ConsultorAdmin from './consultor';
import ClientAdmin from "./client";

function Profile(props) {

        const { adminData } = props;

        return(
            <View style = {styles.container}>
                {
                    adminData.iDtipoUsuario == 3 ? 
    
                        <ConsultorAdmin {...props}/>
                    : 
                        <ClientAdmin {...props}/>
                }
            </View>
        );
}

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData,
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? 19 : 10,
      backgroundColor: "#f5f5f5"
    }
});


export default connect(mapStateToProps)(Profile);
