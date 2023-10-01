import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import DateField, { YearMonthDateField } from 'react-native-datefield';
//import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import SelectPicker from 'react-native-form-select-picker';







const AddDemande = () => {
    const [object, setObject] = useState('');
    const [description, setDescription] = useState('');
    const [dateCreation, setDateCreation] = useState('');
    const [categ, setCateg] = useState('');

    const [etat, setEtat] = useState('Non traitée');

    const [token, setToken] = useState('');
    const [showPicker, setShowPicker] = useState(false);


    const navigation = useNavigation();



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
                Alert.alert('Nous avons bien reçu votre réclamation !');
                navigation.navigate("Liste des réclamations");

            }

        } catch (ex) {
            console.log(ex);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}> Votre réclamation concerne ? </Text>


                <View style={styles.selectPicker} >
                    <SelectPicker
                        onSelectedStyle={styles.selectedOptionStyle}
                        placeholder='Cliquer ici pour choisir une catégorie'
                        placeholderStyle={{ color: '#ed3026', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                        selectedValue={categ}
                        containerStyle={{
                            backgroundColor: COLORS.backgroundNav,
                            borderWidth: 2,
                            borderRadius: 10,
                            marginBottom: 1,
                            borderColor: '#ed3026',


                        }}
                        doneButtonText='Done'
                        doneButtonTextStyle={{ color: '#ed3026', fontFamily: 'Montserrat-Regular' }}
                        onValueChange={text => setCateg(text)}
                    >
                        <SelectPicker.Item value='Devis' label='Devis' />
                        <SelectPicker.Item value='Sinsitre' label='Sinsitre' />
                        <SelectPicker.Item value='Quittance' label='Quittance' />
                        <SelectPicker.Item value='Contrat' label='Contrat' />

                    </SelectPicker>
                </View>

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
        </View>
    );
}

export default AddDemande

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

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
};