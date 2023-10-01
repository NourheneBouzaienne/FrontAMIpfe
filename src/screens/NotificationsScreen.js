import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';

import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


const NotificationsScreen = () => {
    const navigation = useNavigation();

    const [quittances, setQuittances] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState('');


    async function registerForPushNotificationsAsync() {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'e0b18a9c-19b8-4768-b3e8-24da9c1981f4' })).data;
        console.log('Expo Push Token:', token);
        setExpoPushToken(token)
    }
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);


    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();

    }, [])

    const getNotifications = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const result = await client.get("/api/notifications", {
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

    const fetchData = async () => {
        const result = await getNotifications();
        setNotifications(result);
        console.log("notifications", result);
    };

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();

        fetchData();
    }, []);

    useEffect(() => {
        //registerForPushNotifications();
        fetchQuittances();
    }, []);

    /* const registerForPushNotifications = async () => {
        try {
            const { status } = await Notifications.getPermissionsAsync();
            console.log(status)
            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    console.warn('La permission de notification push n\'a pas été accordée.');
                    return;
                }
            }
        } catch (error) {
            console.error('Erreur lors de la demande de permission de notification push:', error);
        }
    };

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    }); */

    // Écouter les notifications reçues en arrière-plan
    //Notifications.addNotificationReceivedListener(fetchData);

    const fetchQuittances = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const cin = await AsyncStorage.getItem('cin'); // Récupérer le CIN de l'utilisateur depuis AsyncStorage
            if (cin.trim() !== '') {
                const response = await client.get('/api/Quittance/listQuittanceNonP', {
                    headers: {
                        Authorization: token,
                    },
                });
                setQuittances(response.data);
            }
            console.log(quittances)

        } catch (error) {
            console.error('Error fetching quittances:', error);
        }
    };
    const formatDate = (dateString) => {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}/${month}/${year}`;
    };
    const renderItemQuittances = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Détails de votre contrat', { item: item })}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.importantTitle}> Nouvelle quittance {item.NUMQUITT}</Text>
                        <Text style={styles.time}>Produit : {item.LIBPRDT}</Text>
                        <Text style={styles.time}>Contrat : {item.NUMCNT}</Text>
                        <Text style={styles.time}>Montant : {item.MNTPRNET}</Text>
                        <View>
                            <Button style={{ marginLeft: '10%', width: 250, backgroundColor: 'white', marginTop: 10 }}
                                textColor="#204393"
                                labelStyle={{ fontFamily: 'Montserrat-Regular' }}
                                mode="contained"
                                onPress={() => navigation.navigate('Mes quittances')}
                            > Liste des quittances </Button>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
    const renderItemNotifications = ({ item }) => (
        <Card>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View >
                        <Text style={styles.importantTitle}>{item.title}</Text>
                        <Text style={styles.contenu}>{item.contenu}</Text>
                    </View>

                </View>
            </View>

        </Card>
    );
    const sendTokenToBackend = async (token) => {
        const jwtToken = await AsyncStorage.getItem('token');

        try {
            //const fcmToken = token.data;
            const response = await client.post('/api/fcmTokens/registerFcmToken', { token: expoPushToken }, {
                headers: {
                    Authorization: jwtToken,
                    'Content-Type': 'application/json',
                },

            });
            console.log("Toooooooooooooken", expoPushToken)
        } catch (error) {
            console.error('Erreur lors de l\'envoi du token au backend:', error);
        }
    };

    return (
        <View style={styles.container}>

            <Button
                style={{ width: 200, marginLeft: 170, borderColor: '#d9252c', backgroundColor: 'white' }}
                textColor="#d9252c"
                icon="notification-clear-all"
                mode="outlined"
                title="Send Push Notification"
                onPress={() => sendTokenToBackend(expoPushToken)}
            > Activer notifications</Button>

            <ScrollView>

                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View />}
                    renderItem={renderItemNotifications}
                />
                <FlatList
                    data={quittances}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View />}
                    renderItem={renderItemQuittances}
                />
            </ScrollView>
        </View>
    );
};

export default NotificationsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Montserrat-Regular',

    },
    time: {
        fontSize: 14,
        color: '#777',
        fontFamily: 'Montserrat-Regular',

    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    payButton: {
        width: 140,
        backgroundColor: '#204393',
    },
    card: {
        backgroundColor: '#204393',
        borderRadius: 8,
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2, // Ajouter une bordure autour de la notification
        borderColor: '#204393', // Couleur de la bordure
    },
    title: {
        fontSize: 18,

        color: '#204393', // Couleur du titre
        fontFamily: 'Montserrat-Regular',
        margin: 12

    },
    time: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Montserrat-Regular',

    },
    contenu: {
        color: 'white', // Couleur du contenu du message
        fontFamily: 'Montserrat-Regular',
        textAlign: 'justify',
    },
    payButton: {
        width: 140,
        backgroundColor: '#ed3026', // Couleur du bouton "Payer"
    },
    importantTitle: {
        fontFamily: 'Montserrat-Regular',
        marginBottom: 12,
        color: '#d9252c', // Couleur pour les notifications importantes
    },
});
