import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, ScrollView, FlatList, SafeAreaView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import DateField, { YearMonthDateField } from 'react-native-datefield';

const demandeList = ({ navigation }) => {
    const [demandes, setDemandes] = useState([])
    const [token, setToken] = useState('');



    const getDemande = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const result = await client.get("/api/auth/demande/demandes", {
                headers: {
                    Authorization: token,
                },
            })

            console.log("Result:", result.data);
            return result.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            });
        };
        loadFonts();
        const fetchData = async () => {
            const result = await getDemande();
            setDemandes(result);
            console.log("demandes", result);
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(5, 7);
        const day = dateString.slice(8, 10);
        return `${day}/${month}/${year}`;
    };

    /*  const renderItem = ({ item }) => (
 
         <ScrollView >
             <Text >Date </Text>
             <Text>{item.dateCreation}</Text>
             <Text >Objet  </Text>
             <Text>{item.object}</Text>
             <Text >Description </Text>
             <Text >{item.description}</Text>
         </ScrollView>
     ); */

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Détails', { item: item })}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View >
                        <Text style={styles.title}>{item.object}</Text>
                        <Text style={styles.time}> {formatDate(item.dateCreation)}</Text>
                        <Text style={styles.time}>{item.etat}</Text>

                    </View>

                </View>
            </View>
        </TouchableOpacity>

    );
    return (

        <View style={styles.container}>

            <FlatList
                style={styles.list}
                data={demandes}
                keyExtractor={item => {
                    return item.id
                }}
                ItemSeparatorComponent={() => {
                    return <View style={styles.separator} />
                }}
                renderItem={renderItem}
            />

        </View>
    )
}
export default demandeList
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    list: {
        paddingHorizontal: 17,

    },
    separator: {
        marginTop: 10,
    },
    /******** card **************/
    card: {
        shadowColor: 'blue',
        shadowOffset: {
            width: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor: 'light',
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 10
    },
    cardHeader: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        justifyContent: 'space-between',

    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12.5,
        paddingBottom: 25,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    cardImage: {
        flex: 1,
        height: 100,
        width: null,
    },
    /******** card components **************/
    title: {
        fontSize: 18,
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        backgroundColor: COLORS.primary,
        height: 40,
        width: 200,
        marginLeft: 140,
        padding: 8
    },
    time: {
        fontSize: 13,
        color: '#808080',
        marginTop: 5,
    },
    icon: {
        width: 25,
        height: 25,
    },
    /******** social bar ******************/
    socialBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarlabel: {
        marginLeft: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    socialBarButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})