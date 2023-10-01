import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';



const GarantieContratScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [garanties, setGaranties] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const [proposegaranties, setProposeGaranties] = useState([]);
    const [modalPackVisible, setModalPackVisible] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        numCNT: item.NUMCNT, // Initialiser avec les valeurs appropriées
        garantie: '', // Initialiser avec les valeurs appropriées
        // Ajoutez d'autres champs de formulaire ici
    });



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

    const propositiongarantiesContrats = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }

        try {
            const res = await client.get('/api/auth/Client/proposeGarantie', {
                headers: {
                    Authorization: token,
                },
                params: {
                    numCNT: item.NUMCNT,
                },
            });

            const data = res.data;
            console.log(res.data)
            setProposeGaranties(res.data)

        } catch (ex) {
            console.log(ex);
        }
    }
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleAddRequest = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const res = await client.post(
                "/api/DemandeGarantie/addDemande",
                JSON.stringify(formData),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                }
            );
            console.log(res);
            if (res.status >= 200 && res.status < 300) {
                // Mettez à jour l'état showSuccessMessage pour afficher le message de succès
                setShowSuccessMessage(true);

                // Réinitialisez l'état successMessage après 3 secondes
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000); // Réinitialisez après 3 secondes (ajustez la durée selon vos besoins)
            }
        } catch (ex) {
            console.log(ex);
        }
    };


    useEffect(() => {
        garantiesContrats();
        propositiongarantiesContrats();
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

    const showPopup = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>

            <View style={styles.cardHeader}>
                <Text style={styles.label} > Libellé </Text>
                <Text style={styles.centeredContent}>{convertToLowerCase(item.RESULT)}</Text>
                <Text style={styles.label} > Capital assuré </Text>
                <View style={styles.capital}>
                    <Text style={styles.centeredContent} >{item.NBUNITLM} </Text>
                    {/*   <Text style={styles.description}>
                        Capital assuré : {(() => {
                            switch (item.NBUNITLM) {
                                case 0:
                                    return 'Contactez votre agence';
                                default:
                                    return item.NBUNITLM;
                            }
                        })()}
                    </Text> */}
                    <Text style={styles.centeredContent}>
                        {(() => {
                            switch (item.UNTLIMIT) {
                                case 'DT':
                                    return 'DT';
                                case 'JJ':
                                    return 'Jours';
                                default:
                                    return item.UNTLIMIT;
                            }
                        })()}
                    </Text>

                </View>
                <Text style={styles.label} > Prime </Text>
                <Text style={styles.centeredContent}>{item.SOMME_PRIMGRNT} DT</Text>

            </View>

            <View style={styles.buttonContainer}>
                {/* Le bouton moderne en haut à gauche */}
                <Button
                    icon="information"
                    mode="contained"
                    onPress={() => showPopup(item)}
                    style={{ width: 30, height: 30, padding: 0 }}
                    contentStyle={{ width: 30, height: 30 }}
                    buttonStyle={{ borderRadius: 15 }}
                    labelStyle={{ display: 'none' }}
                    buttonColor='#204393'
                    textColor='white'
                ></Button>

            </View>
        </View>

    );

    const renderItemProposeGaranties = ({ item }) => (
        <View style={styles.card2}>

            <View style={styles.cardHeader2}>
                <Text style={styles.label} > Libellé </Text>
                <Text style={styles.centeredContent2}>{item.NOMCOMMERCIAL}</Text>
            </View>

            <View style={styles.info}>
                <Button
                    icon="information"
                    mode="contained"
                    onPress={() => showPopup(item)}
                    style={{ width: 30, height: 30, padding: 0 }}
                    contentStyle={{ width: 30, height: 30 }}
                    buttonStyle={{ borderRadius: 15 }}
                    labelStyle={{ display: 'none' }}
                    buttonColor='#204393'
                    textColor='white'
                ></Button>
            </View>
            <View style={styles.ajout}>
                <Button
                    icon="plus"
                    mode="contained"
                    onPress={() => {
                        // Mettez à jour le champ libGRNT du formulaire avec la valeur de LIBGRNT
                        setFormData({ ...formData, garantie: item.NOMCOMMERCIAL });
                        setShowAddForm(true);
                    }}
                    style={{ width: 30, height: 30, padding: 0 }}
                    contentStyle={{ width: 30, height: 30 }}
                    buttonStyle={{ borderRadius: 15 }}
                    labelStyle={{ display: 'none' }}
                    buttonColor='#204393'
                    textColor='white'
                ></Button>
            </View>
        </View>

    );

    return (
        <ScrollView>
            <View>
                <Text style={styles.title}>
                    Numéro contrat :   {item.NUMCNT} </Text>
            </View>

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
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{selectedItem ? selectedItem.BULL : ''}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.close}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.pack}>
                <Text style={styles.title2} >
                    Nous offrons des options de couverture supplémentaires, en plus de vos garanties actuelles. </Text>
                <TouchableOpacity onPress={() => setModalPackVisible(true)}>
                    <Text style={styles.title3}>Cliquez ici</Text>
                </TouchableOpacity>
            </View>
            {/* Modal pour le deuxième FlatList */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalPackVisible}
                onRequestClose={() => setModalPackVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Vérifiez si proposegaranties est vide */}
                        {proposegaranties.length === 0 ? (
                            <Text style={styles.emptyMessage}>Aucune couverture supplémentaire disponible.</Text>
                        ) : (
                            <FlatList
                                data={proposegaranties}
                                keyExtractor={item => item.id}
                                ItemSeparatorComponent={() => <View />}
                                renderItem={renderItemProposeGaranties}
                            />
                        )}

                        {/* Bouton pour fermer le modal */}
                        <TouchableOpacity onPress={() => setModalPackVisible(false)}>
                            <Text style={styles.close}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Formulaire d'ajout */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showAddForm}
                onRequestClose={() => setShowAddForm(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Champs de formulaire */}
                        <Text style={styles.label} >Demande d'ajout de garantie </Text>
                        <Text style={styles.emptyMessage} >Numéro de contrat: {item.NUMCNT}</Text>
                        <Text style={styles.emptyMessage} >Garantie: {formData.garantie}</Text>
                        {/* Ajoutez d'autres champs de formulaire ici */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                style={{ width: 200, margin: 5, borderColor: "#204393" }}
                                textColor="#204393"

                                mode="outlined" onPress={handleAddRequest}>
                                Confirmer
                            </Button>
                            <Button
                                style={[
                                    { width: 200, margin: 5, borderColor: '#d9252c' },

                                ]}
                                textColor='#d9252c'

                                mode="outlined"
                                title="Annuler"
                                onPress={() => setShowAddForm(false)}
                            >
                                Fermer
                            </Button>
                        </View>
                        {showSuccessMessage && (
                            <View>
                                <Text style={styles.emptyMessage}>Nous avons bien reçu votre demande !</Text>
                                <Button title="Fermer" onPress={() => setShowSuccessMessage(false)} />
                            </View>
                        )}

                    </View>

                </View>
            </Modal>
        </ScrollView>

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
        margin: 10,
        borderWidth: 3,
        borderColor: '#ed3026'
    },
    capital: {
        flexDirection: 'row'
    },
    modalText: {
        fontSize: 16,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'justify'
    },
    close: {
        fontSize: 16,
        color: '#ed3026',
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        margin: 10
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 170,
        right: 8,

    },
    info: {
        position: 'absolute',
        //bottom: 170,
        right: -1,
        top: 10

    },
    ajout: {
        position: 'absolute',
        bottom: 3,
        right: -1,
        //top: 10

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
    emptyMessage: {
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary,
    },
    centeredContent2: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat-Regular',
        color: 'white',
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
        margin: 15,
        padding: 16
    },
    card2: {
        shadowColor: 'blue',
        shadowOffset: {
            width: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 10,
        margin: 15,
        padding: 16
    },
    cardHeader: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        justifyContent: 'space-between',
        //flexDirection: 'row'
    },
    cardHeader2: {
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
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        backgroundColor: COLORS.primary,
        margin: 16,
        padding: 10,
        paddingTop: 20,
        height: 80,
        borderRadius: 10,
        borderColor: '#4f69a9',
        borderWidth: 2
    },
    pack: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        backgroundColor: COLORS.primary,
        margin: 16,
        padding: 10,
        paddingTop: 20,
        height: 150,
        borderRadius: 10,
        borderColor: '#4f69a9',
        borderWidth: 2
    },
    title2: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        color: 'white',
    },
    title3: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        marginTop: 10,
        marginLeft: '30%'
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