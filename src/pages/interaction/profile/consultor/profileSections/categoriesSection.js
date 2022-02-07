import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

function CategoriesSections(props) {

    const renderCategories = ({item}) => (
        <View style = {{flexDirection: "row", justifyContent: "space-between", borderRadius: 50, }}>
            <Text style = {styles.category}> {item.nombre}</Text>
        </View>
    );

    return(
        <View style ={styles.container}>

            <FlatList 
                data = {props.categories} 
                renderItem = {renderCategories}
                keyExtractor = {item => item.canal} 
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white", 
      padding: 20
    }, 
    category: {
        color: "gray", 
        backgroundColor:"#f5f5f5", 
        padding: 10,
        margin: 5
    }

});


export default CategoriesSections;
