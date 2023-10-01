import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import COLORS from '../const/colors';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'


const AddDemandeDevisScreen = () => {
    const [typeOccupant, setTypeOccupant] = useState('');
    const [pack, setPack] = useState('');
    const [garanties, setGaranties] = useState([]);
    const [montantImmobilier, setMontantImmobilier] = useState(1000);
    const [montantMobilier, setMontantMobilier] = useState(1000);
    const [token, setToken] = useState('');
    const [categ, setCateg] = useState('MultiRisqueHabitation');

    const [occupants, setOccupants] = useState([]);
    const [packs, setPacks] = useState([]);
    const [selectedOccupant, setSelectedOccupant] = useState(null);
    const [selectedPack, setSelectedPack] = useState(null);
    const [cin, setCin] = useState('');
    const [nombrePieces, setNombrePieces] = useState(0);

    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const increasePieces = () => {
        setNombrePieces(nombrePieces + 1);
    };

    const decreasePieces = () => {
        if (nombrePieces > 0) {
            setNombrePieces(nombrePieces - 1);
        }
    };
    const navigation = useNavigation();

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();

    }, [])

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    // Partie 2 : Récupérer les types d'occupant
    useEffect(() => {
        const fetchOccupants = () => {
            if (token && token.trim() !== '') {
                try {
                    client.get('/api/auth/occupants', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                    })
                        .then((response) => {
                            setOccupants(response.data);
                        });
                } catch (error) {
                    console.error('Erreur lors de la récupération des types d\'occupant:', error.message);
                }
            };
        };

        // Appel de la fonction pour récupérer les données
        fetchOccupants();
    }, [token]);

    // Partie 3 : Récupérer les packs
    useEffect(() => {
        const fetchPacks = () => {
            if (token && token.trim() !== '') {
                try {
                    client.get('/api/auth/packs', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                    })
                        .then((response) => {
                            setPacks(response.data);
                        });
                } catch (error) {
                    console.error('Erreur lors de la récupération des packs:', error.message);
                };
            }
        };

        // Appel de la fonction pour récupérer les données
        fetchPacks();
    }, [token]);

    const handleTypeOccupantSelect = (selectedOccupant) => {
        setSelectedOccupant(selectedOccupant);
        // Réinitialisez les garanties sélectionnées lorsque l'utilisateur change le type d'occupant
        setGaranties([]);
    };

    const handlePackSelect = (selectedPack) => {
        setSelectedPack(selectedPack);
        // Réinitialisez les garanties sélectionnées lorsque l'utilisateur change le pack
        setGaranties([]);
    };

    const handleFetchGaranties = () => {
        if (!selectedOccupant?.id || !selectedPack?.id) {
            Alert.alert('Erreur', 'Veuillez sélectionner le type d\'occupant et le pack.');
            return;
        }

        const url = `/api/auth/garanties/${selectedOccupant.id}/${selectedPack.id}`;

        client
            .get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            .then((response) => {
                setGaranties(response.data);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des garanties :', error.message);
            });
    };

    const handleConfirmDevis = () => {
        if (!selectedOccupant || !selectedPack || garanties.length === 0 || !montantImmobilier || !montantMobilier || !nombrePieces) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs requis.');
            return;
        }

        // Obtenir la date d'aujourd'hui
        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

        // Créer l'objet JSON avec toutes les valeurs nécessaires
        const devisData = {
            typeOccupant: selectedOccupant,
            pack: selectedPack,
            garanties: garanties,
            date: currentDate, // Date d'aujourd'hui
            montantImmobilier: parseFloat(montantImmobilier),
            montantMobilier: parseFloat(montantMobilier),
            nombrePieces: parseInt(nombrePieces),
        };
        console.log(pack)
        console.log(typeOccupant.id)

        // Effectuez une requête POST à votre API pour ajouter le devis
        client.post('/api/auth/devis/multiRisqueHabitation', devisData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token, // Ajouter le token JWT dans l'en-tête Authorization
            },
        })
            .then(response => {
                console.log('Devis ajouté avec succès !');
                // Afficher un message de succès ou rediriger vers une autre page
                console.log(response.data);
                if (response.status >= 200 && response.status < 300) {
                    setErrorMessage('Nous avons bien reçu votre demande, vous recevrez un mail dans les plus brefs délais!');
                    console.log('Setting showModal to true');
                    setShowModal(true);
                    //navigation.navigate("Liste des demandes");
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du devis :', error.message);
                // Afficher un message d'erreur ou traiter l'erreur
            });
    };

    return (
        <View style={styles.container}>
            <ScrollView >
                <Text style={styles.heading}>Cliquer sur  le type d'occupant :</Text>
                <View style={styles.radioContainer}>
                    {occupants.map((occupant) => (
                        <TouchableOpacity
                            key={occupant.id}
                            style={styles.outlinedButton}
                            onPress={() => handleTypeOccupantSelect(occupant)}
                        >
                            <Text style={styles.outlinedButtonText}>{occupant.nom}</Text>
                            {selectedOccupant?.id === occupant.id && <View style={styles.radioButtonSelected} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.heading}>Cliquer sur le type de pack :</Text>
                <View style={styles.radioContainer}>
                    {packs.map((packtype) => (
                        <TouchableOpacity
                            key={packtype.id}
                            style={styles.outlinedButton}
                            onPress={() => handlePackSelect(packtype)}
                        >
                            <Text style={styles.outlinedButtonText}>{packtype.type}</Text>
                            {selectedPack?.id === packtype.id && <View style={styles.radioButtonSelected} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={[styles.viewGarantiesButton]} onPress={handleFetchGaranties}>
                    <Text style={styles.viewGarantiesButtonText}>Voir les garanties</Text>
                </TouchableOpacity>

                <FlatList
                    data={garanties.filter((garantie) => garantie && garantie.id)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.garantieItem}>
                            <Text style={styles.garantieNom}>Nom: {item.nom}</Text>
                            <Text style={styles.garantieCategorie}>Catégorie: {item.categorie}</Text>
                        </View>
                    )}
                />


                {/* Ajouter ici les TextInput pour les montants et le nombre de pièces */}
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>Montant immobilier : {montantImmobilier}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={100}
                        maximumValue={100000}
                        step={100}
                        value={montantImmobilier}
                        onValueChange={(value) => setMontantImmobilier(value)}
                        minimumTrackTintColor={COLORS.red} // Couleur de la piste du slider avant le curseur
                        thumbTintColor={COLORS.red} // Couleur du curseur
                        maximumTrackTintColor="#ccc" // Couleur de la piste du slider après le curseur
                    />
                </View>

                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>Montant mobilier : {montantMobilier}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={100}
                        maximumValue={100000}
                        step={100}
                        value={montantMobilier}
                        onValueChange={(value) => setMontantMobilier(value)}
                        minimumTrackTintColor={COLORS.red} // Couleur de la piste du slider avant le curseur
                        thumbTintColor={COLORS.red} // Couleur du curseur
                        maximumTrackTintColor="#ccc" // Couleur de la piste du slider après le curseur
                    />
                </View>
                <View style={styles.numericInputContainer}>
                    <Text style={styles.numericInputLabel}>Nombre de pièces :</Text>
                    <View style={styles.numericInput}>
                        <TouchableOpacity style={styles.numericButton} onPress={decreasePieces}>
                            <Text style={styles.numericButtonText}>-</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.numericTextInput}
                            value={nombrePieces.toString()}
                            onChangeText={setNombrePieces}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.numericButton} onPress={increasePieces}>
                            <Text style={styles.numericButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmDevis}
                >
                    <Text style={styles.TextButton}>Confirmer la demande</Text>
                </TouchableOpacity>
                <Modal
                    visible={showModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalContainer}>

                        <View style={styles.modalContent}>
                            <Ionicons name="mail-unread-outline" size={30} color='#ed3026' style={styles.icon} />
                            <Text style={styles.errorMessage}>{errorMessage}</Text>
                            <Button style={{
                                width: 150, justifyContent: 'center',
                                alignItems: 'center'
                            }} buttonColor={'#ed3026'} mode="contained" onPress={() => {
                                setShowModal(false);
                                navigation.navigate("Liste des demandes"); // Déplacez ici la navigation
                            }}> OK  </Button>
                        </View>
                    </View>
                </Modal>
            </ScrollView>

        </View>

    );
};

export default AddDemandeDevisScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',

    },
    heading: {
        marginVertical: 8,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary,
    },
    outlinedButton: {
        borderWidth: 2,
        borderColor: COLORS.primary, // Couleur du contour
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewGarantiesButton: {
        backgroundColor: COLORS.primary, // Couleur de fond du bouton
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',

    },
    viewGarantiesButtonText: {
        color: 'white', // Couleur du texte
        padding: 5,
        fontFamily: 'Montserrat-Regular',
    },
    outlinedButtonText: {
        color: COLORS.primary, // Couleur du texte
        fontSize: 16,
        marginLeft: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#204393', // Change the color according to your design
        marginLeft: 8,
    },
    fetchButton: {
        backgroundColor: 'lightblue',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    sliderContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    sliderLabel: {
        fontSize: 16,
        color: COLORS.primary,
        marginBottom: 10,
        fontFamily: 'Montserrat-Regular',
    },
    slider: {
        width: '100%',
    },
    TextButton: {
        fontFamily: 'Montserrat-Regular',
        color: 'white'
    },

    numericInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Utilisation de justifyContent pour répartir l'espace
        width: '50%', // Largeur totale de la vue
        marginBottom: 20,
    },
    numericInputLabel: {
        fontSize: 16,
        color: COLORS.primary,
        marginRight: 10,
        fontFamily: 'Montserrat-Regular',
    },
    numericInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,

        borderRadius: 5,
        padding: 5,
    },
    numericTextInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        paddingHorizontal: 10,
        textAlign: 'center',
        color: COLORS.primary,
    },
    numericButton: {
        paddingHorizontal: 20,
        color: COLORS.red,

    },
    numericButtonText: {
        fontSize: 18,
        color: COLORS.red,
    },
    confirmButton: {
        backgroundColor: '#d9252c',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 32,
        alignSelf: 'center'
        //width: '70%'

    },
    garantieItem: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    garantieNom: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary,

    },
    garantieCategorie: {
        fontSize: 12,
        color: '#666',
    },

    sliderContainer: {
        padding: 10,
        marginBottom: 20,
    },
    slider: {
        width: '100%',
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
        //flex: 1, // Utilisez flex: 1 au lieu de height: '20%'
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

});