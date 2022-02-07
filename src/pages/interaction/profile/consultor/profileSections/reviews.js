import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Reviews(props) {

    const insets = useSafeAreaInsets();

    const renderReviews = ({item}) => (
        <View style = {{ padding: 12, backgroundColor: "#f5f5f5", marginBottom: 15, borderRadius: 10}}>
            <View style = {{flexDirection: "row"}}>
                <Text style = {{margin: 5}}>{item.nombre}</Text>
                <AirbnbRating
                    defaultRating = { props.type === 'client' ? item.estrellas_cliente : item.estrellas_consultor}
                    count={5}
                    showRating = {false}
                    size={15}
                    isDisabled
                />
            </View>
            <Text style = {styles.category}> {props.type === 'client' ? item.comentario_cliente : item.comentario_consultor}</Text>
        </View>
    );

    return(
        <View style = {[styles.container, {paddingTop: insets.top -20, paddingBottom: insets.bottom}]}>

            <TouchableOpacity onPress = { () => props.closeModal(false)} style = {{marginBottom: 30, padding: 5, marginTop: 10}}>
                <Text>X</Text>
            </TouchableOpacity>

            <FlatList 
                data = {props.reviews} 
                renderItem = {renderReviews}
                keyExtractor = {item => item.stars} 
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white", 
      height: "100%", 
      padding: 10
    }, 
    category: {
        margin: 5, 
        fontStyle: "italic", 
        color: "gray"
    }

});

export default Reviews;
