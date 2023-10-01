import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from "axios"


import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';

import client from '../API/client';
import { useNavigation } from '@react-navigation/native';
import SelectPicker from 'react-native-form-select-picker';





const registerScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [typeIDNT, setTypeIDNT] = useState('');
    const [typePers, setTypePers] = useState('option1');
    const [numTel, setNumTel] = useState('');
    const [name, setName] = useState('');
    const [selectedValue, setSelectedValue] = useState("Vous êtes? ");
    const [selectedTeam, setSelectedTeam] = useState({})
    const [selectedOption, setSelectedOption] = useState('');
    const [showForm1, setShowForm1] = useState(false);
    const [showForm2, setShowForm2] = useState(false);

    const navigation = useNavigation();


    const handlePickerChange = (itemValue) => {
        setTypePers(itemValue);
        setShowForm1(itemValue === 'Physique');
        setShowForm2(itemValue === 'Morale');
    };
    const handleRegister = async () => {
        const formData = {
            name,
            username,
            typeIDNT,
            typePers,
            numTel,
            email,
            password,
            adresse,

        };
        try {
            const res = await client.post(
                "/api/auth/signupClient",
                formData
            );
            console.log(res);
            navigation.navigate("ActivationForm");

        } catch (ex) {
            console.log(ex);
        }
    };


    return (
        <ScrollView style={styles.container}>
            <ImageBackground style={styles.backgroundImage}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/AmiLOGO.png')} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>

                    <View style={styles.selectBar}>
                        <View style={styles.selectPicker} >
                            <SelectPicker
                                onSelectedStyle={styles.selectedOptionStyle}
                                placeholder='Cliquer pour sélectionner une option'
                                placeholderStyle={{ color: '#ed3026', fontFamily: 'Montserrat-Regular', fontSize: 14 }}
                                selectedValue={typePers}
                                containerStyle={{
                                    backgroundColor: COLORS.backgroundNav,
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    marginBottom: 1,
                                    borderColor: '#ed3026',


                                }}
                                doneButtonText='Done'
                                doneButtonTextStyle={{ color: '#ed3026', fontFamily: 'Montserrat-Regular' }}
                                onValueChange={handlePickerChange}
                            >
                                <SelectPicker.Item value='' label='Vous êtes ?' disabled={true} />
                                <SelectPicker.Item value='Morale' label='Une personne Morale (Entreprise)' />
                                <SelectPicker.Item value='Physique' label='Une personne Physique' />
                            </SelectPicker>
                        </View>
                        <Octicons name="single-select" size={20} color='#ed3026' style={styles.iconSelect} />

                    </View>
                    {showForm1 && (
                        <><View style={styles.card}>
                            <TextInput
                                placeholder="Nom et Prénom"
                                style={styles.input}
                                value={name}
                                onChangeText={setName} />
                            <AntDesign name="contacts" size={22} color='#ed3026' style={styles.icon} />
                        </View>
                            <View>
                                <SelectPicker
                                    placeholder='Type pièce d’identité ?'
                                    selectedValue={typeIDNT}
                                    onValueChange={(value) => setTypeIDNT(value, 'typeIDNT')} >
                                    <SelectPicker.Item value='Cin' label='Cin' />
                                    <SelectPicker.Item value='Passeport' label='Passeport' />
                                    <SelectPicker.Item value='CarteSej' label='Carte Séjour' />

                                </SelectPicker>
                            </View>
                            <View style={styles.card}>
                                <TextInput
                                    placeholder="Numéro pièce d'identité"
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername} />
                                <Octicons name="number" size={22} color='#ed3026' style={styles.icon} />

                            </View>
                            <View style={styles.card}>
                                <TextInput
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword} />
                                <Ionicons name="key-outline" size={22} color='#ed3026' style={styles.icon} />
                            </View><View style={styles.card}>
                                <TextInput
                                    placeholder="Email"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail} />
                                <MaterialCommunityIcons name="email-minus-outline" size={22} color='#ed3026' style={styles.icon} />

                            </View><View style={styles.card}>
                                <TextInput
                                    placeholder="Numéro de téléphone"
                                    style={styles.input}
                                    value={numTel}
                                    onChangeText={setNumTel} />
                                <MaterialCommunityIcons name="phone-outline" size={22} color='#ed3026' style={styles.icon} />

                            </View>
                            <View style={styles.card}>
                                <TextInput
                                    placeholder="Adresse"
                                    style={styles.input}
                                    value={adresse}
                                    onChangeText={setAdresse} />
                                <MaterialCommunityIcons name="home-outline" size={22} color='#ed3026' style={styles.icon} />

                            </View>
                        </>
                    )}
                    {showForm2 && (
                        <><View style={styles.card}>
                            <TextInput
                                placeholder="Nom et Prénom"
                                style={styles.input}
                                value={name}
                                onChangeText={setName} />
                            <AntDesign name="contacts" size={22} color='#ed3026' style={styles.icon} />
                        </View>
                            <View>
                                <SelectPicker
                                    placeholder='Type pièce d’identité ?'
                                    selectedValue={typeIDNT}
                                    onValueChange={(value) => setTypeIDNT(value, 'typeIDNT')} >
                                    <SelectPicker.Item value='Matfisc' label='Matricule fiscale' />
                                    <SelectPicker.Item value='RegistComm' label='Registre du commerce' />
                                </SelectPicker>
                            </View>
                            <View style={styles.card}>
                                <TextInput
                                    placeholder="Numéro pièce d'identité"
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername} />
                                <Octicons name="number" size={22} color='#ed3026' style={styles.icon} />

                            </View>
                            <View style={styles.card}>
                                <TextInput
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword} />
                                <Ionicons name="key-outline" size={22} color='#ed3026' style={styles.icon} />
                            </View><View style={styles.card}>
                                <TextInput
                                    placeholder="Email"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail} />
                                <MaterialCommunityIcons name="email-minus-outline" size={22} color='#ed3026' style={styles.icon} />

                            </View><View style={styles.card}>
                                <TextInput
                                    placeholder="Numéro de téléphone"
                                    style={styles.input}
                                    value={numTel}
                                    onChangeText={setNumTel} />
                                <MaterialCommunityIcons name="phone-outline" size={22} color='#ed3026' style={styles.icon} />

                            </View>
                            <View style={styles.card}>
                                <TextInput
                                    placeholder="Adresse"
                                    style={styles.input}
                                    value={adresse}
                                    onChangeText={setAdresse} />
                                <MaterialCommunityIcons name="home-outline" size={22} color='#ed3026' style={styles.icon} />

                            </View>
                        </>
                    )}

                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <Text style={styles.loginButtonText}> S'inscrire </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.text} size={3} color={COLORS.primary}>
                            Avez vous déjà un compte ? Se connecter </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </ScrollView>
    );
}

export default registerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: COLORS.primary,
        borderWidth: 20,
        marginTop: 30
    },
    selectBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundNav,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 8,
        borderColor: '#ed3026',

    },
    selectPicker: {
        width: '94%',
    },
    iconSelect: {
        width: '6%',

    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    logo: {
        width: 290,
        height: 100,
        marginRight: 30,
        marginLeft: 30,
        marginTop: 5


    },
    formContainer: {
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 640
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
    label: {
        color: '#ed3026',
        fontFamily: 'Montserrat-Regular',

    }

});