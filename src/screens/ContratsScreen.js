import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';


const ContractsScreen = ({ navigation }) => {
    const [contracts, setContracts] = useState([]);
    const [contractsByClient, setContractsByClient] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Nouvelle variable d'état


    const [newContract, setNewContract] = useState('');
    const [DEBCNT, setDEBCNT] = useState('');

    const [cin, setCin] = useState('');
    const [isAuthentificated, setIsAuthenticated] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [token, setToken] = useState('');

    const getCinFromStorage = async () => {
        try {
            // Récupérer le token depuis AsyncStorage
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
            // Récupérer le CIN depuis AsyncStorage
            const storedCin = await AsyncStorage.getItem('cin');
            if (storedCin) {
                setCin(storedCin);
            }
            // Récupérer l'état d'authentification depuis AsyncStorage
            const storedIsAuthentificated = await AsyncStorage.getItem('isAuthentificated');
            setIsAuthenticated(JSON.parse(storedIsAuthentificated));
            console.log('Test', isAuthentificated)


        } catch (error) {
            console.log('Erreur lors de la récupération du CIN depuis AsyncStorage', error);
        }
    };

    const getContrats = async () => {
        if (cin.trim() !== '') {
            try {
                // Appel API pour récupérer les contrats du client
                const result = await client.get("/api/auth/Client/ContratsByClient", {
                    headers: {
                        Authorization: token,
                    },
                });

                // Mettre à jour les contrats dans l'état
                setContractsByClient(result.data);
                return result.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    };

    /* const loadContracts = async () => {
        const result = await getContrats();
        setContractsByClient(result);
    }; */

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();

        getCinFromStorage();

        if (isAuthentificated) {
            getContrats().then((result) => {
                setContractsByClient(result);
                setIsLoading(true); // Mettre à jour l'état du chargement
            }).catch((error) => {
                console.error(error);
                setIsLoading(false); // Mettre à jour l'état du chargement en cas d'erreur
            });
        } else {
            setIsLoading(false); // Mettre à jour l'état du chargement si non authentifié
            console.log('Non authentifié');
        }
    }, []);

    const addContract = async () => {
        if (newContract.trim() !== '' && cin.trim() !== '') {
            try {
                // Appel API pour ajouter un contrat
                const response = await client.get(`/api/auth/Client/ContratsClient`, {
                    headers: {
                        Authorization: token,
                    },
                    params: {
                        numCNT: newContract,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setContracts(data);
                    setNewContract('');
                    setIsModalVisible(false);
                    setIsAuthenticated(true)
                    console.log('devient authentfié')

                } else {
                    console.log('Erreur lors de la requête API');
                }
            } catch (error) {
                console.log('Erreur lors de la requête API', error);
            }
        }
    };

    const formatDate = (dateString) => {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}/${month}/${year}`;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Détails de votre contrat', { item: item })}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View >
                        <Text style={styles.title} >{item.NUMCNT}</Text>
                        <Text style={styles.time}>Produit : {item.LIBPRDT}</Text>
                        <Text style={styles.time}>Agence : {item.NOM_INT}</Text>
                        <View style={styles.stepContainer}>
                            <View style={styles.dateContainer}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="calendar-start" size={20} color='#ed3026' />
                                </View>
                                <Text style={styles.time}>{formatDate(item.DEBCNT)}</Text>
                            </View>

                            <MaterialCommunityIcons name="ray-start-arrow" size={25} style={{ transform: [{ scaleX: 1.7 }], marginRight: 15, marginLeft: 15, marginTop: 4 }} color='#ed3026' />

                            <View style={styles.dateContainer}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="calendar-end" size={20} color='#ed3026' />
                                </View>
                                <Text style={styles.time}>{formatDate(item.FINCNT)} </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <View>
            {isAuthentificated ? (

                <View>
                    <FlatList
                        data={contractsByClient}
                        keyExtractor={item => {
                            return item.id;
                        }}
                        ItemSeparatorComponent={() => {
                            return <View />;
                        }}
                        renderItem={renderItem}
                    />
                </View>
            ) : (
                <View>
                    <Button
                        style={{ width: 200, marginLeft: 200 }}
                        buttonColor="#204393"
                        icon="plus"
                        mode="contained"
                        onPress={() => setIsModalVisible(true)}> Contrat </Button>

                    <Modal visible={isModalVisible} transparent>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { width: 350, height: 250 }]}>
                                <View style={styles.centeredContent}>
                                    <Text style={styles.modalTitle}> Ajouter un contrat </Text>
                                </View>
                                <TextInput
                                    label='Numéro de contrat'
                                    mode="outlined"
                                    activeOutlineColor='#204393'
                                    outlineColor="#fbfbfb"
                                    value={newContract}
                                    onChangeText={text => setNewContract(text)}
                                    style={styles.textInput}
                                />
                                <View style={styles.buttons}>
                                    <Button
                                        style={{ width: 150, margin: 5, borderColor: "#204393" }}
                                        icon="arrow-expand-right"
                                        textColor="#204393"
                                        mode="outlined"
                                        onPress={addContract}
                                    >
                                        Ajouter
                                    </Button>
                                    <Button
                                        style={{ width: 150, margin: 5, borderColor: '#ed3026' }}
                                        textColor='#ed3026'
                                        icon="arrow-expand-left"
                                        mode="outlined"
                                        title="Annuler"
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        Annuler
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View>
                        <Text>   Liste des contrats :</Text>
                        {contracts.map((contract, index) => (
                            <View key={index}>
                                <Text>Numéro de contrat:</Text>
                                <Text>{contract.NUMCNT}</Text>
                                <Text>Produit:</Text>
                                <Text>{contract.LIBPRDT}</Text>
                                <Text>Date de début:</Text>
                                <Text>{formatDate(contract.DEBCNT)}</Text>
                                <Text>Date de fin:</Text>
                                <Text>{formatDate(contract.FINCNT)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );


};

export default ContractsScreen;

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
