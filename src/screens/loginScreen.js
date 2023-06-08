

import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TextInput, TouchableOpacity, Text, ScrollView, Modal } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';




const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigation = useNavigation();



    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async () => {
        const formData = {
            "password": password,
            "username": username
        }
        try {
            const res = await client.post('/api/auth/signin',
                formData
            );

            console.log(res);
            AsyncStorage.setItem("token", "Bearer " + res.data.accessToken);
            AsyncStorage.setItem("cin", res.data.username);
            AsyncStorage.setItem("isAuthentificated", res.data.authentificated.toString());


            console.log(res.data.accessToken)
            console.log(res.data.username)
            console.log("isAuthentificated")

            onLogin();

        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.status === 401) {
                // Invalid username or password
                console.log(ex.response.data);
                setErrorMessage(ex.response.data);
                setShowModal(true);
            }
        }
    };

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();
    }, []);


    return (
        <ScrollView style={styles.container}>
            <ImageBackground style={styles.backgroundImage}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/AmiLOGO.png')} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.card}>
                        <TextInput
                            placeholder="Numéro pièce d'identité"
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                        />
                        <MaterialCommunityIcons name="account-arrow-right-outline" size={22} color='#ed3026' style={styles.icon} />

                    </View>
                    <View style={styles.card}>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={!isPasswordVisible}
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off' : 'eye-outline'}
                                size={22}
                                color="#ed3026"
                            />
                        </TouchableOpacity>
                        {/*    <Ionicons name="key-outline" size={22} color='#ed3026' style={styles.icon} /> */}
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}> Se connecter </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.text} size={3} color={COLORS.primary}>
                            Vous n'avez pas un compte ? Créer Maintenant                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={showModal}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setShowModal(false)}
                    >
                        <View style={styles.modalContainer}>

                            <View style={styles.modalContent}>
                                <MaterialIcons name="error-outline" size={30} color='#ed3026' style={styles.icon} />
                                <Text style={styles.errorMessage}>{errorMessage}</Text>
                                <Button style={{
                                    width: 150, justifyContent: 'center',
                                    alignItems: 'center'
                                }} buttonColor={'#ed3026'} mode="contained" onPress={() => setShowModal(false)} > OK  </Button>
                            </View>
                        </View>
                    </Modal>

                </View>
            </ImageBackground>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: COLORS.primary,
        borderWidth: 20
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 160,
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
    errorMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
        marginTop: 20,
    },
    logo: {
        width: 290,
        height: 100,
        marginRight: 30,
        marginLeft: 30
    },
    formContainer: {
        marginHorizontal: 10,
        marginTop: 40,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(247,247,247,255)',
        height: 300
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',


    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#B0C4DE',
        flex: 1,

    },
    loginButton: {
        backgroundColor: '#204393',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
        marginTop: 20,
        textAlign: 'center',
        marginRight: -60,
        fontSize: 10
    }

});

export default LoginScreen;