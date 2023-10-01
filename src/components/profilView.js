import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';



const profileView = ({ route }) => {

    const { item } = route.params;



    const [profile, setProfile] = useState({})
    const [username, setUsername] = useState(item.username);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(item.email);
    const [adresse, setAdresse] = useState(item.adresse);
    const [numTel, setNumTel] = useState(item.numTel);
    const [name, setName] = useState(item.name);

    const navigation = useNavigation();
    const updateProfileData = (newProfileData) => {
        setProfile(newProfileData);
    };
    const updateProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }


        try {
            const res = await client.post(
                "/api/auth/Client/updateProfile",
                {
                    username: username,
                    email: email,
                    adresse: adresse,
                    numTel: numTel,
                    name: name,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                }
            )
            updateProfileData(res.data);
            navigation.navigate("Mon Profil");


        } catch (ex) {
            console.log(ex);
        }
    }


    return (
        <View style={styles.container}>

            <ScrollView style={styles.form}>

                <TextInput
                    mode="outlined"
                    editable={false}
                    activeOutlineColor='#204393'
                    outlineColor='#ed3026'
                    label="Numéro piece identité"
                    onChangeText={(value) => setUsername(value)}
                    value={username}
                    style={[styles.input, { backgroundColor: '#FFECEB' }]}
                />

                <TextInput
                    mode="outlined"
                    label="Nom et prénom"
                    activeOutlineColor='#204393'
                    outlineColor='#ed3026'
                    value={name}
                    onChangeText={(value) => setName(value)}
                    style={styles.input}

                />

                <TextInput
                    mode="outlined"
                    label="Email"
                    activeOutlineColor='#204393'
                    outlineColor='#ed3026'

                    value={email}
                    onChangeText={(value) => setEmail(value)}
                    style={styles.input}


                />

                <TextInput
                    mode="outlined"
                    label="Numéro Tél"
                    activeOutlineColor='#204393'
                    outlineColor='#ed3026'

                    value={numTel}
                    onChangeText={(value) => setNumTel(value)}
                    style={styles.input}


                />
                <TextInput
                    mode="outlined"
                    label="Adresse"
                    activeOutlineColor='#204393'
                    outlineColor='#ed3026'

                    value={adresse}
                    onChangeText={setAdresse}
                    style={styles.input}

                />
                <TouchableOpacity style={styles.button} onPress={updateProfile}>
                    <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    form: {
        width: '85%',
        //backgroundColor: 'white',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 7,
        padding: 14,
        //height: 300,
        margin: 40

    },
    label: {
        marginTop: 20,
    },

    button: {
        marginTop: 100,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',

    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        alignItems: 'center',

    },
    input: {
        marginTop: 30,
        //marginBottom: 15


    }


});

export default profileView;


