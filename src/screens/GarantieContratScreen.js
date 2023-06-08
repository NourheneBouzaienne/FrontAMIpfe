import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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

            </View>

            <View style={styles.buttonContainer}>
                {/* Le bouton moderne en haut à gauche */}
                <Button
                    icon="information"
                    mode="contained"
                    onPress={() => showPopup(item)}
                    contentStyle={styles.button}
                    buttonColor='#204393'
                    textColor='white'
                >
                    Détails garantie
                </Button>
            </View>
        </View>

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
        bottom: 8,
        right: 8,

    },
    button: {

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