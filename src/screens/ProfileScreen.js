import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const [profile, setProfile] = useState({})
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [numTel, setNumTel] = useState('');
    const [name, setName] = useState('');

    const navigation = useNavigation();


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
            setProfile(result)
            console.log("profil", result);

        };
        fetchData();
    }, [name, email, numTel, adresse])


    return (
        <View style={styles.container}>
            <View style={styles.coverPhoto}></View>
            <View style={styles.avatarContainer}>
                <Image source={require('../../assets/logoRouge.jpg')} style={styles.avatar} />
                <Text style={styles.name}>{profile.name}</Text>
            </View>
            <Button style={{ width: 150, margin: 5, borderColor: "#ed3026" }} icon="account-edit-outline" textColor="#ed3026" mode="elevated" onPress={() => navigation.navigate("Update Profil", { item: profile })}> Modifier </Button>

            <View style={styles.card}>
                {/*  <View style={styles.info}>
                    <Text style={styles.label}> Carte d'identité</Text>
                    <Text> {profile.username}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}> Email</Text>
                    <Text> {profile.email}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}> Numéro Téléphone </Text>
                    <Text> {profile.numTel}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}> Adresse</Text>
                    <Text> {profile.adresse}</Text>
                </View> */}
                <View style={styles.contenu}>
                    <View style={styles.labels}>
                        <Text style={styles.labelText}> Nom  Prénom  </Text>
                        <Text style={styles.labelText}> Pièce d'identité </Text>
                        <Text style={styles.labelText}> Email </Text>
                        <Text style={styles.labelText}> Adresse </Text>



                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userInfoText}> {profile.name} </Text>
                        <Text style={styles.userInfoText}> {profile.username} </Text>
                        <Text style={styles.userInfoText}> {profile.email} </Text>
                        <Text style={styles.userInfoText}> {profile.adresse} </Text>


                    </View>
                </View>


            </View>
        </View>
    );


}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    contenu: {
        flex: 1,
        flexDirection: 'row'

    },
    labels: {
        backgroundColor: COLORS.primary,
        width: 135,

    },
    labelText: {
        padding: 10,
        marginTop: 20,
        color: 'white',
        fontWeight: 'bold'

    },
    userInfoText: {
        padding: 10,
        marginTop: 20
    },
    coverPhoto: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderWidth: 100,
        borderColor: COLORS.primary
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: -75,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: 'white',
    },
    name: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        width: '60%',
        justifyContent: 'space-between',
    },
    card: {
        height: 300,
        width: 400,
        backgroundColor: COLORS.backgroundNav,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        marginTop: 10,
        borderRadius: 8,


    },
    info: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        //justifyContent: 'space-around'
    },
    label: {
        fontWeight: "bold",
        marginRight: 12,
        backgroundColor: COLORS.primary,
        color: 'l'
    }
}); 