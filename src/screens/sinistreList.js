import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';


import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';
const sinistreList = ({ navigation }) => {
    const [sinistres, setSinistres] = useState([]);

    //const [cin, setCin] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [token, setToken] = useState('');
    const [isLoadingContracts, setIsLoadingContracts] = useState(true);



    const getSinistres = async () => {
        const cin = await AsyncStorage.getItem('cin');
        const token = await AsyncStorage.getItem('token');

        if (cin.trim() !== '') {
            try {
                //setIsLoadingContracts(true); // Activation du spinner
                // Appel API pour récupérer les sinistres du client
                const result = await client.get("/api/auth/sinistre/SinistresByClient", {
                    headers: {
                        Authorization: token,
                    },
                });

                // Mettre à jour les sinistres dans l'état
                setSinistres(result.data);
                console.log('Siniiiiiiiiiiiiiiiistres', sinistres)
                //setIsLoadingContracts(false); // Désactivation du spinner
            } catch (error) {
                console.error(error);
                //setIsLoadingContracts(false); // Désactivation du spinner en cas d'erreur
            }
        }
    };



    useEffect(() => {
        const loadData = async () => {
            // Charger les polices de caractères
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
            // Récupérer les données depuis AsyncStorage
        };

        loadData();

        getSinistres();
    }, []);



    const formatDate = (dateString) => {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}/${month}/${year}`;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Détails', { item: item })}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.title}>{item.N_SINISTRE}</Text>
                        <Text style={styles.time}>Contrat : {item.NUMCNT}</Text>
                        <Text style={styles.time}>Matricule : {item.IMMAT}</Text>
                        <Text style={styles.time}>
                            Etat : {(() => {
                                switch (item.CODE_ETAT) {
                                    case 1:
                                        return 'En cours';
                                    case 2:
                                        return 'Terminé';
                                    case 3:
                                        return 'Réouvert';
                                    default:
                                        return item.CODE_ETAT;
                                }
                            })()}
                        </Text>


                        <View style={styles.dateContainer}>
                            <Text style={styles.time}>Lieu Sinistre:{item.GOUVSINI} </Text>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color="#ed3026" />
                            </View>
                            <Text style={styles.time}>{item.CITESINI} </Text>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.dateContainer}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="calendar" size={20} color="#ed3026" />
                                </View>
                                <Text style={styles.time}>{item.DTSURV}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Button style={{ marginLeft: '20%', width: 200, backgroundColor: '#204393' }}
                            textColor="white"
                            mode="contained"> Suivre ce sinistre</Button>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );



    return (

        <View style={{ flex: 1 }}>
            <FlatList
                data={sinistres}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View />}
                renderItem={renderItem}
            />
        </View>


    );
};

export default sinistreList;

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
        borderColor: '#ed3026',
        borderWidth: 2,
        borderRadius: 10,
        margin: 15
    },
    cardHeader: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        justifyContent: 'space-between',

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
        //borderBottomRightRadius: 10,
        //transform: [{ perspective: 700 }, { rotateY: '40deg' }],
        /* shadowColor: COLORS.primary,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        elevation: 20, */
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
