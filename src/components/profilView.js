import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const profileView = () => {

    const [profile, setProfile] = useState({})
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [numTel, setNumTel] = useState('');
    const [name, setName] = useState('');


    const handleSubmit = () => {

    }
    const getProfil = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const result = await client.get("/api/auth/Client/profile", {
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
            const result = await getProfil();
            setProfile(result);
            console.log("profil", result);
        };
        fetchData();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={{ uri: '' }}
                />
                <TouchableOpacity style={styles.changeAvatarButton} onPress={() => {/* open image picker */ }}>
                    <Text style={styles.changeAvatarButtonText}>Icon</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Numéro piece identité</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                    value={profile.username}
                    onChangeText={setUsername}
                />
                <Text style={styles.label}>Nom</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                    value={profile.name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    value={profile.email}
                    onChangeText={setEmail}
                />
                <Text style={styles.label}>Numéro Téléphone</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Numero"
                    value={profile.numTel}
                    onChangeText={setNumTel}
                />
                <Text style={styles.label}>Adresse</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Adresse"
                    value={profile.adresse}
                    onChangeText={setAdresse}
                />
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit({ name, email, numTel, adresse, avatar })}>
                    <Text style={styles.buttonText}>Modifier profil</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: '80%',
    },
    label: {
        marginTop: 20,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
    },
    button: {
        marginTop: 20,
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
    avatarContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    changeAvatarButton: {
        marginTop: 10,
    },
    changeAvatarButtonText: {
        color: '#1E90FF',
        fontSize: 18,
    },
});

export default profileView;


