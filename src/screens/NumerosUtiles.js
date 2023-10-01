import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const NumerosUtiles = () => {
    const emergencyNumbers = [
        { name: 'Police Nationale', number: '197', icon: 'phone' },
        { name: 'Protection Civile', number: '198', icon: 'phone' },
        { name: 'SAMU', number: '190', icon: 'phone' },
        { name: 'Générale Assistance', number: '70 01 50 00', icon: 'phone' },
        { name: 'Numéro Vert', number: '801111', icon: 'phone' },
        { name: 'Garde Nationale', number: '193', icon: 'phone' },
        { name: 'Afrique Assistance', number: '71 10 45 80', icon: 'phone' },
    ];

    const callNumber = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.gridContainer}>
                <View style={styles.row}>
                    {emergencyNumbers.slice(0, 2).map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => callNumber(item.number)}>
                            <View style={styles.card}>
                                <AntDesign name={item.icon} size={24} color="#ed3026" style={styles.icon} />
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardNumber}>{item.number}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    {emergencyNumbers.slice(2, 4).map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => callNumber(item.number)}>
                            <View style={styles.card}>
                                <AntDesign name={item.icon} size={24} color="#ed3026" style={styles.icon} />
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardNumber}>{item.number}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    {emergencyNumbers.slice(4, 6).map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => callNumber(item.number)}>
                            <View style={styles.card}>
                                <AntDesign name={item.icon} size={24} color="#ed3026" style={styles.icon} />
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardNumber}>{item.number}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    {emergencyNumbers.slice(6).map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => callNumber(item.number)}>
                            <View style={styles.card}>
                                <AntDesign name={item.icon} size={24} color="#ed3026" style={styles.icon} />
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardNumber}>{item.number}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/*     <View style={styles.videoContainer}>
                <WebView
                    style={styles.video}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: 'https://www.youtube.com/watch?v=YtAqxTPaIds&embeds_referring_euri=https%3A%2F%2Fwww.assurancesami.com%2F&source_ve_path=MjM4NTE&feature=emb_title' }} // Remplacez VIDÉO_ID par l'ID de la vidéo YouTube que vous souhaitez afficher
                />
            </View> */}
        </ScrollView>
    );
};

export default NumerosUtiles;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    row: {
        width: '48%',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#ed3026'
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        color: '#204393',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardNumber: {
        fontSize: 14,
        color: '#204393',
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
    },
    videoContainer: {
        width: '100%',

        aspectRatio: 16 / 9, // Rapport d'aspect de la vidéo (16:9 est le format courant pour les vidéos YouTube)
        marginBottom: 10,
    },
    video: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
});
