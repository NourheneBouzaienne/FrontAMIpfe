import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, ScrollView, Alert, TextInput } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlipCard from 'react-native-flip-card'


const DetailContratScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [SITUAT, setSituation] = useState("");
    const [FRACT, setFractionnement] = useState("");



    const detailsContrats = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }

        try {
            const res = await client.get('/api/auth/Client/getContratByNUMCNT', {
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

        } catch (ex) {
            console.log(ex);
        }
    }

    useEffect(() => {
        detailsContrats();
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();

    }, [])

    const formatDate = (dateString) => {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}/${month}/${year}`;
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Détails Garanties', { item: item })}>
                <View style={styles.flipCard}>
                    <View style={[styles.card, styles.card1]}>

                        <View style={styles.details}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.modalTitle}> Numéro de contrat {item.NUMCNT}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome5 name="file-contract" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.description}> PRODUIT : {item.LIBPRDT}</Text>
                            </View>
                            <View style={styles.columnSeparator} />

                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="business" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.labelInfo}> AGENCE : </Text>
                                <Text style={styles.description}>{item.NOM_INT}</Text>
                            </View>

                            <View style={styles.columnSeparator} />

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="ellipsis-horizontal-circle" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.description}>
                                    SITUATION : {(() => {
                                        switch (item.SITUAT) {
                                            case 'E':
                                                return 'En cours';
                                            case 'R':
                                                return 'Résilié';
                                            default:
                                                return item.SITUAT;
                                        }
                                    })()}
                                </Text>
                            </View>

                            <View style={styles.columnSeparator} />

                            <View style={styles.stepContainer}>
                                <View style={styles.datesContainer}>
                                    <View style={styles.dateContainer}>
                                        <View style={styles.iconContainer}>
                                            <MaterialCommunityIcons name="calendar-start" size={25} color='#ed3026' />
                                        </View>
                                        <Text style={styles.time}>{formatDate(item.DEBCNT)}</Text>
                                    </View>
                                    <View style={styles.line} />
                                    <View style={styles.dateContainer}>
                                        <View style={styles.iconContainer}>
                                            <MaterialCommunityIcons name="calendar-end" size={25} color='#ed3026' />
                                        </View>
                                        <Text style={styles.time}>{formatDate(item.FINCNT)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.columnSeparator} />

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="card-outline" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.description}>
                                    MODE DE PAIEMENT : {(() => {
                                        switch (item.FRACT) {
                                            case 'A':
                                                return 'Annuel';
                                            case 'S':
                                                return 'Semestriel';
                                            case 'T':
                                                return 'Trimestriel';
                                            default:
                                                return item.FRACT;
                                        }
                                    })()}
                                </Text>
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );

}

export default DetailContratScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        //backgroundColor: '#fff',
        position: 'relative',

    },
    details: {
        marginBottom: 40,
        marginTop: 20,

    },
    columnSeparator: {
        borderLeftWidth: 1,
        borderLeftColor: '#ed3026',
        marginLeft: 25, // Espacement horizontal entre les lignes
        height: 60, // Pour étendre la ligne sur toute la hauteur de la vue
        marginTop: 5,
        marginBottom: 5,

    },
    labelInfo: {
        color: COLORS.primary,
        //height: 70,
        fontFamily: 'Montserrat-Regular',
        //marginTop: 5,
        //fontWeight: 'bold'
        marginTop: 5

    },
    flipCard: {
        //marginTop: 200
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        backgroundColor: '#fff',

    },
    card1: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 20,
        backgroundColor: '#fbfbfb',



    },
    card2: {
        borderWidth: 2,
        borderColor: '#ed3026',
        borderRadius: 20,
        backgroundColor: '#fbfbfb',

    },
    label: {
        color: COLORS.primary,
        fontSize: 13,
        textAlign: 'center',
        margin: 15,
        flexDirection: 'row',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
    },
    description: {
        //paddingVertical: 2,
        //paddingHorizontal: 16,
        color: COLORS.primary,
        //height: 70,
        fontFamily: 'Montserrat-Regular',
        //marginTop: 8,
        marginTop: 5
    },
    triangleCorner: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 400,
        borderTopWidth: 200,
        borderRightColor: "transparent",
        borderTopColor: COLORS.primary,
        //marginTop: 100

    },
    triangleCornerBottomRight: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 400,
        borderTopWidth: 250,
        borderRightColor: "transparent",
        borderTopColor: COLORS.primary,
        //marginTop: 5,
        transform: [{ rotate: "180deg" }],
    },
    etat: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        color: '#ed3026',
        height: 150,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    datesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    iconContainer: {
        marginRight: 5,
        marginLeft: 15,
    },
    line: {
        flex: 1,
        height: 1,
        //backgroundColor: '#ed3026',
        marginHorizontal: 10,
    },
    time: {
        fontSize: 14,
        color: COLORS.primary,
        //marginTop: 5,
        fontFamily: 'Montserrat-Regular',
    },



})