import React, { useState } from 'react';
import { StyleSheet, View, Modal, ImageBackground, Image, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlipCard from 'react-native-flip-card'
import { Button, TextInput } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment'


const DetailSinistre = ({ route, navigation }) => {
    const { item } = route.params;
    const [showModal, setShowModal] = useState(false);
    const [object, setObject] = useState('Etat Quittance');
    const [description, setDescription] = useState(`Réclamation pour le sinistre ${item.N_SINISTRE}: Je souhaiterais obtenir des informations sur l'avancement de mon dossier de sinistre et la disponibilité du chèque d'indemnisation. Merci de me tenir informé(e) dès que possible.`);
    const [dateCreation, setDateCreation] = useState(moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
    const [categ, setCateg] = useState('Sinistre');
    const [etat, setEtat] = useState('Non traitée');
    const [response, setResponse] = useState('NULL');

    const [token, setToken] = useState('');

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const openModal = () => {
        setShowModal(true)
    };

    const detailsContrats = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }

        try {
            const res = await client.get('api/auth/sinistre/getSinistreByNUMSNT', {
                headers: {
                    Authorization: token,
                },
                params: {
                    NUMSNT: item.N_SINISTRE,
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
    const handleDemande = async () => {
        const formData = {
            object,
            description,
            dateCreation: moment(dateCreation, 'YYYY-MM-DD HH:mm:ss.SSS').toDate(),
            etat,
            categ,
            response
        };

        try {
            const res = await client.post(
                "/api/auth/demande/addDemande",
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
                // Notif
                Alert.alert('Nous avons bien reçu votre réclamation !');
                //navigation.navigate("Liste des réclamations");
                setShowModal(false);

            }
        } catch (error) {
            // Gérez les erreurs de l'appel API
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity>
                <View style={styles.flipCard}>
                    <View style={[styles.card, styles.card1]}>

                        <View style={styles.details}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.modalTitle}> Sinistre : {item.N_SINISTRE} </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome5 name="file-contract" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.labelInfo}>Numéro de contrat  </Text>
                                <Text style={styles.description}> {item.NUMCNT}</Text>
                            </View>
                            <View style={styles.columnSeparator} />


                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="calendar-cursor" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.labelInfo}>Date étape  </Text>
                                <Text style={styles.description}> {item.DT_ETAT}</Text>


                            </View>


                            <View style={styles.columnSeparator} />

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="card" size={25} color='#ed3026' />
                                </View>
                                <Text style={styles.time}>Total remboursement : {item.TOTALREMBOURSE} DT </Text>



                            </View>

                            <View style={styles.columnSeparator} />

                            <View style={styles.stepContainer}>
                                <View style={styles.datesContainer}>
                                    <View style={styles.dateContainer}>
                                        <View style={styles.iconContainer}>
                                            <FontAwesome5 name="spinner" size={25} color='#ed3026' />
                                        </View>
                                        <Text style={styles.time}> Etape actuelle: {item.ETAPEACTUELLE}</Text>
                                    </View>

                                </View>
                            </View>

                            <View style={styles.columnSeparator} />

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="receipt" size={25} color='#ed3026' />
                                </View>

                                <Text style={styles.description}>
                                    Etat Quittance : {(() => {
                                        switch (item.ETAT_QUIT) {
                                            case 'P':
                                                return 'Payé';
                                            case 'E':
                                                return 'En cours de Traitement';
                                            default:
                                                return item.ETAT_QUIT;
                                        }
                                    })()}
                                </Text>

                            </View>



                            <View>
                                <Button style={{ marginLeft: '20%', marginTop: 20, width: 200, backgroundColor: '#ed3026' }}
                                    textColor="white"
                                    icon="send-outline"
                                    mode="elevated"
                                    onPress={openModal}>Envoyer réclamation</Button>
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
            <Modal visible={showModal} transparent={true} animationType="fade" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Envoyer une réclamation</Text>
                        <Text style={{ margin: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}> Objet </Text>

                        <TextInput
                            style={styles.disabledInput}
                            value={object}
                            editable={false}

                        />
                        <Text style={{
                            margin: 5, color: '#204393', fontFamily: 'Montserrat-Regular'
                        }}> Catégorie </Text>

                        <TextInput
                            style={styles.disabledInput}
                            value={categ}
                            editable={false}
                        />

                        <Text style={{ margin: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}> Date </Text>
                        <TextInput
                            style={styles.disabledInput}
                            value={dateCreation}
                            editable={false}
                        />

                        <Text style={{ margin: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}> Description </Text>

                        <TextInput
                            label="Saisissez votre réclamation"
                            mode="outlined"
                            activeOutlineColor='#204393'
                            outlineColor="#fbfbfb"
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            numberOfLines={5}
                            style={{

                                textAlignVertical: 'top',
                                textAlign: 'left',
                                backgroundColor: '#f2f2f2',
                                padding: 10,

                            }}
                        />
                        <Button
                            title="Envoyer"
                            onPress={handleDemande}
                            style={{
                                width: 150, margin: 5, borderColor: '#d9252c', backgroundColor: '#d9252c', alignSelf: 'center'
                            }}
                            textColor="white"
                            icon="arrow-expand-right"
                            mode="contained"
                        > Envoyer </Button>
                        <Button
                            title="Annuler"
                            onPress={() => setShowModal(false)} // Fermer le modal sans envoyer la réclamation
                            style={{ width: 150, borderColor: '#d9252c', backgroundColor: '#204393', alignSelf: 'center' }}
                            textColor="white"
                            icon="arrow-expand-left"
                            mode="contained"
                        >
                            Annuler
                        </Button>
                    </View>
                </View>
            </Modal>

        </ScrollView >
    );

}

export default DetailSinistre

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        //backgroundColor: 'white',
        position: 'relative',
        marginTop: 30

    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        width: '85%',
        // Autres styles du contenu du modal
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 7,
        // Autres styles du titre du modal
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 5,
        //backgroundColor: '#f5f5f5'
        // Autres styles du champ de saisie, 

    },
    disabledInput: {
        backgroundColor: '#f4f5f8'
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
        borderColor: '#ed3026',
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