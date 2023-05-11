
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../API/client';



const Drawer = createDrawerNavigator();


const homeScreen = () => {
    const [demandes, setDemandes] = useState([])
    const [token, setToken] = useState('');



    const getDemande = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const result = await client.get("/api/auth/demande/demandes", {
                headers: {
                    Authorization: token,
                },
            })

            console.log("Result:", result.data);
            return result.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getDemande();
            setDemandes(result);
            console.log("demandes", result);
        };
        fetchData();
    }, []);


    return (
        <ScrollView style={styles.container}>

            {demandes.map((demande) => (
                <View key={demande.id}>
                    <Text>Date de la demande : {demande.dateCreation}</Text>

                </View>
            ))}
        </ScrollView>

    )
}

export default homeScreen

const styles = StyleSheet.create({})