import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import client from '../API/client';
import COLORS from '../const/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



const ActivationForm = ({ navigation }) => {
    const [activationCode, setActivationCode] = useState('');

    const handleActivation = async () => {
        try {
            const res = await client.post(
                `http://192.168.90.67:8060/api/auth/activate?activationCode=${activationCode}`
            );
            console.log(res);

            if (res.status >= 200 && res.status < 300) {
                // La requête a réussi, vous pouvez accéder au contenu de la réponse
                Alert.alert('Activation réussie', 'Votre compte a été activé avec succès !');
                navigation.navigate("Login");

            } else {
                Alert.alert('Erreur', 'La vérification du code d\'activation a échoué.');
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <ImageBackground style={styles.backgroundImage}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/verified.png')} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.text}> Vous avez reçu un code d'activation par mail ! </Text>

                    <View style={styles.card}>
                        <TextInput
                            onChangeText={setActivationCode}
                            value={activationCode}
                            placeholder="Code d'activation"
                        />
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleActivation}>
                        <Text style={styles.loginButtonText}> Vérifier </Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </ScrollView>
    );

};

export default ActivationForm;
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
        marginTop: 15,
    },
    logo: {
        width: 100,
        height: 100,
        marginRight: 30,
        marginLeft: 30,
        marginTop: 20
    },
    formContainer: {
        marginHorizontal: 10,
        marginTop: 60,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(247,247,247,255)',
        height: 250
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
        height: 30,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#B0C4DE',
        flex: 1,

    },
    loginButton: {
        backgroundColor: '#204393',
        padding: 7,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
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
        marginTop: 10,
        textAlign: 'center',
        marginRight: -60,
        fontSize: 10
    },
    selectedOptionStyle: {
        color: '#204393',
        fontWeight: 'bold',

    },
    text: {
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        fontSize: 12,
        padding: 10
    },

});