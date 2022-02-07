import React, {useState} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image, FlatList, Modal} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import RequestDescription from './requestDescription';
import DefaultUser from '../../../../assets/default_user.png';

function RequestListClient(props) {

        const [showDescription, setShowDescription] = useState(false);
        const [requestSelected, setRequestSelected] = useState({});
        
        const { data } = props;

        const selectRequests = request => {
            setRequestSelected(request);
            setShowDescription(true);
        }       
        
        const renderItem = ({ item }) => (
            <TouchableOpacity style = {styles.listItemContainer}  onPress = { 
                () => props.navigation.navigate('RequestClientDescription', {
                    request: item
                })
            }>
                <View style = {{flexDirection: "row", justifyContent: "space-between"}}>
                    
                    <View style = {{flexDirection: "row"}}>
                        <FastImage
                            style={styles.imageStyle}
                            source = {{
                                uri: item.consultor.foto_perfil,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal
                            }} 
                            onLoadEnd={() => {
                                console.log("loaded")
                            }}
                        />
                        <Text style = {{fontWeight: "600", fontSize: Platform.OS == "ios" ? 17 : 17, marginLeft: 10, marginTop: 10}}>{item.consultor.nombre} {item.consultor.apellido_paterno}</Text>
                    </View>
                    
                    <View style = {styles.button} 
                    >
                        <Icon color = "#03b388" size = {16} name= "arrow-right" />
                    </View>
                </View>
            </TouchableOpacity>
        );

        return(
            <View style = {styles.container}>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                /> 
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white", 
      height: "100%"
    },
    imageStyle: {
        height: 40, 
        width: 40,
        marginRight: 5,
        borderRadius: 50
        
    }, 
    listItemContainer: {
        padding: 18, 
        borderRadius: 5, 
        borderColor: "gray",
        borderBottomColor: "#dcdcdc", 
        borderBottomWidth: 0.5, 
    }, 
    button: {
        paddingTop: 16
    }, 

});

export default RequestListClient;
