
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Modal, ScrollView, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../API/client';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import DateField, { YearMonthDateField } from 'react-native-datefield';
//import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import SelectPicker from 'react-native-form-select-picker';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications



const helpScreen = () => {

    /* const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    async function registerForPushNotificationsAsync() {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'e0b18a9c-19b8-4768-b3e8-24da9c1981f4' })).data;
        console.log('Expo Push Token:', token);
        setExpoPushToken(token)
    }
 */
    /*   async function sendPushNotification(expoPushToken) {
  
          await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  to: expoPushToken,
                  sound: 'default',
                  title: 'Hello!',
                  body: 'This is a test push notification.',
                  data: { extraData: 'Some extra data' },
              }),
          });
      } */

    /*   const sendTokenToBackend = async (token) => {
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
      }; */

    const [object, setObject] = useState('');
    const [description, setDescription] = useState('');
    const [dateCreation, setDateCreation] = useState('');
    const [categ, setCateg] = useState('Aide');

    const [etat, setEtat] = useState('Non traitée');

    const [token, setToken] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };
        getToken();
    }, []);



    const handleDemande = async () => {
        const formData = {
            object,
            description,
            dateCreation,
            etat,
            categ

        };
        try {
            const res = await client.post(
                "/api/auth/demande/addDemande",
                JSON.stringify(formData),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                }

            );
            console.log(res);
            if (res.status >= 200 && res.status < 300) {
                // Notif
                setModalVisible(true);


            }

        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/*   <Text>Expo Push Notifications Example</Text>
            <Button
                title="Send Push Notification"
                onPress={() => sendTokenToBackend(expoPushToken)}
            /> */}
            <View style={styles.card}>
                <Text style={styles.title}> Vous avez besoin d'aide ? </Text>
                <TextInput
                    label='Objet'
                    mode="outlined"
                    activeOutlineColor='#204393'
                    outlineColor="#fbfbfb"
                    style={styles.input}
                    value={object}
                    onChangeText={text => setObject(text)}
                />
                <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#204393' }}> Date </Text>
                <DateField
                    value={dateCreation}
                    defaultValue={new Date()} onSubmit={(value) => setDateCreation(value, 'dateCreation')}
                />
                <TextInput
                    label='Description'
                    mode="outlined"
                    activeOutlineColor='#204393'
                    outlineColor="#fbfbfb"
                    style={styles.input}
                    value={description}
                    onChangeText={text => setDescription(text)}
                />

                <TouchableOpacity style={styles.button} onPress={handleDemande}>
                    <Text style={styles.buttonText}> Envoyer</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>

                    <View style={styles.modalContent}>
                        <MaterialIcons name="check-circle-outline" size={30} color='#ed3026' style={styles.icon} />
                        <Text style={styles.errorMessage}>Nous avons bien reçu votre question !</Text>
                        <Button style={{
                            width: 150, justifyContent: 'center',
                            alignItems: 'center'
                        }} buttonColor={'#ed3026'} mode="contained" onPress={() => setModalVisible(false)} > OK  </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


export default helpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    errorMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur de fond semi-transparente

    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        borderColor: 'red',
        borderWidth: 1
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 0,
        borderWidth: 1,
        borderColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        padding: 20,
        width: '88%',
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#204393'
    },
    input: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#204393',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
})