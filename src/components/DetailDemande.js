import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, ScrollView, Alert, TextInput } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../const/colors';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlipCard from 'react-native-flip-card'



const DetailDemande = ({ route, navigation }) => {
    const { item } = route.params;
    const [object, setObject] = useState("");
    const [description, setDescription] = useState("");



    useEffect(() => {
        client.get(`/api/auth/demande/getDemande/` + item.id)
        console.log(item.id)
    }, [])

    return (
        <ScrollView style={styles.container}>
            {/*  <View style={{ height: 200, borderRadius: 3 }} >
                <FlipCard style={{
                    borderWidth: 3,
                    backgroundColor: 'white'
                }}
                >
                    <TextInput
                        style={styles.input}
                        defaultValue={item.object}
                    />
                    <TextInput
                        style={styles.input}
                        defaultValue={item.description}
                    />

                </FlipCard>
            </View> */}

            <View style={[styles.triangleCorner]} />
            <FlipCard style={styles.flipCard}
                friction={6}
                perspective={1000}
                flipHorizontal={true}
                flipVertical={false}
                flip={false}
                clickable={true}>
                {/* front */}
                <View style={[styles.card, styles.card1]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons style={{
                            margin: 12
                        }} name="gesture-swipe" color='#204393' size={20} />
                        <Text
                            style={styles.label}> Vous pouvez suivre l'état de votre réclamation  </Text>
                    </View>

                    <Text
                        style={styles.description}

                    > {item.description}</Text>
                </View>
                {/* back */}
                <View style={[styles.card, styles.card2]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons style={{
                            margin: 12
                        }} name="gesture-swipe" color='#ed3026' size={20} />
                        <Text
                            style={styles.label}> .... </Text>
                    </View>
                    <Text style={styles.etat}>{item.etat}</Text>
                </View>
            </FlipCard>

            <View style={styles.triangleCornerBottomRight} />
        </ScrollView>
    )
}

export default DetailDemande

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        position: 'relative',


    },
    card: {
        borderWidth: 10,
        borderColor: COLORS.primary,
        width: '100%',

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
        fontWeight: 'bold'

    },
    description: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        color: COLORS.primary,
        height: 150
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




    }


})