import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';
const LogoutScreen = ({ setIsLoggedIn }) => {
    const navigation = useNavigation();

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();
    }, []);



    const handleLogout = async () => {

        try {
            // Envoyez une demande de déconnexion à votre API côté serveur
            const response = await client.post('/api/auth/logout');

            if (response.status === 200) {
                // La déconnexion a réussi
                // Effacez les informations d'authentification stockées localement si nécessaire
                await AsyncStorage.removeItem('token');
                setIsLoggedIn(false);
                // Redirigez l'utilisateur vers l'écran de connexion
                navigation.navigate('Login');
                // Supprimez le token d'authentification ou d'autres données de session côté client
            } else {
                // Gérez les erreurs ici en fonction de la réponse de l'API
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
            // Gérez les erreurs ici (par exemple, affichez un message d'erreur à l'utilisateur)
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.question}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <Button style={{ width: 150, margin: 5, borderColor: '#d9252c', backgroundColor: '#d9252c' }}
                textColor="white"
                icon="logout"
                mode="contained" title="Déconnexion" onPress={handleLogout} > Déconnexion</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    question: {
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary
    }
});

export default LogoutScreen;
