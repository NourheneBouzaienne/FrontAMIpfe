import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';


import client from '../API/client';
import COLORS from '../const/colors';
import * as Font from 'expo-font';

const QuittancesScreen = ({ navigation }) => {
    const [quittances, setQuittances] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [token, setToken] = useState('');
    const [isLoadingContracts, setIsLoadingContracts] = useState(true);

    const getQuittances = async () => {
        const cin = await AsyncStorage.getItem('cin');
        const token = await AsyncStorage.getItem('token');

        if (cin.trim() !== '') {
            try {
                const result = await client.get("/api/Quittance/listQuittances", {
                    headers: {
                        Authorization: token,
                    },
                });

                setQuittances(result.data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };

        loadData();
        getQuittances();
    }, []);

    const formatDate = (dateString) => {
        if (dateString && dateString.length >= 8) {
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            return `${day}/${month}/${year}`;
        }
        return "---";
    };

    const renderItem = ({ item }) => (
        <View style={styles.quittanceCard}>
            <View style={styles.quittanceHeader}>
                <Text style={styles.quittanceTitle}>Quittance N° {item.NUMQUITT}</Text>
                {item.STATQUIT === '0' ? (
                    <Button
                        style={{ borderColor: "#ed3026" }}
                        textColor="#204393"

                        mode="outlined">
                        Payer
                    </Button>
                ) : (
                    <Text style={styles.quittanceDate}>{formatDate(item.DATEPAIEM)}</Text>
                )}
            </View>
            <View style={styles.quittanceDetails}>
                <View style={styles.quittanceDetail}>
                    <Text style={styles.quittanceLabel}>Montant</Text>
                    <Text style={styles.quittanceValue}>{item.MNTPRNET} {item.CODEDEVIS}</Text>
                </View>
                <View style={styles.quittanceDetail}>
                    <Text style={styles.quittanceLabel}>Produit</Text>
                    <Text style={styles.quittanceValue}>{item.LIBPRDT}</Text>
                </View>
                <View style={styles.quittanceDetail}>
                    <Text style={styles.quittanceLabel}>Statut</Text>
                    <Text style={styles.quittanceValue}>
                        {(() => {
                            switch (item.STATQUIT) {
                                case '0':
                                    return 'Non payée';
                                case '1':
                                    return 'Payée';
                                case '2':
                                    return 'Annulée';
                                default:
                                    return item.STATQUIT;
                            }
                        })()}
                    </Text>
                </View>
            </View>
            <View style={styles.quittanceBottomBorder} />
        </View>
    );


    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={quittances}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View />}
                renderItem={renderItem}
            />
        </View>
    );
};

export default QuittancesScreen;

const styles = StyleSheet.create({
    quittanceCard: {
        margin: 16,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ed3026',
    },
    quittanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    quittanceTitle: {
        fontSize: 18,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',

    },
    quittanceDate: {
        fontSize: 16,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',

    },
    quittanceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: COLORS.primary

    },
    quittanceDetail: {
        flex: 1,
        //marginRight: 6,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',



    },
    quittanceLabel: {
        fontSize: 16,
        color: '#ed3026',
        fontFamily: 'Montserrat-Regular',

    },
    quittanceValue: {
        marginVertical: 12,
        color: COLORS.primary,
        fontFamily: 'Montserrat-Regular',
    },
    quittanceBottomBorder: {
        borderTopWidth: 3,
        borderTopColor: '#ed3026',
        borderStyle: 'dotted', // Style de la bordure pointillée
        marginTop: 16,
    }
});
