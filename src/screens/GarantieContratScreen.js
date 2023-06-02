import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';



const GarantieContratScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [garanties, setGaranties] = useState([]);


    const garantiesContrats = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }

        try {
            const res = await client.get('/api/auth/Client/getGRNTByNUMCNT', {
                headers: {
                    Authorization: token,
                },
                params: {
                    numCNT: item.NUMCNT,
                },
            });

            const data = res.data; // Accéder à la propriété 'data' de la réponse
            /* 
                        if (data.length > 0) {
                            const situat = data[0].SITUAT; // Accéder à la propriété 'SITUAT' de la première ligne
                            setSituation(situat);
                            const fract = data[1].FRACT;
                            setFractionnement(fract);
            
                            console.log(res);
                            console.log('tttttttttttttttest', situat);
                        } */
            console.log(item.FRACT)
            setGaranties(res.data)

        } catch (ex) {
            console.log(ex);
        }
    }


    useEffect(() => {
        garantiesContrats();
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();

    }, [])



    const convertToLowerCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Détails de votre contrat', { item: item })}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>

                    <Text style={styles.label} > Libellé </Text>
                    <Text style={styles.centeredContent}>{convertToLowerCase(item.LIBGRNT)}</Text>
                    <Text style={styles.label} > Capital assuré </Text>
                    <Text style={styles.centeredContent} >.......</Text>


                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <FlatList
                data={garanties}
                keyExtractor={item => {
                    return item.id;
                }}
                ItemSeparatorComponent={() => {
                    return <View />;
                }}
                renderItem={renderItem}
            />
        </View>

    )
}

export default GarantieContratScreen

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        backgroundColor: '#fbfbfb',
        elevation: 5,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
    },
    textInput: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '100%',
    },
    centeredContent: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary,
        margin: 5
    },
    label: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat-Regular',
        color: '#ed3026',

    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        shadowColor: 'blue',
        shadowOffset: {
            width: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor: 'white',
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 10,
        margin: 15
    },
    cardHeader: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        justifyContent: 'space-between',
        //flexDirection: 'row'
    },
    labels: {
    },
    content: {
        width: 500
    },
    title: {
        fontSize: 18,
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        backgroundColor: COLORS.primary,
        height: 40,
        width: 200,
        marginLeft: 170,
        padding: 8,
        borderTopRightRadius: 10,
        borderColor: '#4f69a9',
        borderWidth: 2
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    time: {
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 5,
        fontFamily: 'Montserrat-Regular',

    },
    iconContainer: {
        //alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});