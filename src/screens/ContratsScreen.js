import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, StyleSheet } from 'react-native';
import client from '../API/client';

const ContractsScreen = () => {
    const [contracts, setContracts] = useState([]);
    const [newContract, setNewContract] = useState('');
    const [cin, setCin] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [token, setToken] = useState('');

    const getCinFromStorage = async () => {
        try {
            const storedCin = await AsyncStorage.getItem('cin');
            if (storedCin) {
                setCin(storedCin);
            }
            console.log(storedCin)
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
            console.log(token)
        } catch (error) {
            console.log('Erreur lors de la récupération du CIN depuis AsyncStorage', error);
        }
    };

    useEffect(() => {
        getCinFromStorage();
    }, []);

    const addContract = async () => {
        if (newContract.trim() !== '' && cin.trim() !== '') {
            try {
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
                } else {
                    console.log('Erreur lors de la requête API');
                }
            } catch (error) {
                console.log('Erreur lors de la requête API', error);
            }
        }
    };


    return (
        <View>
            <Button title="Ajouter un contrat" onPress={() => setIsModalVisible(true)} />

            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Ajouter un contrat</Text>
                    <TextInput
                        value={newContract}
                        onChangeText={text => setNewContract(text)}
                        placeholder="Numéro de contrat"
                        style={styles.textInput}
                    />
                    <Button title="Ajouter" onPress={addContract} />
                    <Button title="Annuler" onPress={() => setIsModalVisible(false)} />
                </View>
            </Modal>

            <Text>Liste des contrats :</Text>
            {contracts.map((contract, index) => (

                <><Text> numéro contrat </Text>
                    <Text key={index}>{contract.NUMCNT}</Text>
                    <Text> code </Text>
                    <Text key={index}>{contract.CODPROD}</Text>
                    <Text> date début </Text>
                    <Text key={index}>{contract.DEBCNT}</Text>
                    <Text> date Fin</Text>
                    <Text key={index}>{contract.FINCNT}</Text>
                </>

            ))}
        </View>
    );
};



export default ContractsScreen;
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});