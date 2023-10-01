import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const agencies = [
    { name: 'Assurances AMI Ariana', address: '16 Av. de la liberté, Ariana 2091', latitude: 36.86012, longitude: 10.19337 },
    { name: 'Assurances AMI Ennaser', address: 'résidence vinci av Hedi nouira cité ennasr 2, Ariéna 1002', latitude: 36.8493972, longitude: 10.1020978 },
    { name: 'Assurances AMI Aouina', address: '61 Av. Khaled Ibn El Walid, Tunis', latitude: 36.8602282, longitude: 10.2731106 },
    { name: 'Assurances Ami Agence Lac', address: 'Résidence Myriam, Lac Malären, Tunis', latitude: 36.8563545, longitude: 10.1883716 },
    { name: 'Assurances AMI Ariana', address: '19 Rue De Mauritanie, Tunis 1002', latitude: 36.81897, longitude: 10.16579 },
    { name: 'Assurances Ami Agence Moncef Bey', address: ' 10 Av. Moncef Bey, Tunis 1001', latitude: 36.7934197, longitude: 10.1866865 },
    { name: 'AMI ASSURANCE LINA CHIBANI', address: ' Lac Malären, Tunis 1053', latitude: 36.8370766, longitude: 10.2169455 },
    { name: 'AMI Assurances Bouabdallah Hayet La Marsa ', address: 'Immeuble "UIB، 2 Rue Tahar Ben Achour, La Marsa 2078', latitude: 36.8793874, longitude: 10.307868 },
    { name: 'AMI ASSURANCES LAC 2', address: 'rue de la fleur d"érable cité les pins, Tunis 1053', latitude: 36.8491007, longitude: 10.2558949 },
    { name: 'AMI ASSURANCES MOUROUJ 1', address: 'AVENUE MAHDIA EL MOUROUJ 1, 2074', latitude: 36.7346583, longitude: 10.1919939 },


];
const AgencesScreen = () => {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const getUserLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission de localisation non accordée');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                console.log('Erreur lors de la récupération de la position :', error);
            }
        };

        getUserLocation();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Rayon de la Terre en kilomètres
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    const findNearestAgency = () => {
        if (!userLocation) return null;

        let nearestAgency = null;
        let minDistance = Number.MAX_VALUE;

        agencies.forEach((agency) => {
            const distance = calculateDistance(userLocation.latitude, userLocation.longitude, agency.latitude, agency.longitude);
            if (distance < minDistance) {
                nearestAgency = agency;
                minDistance = distance;
            }
        });

        return nearestAgency;
    };

    const nearestAgency = findNearestAgency();

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: userLocation?.latitude || 36.8,
                    longitude: userLocation?.longitude || 10.2,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {agencies.map((agency) => (
                    <Marker
                        key={agency.name}
                        coordinate={{
                            latitude: agency.latitude,
                            longitude: agency.longitude,
                        }}
                        title={agency.name}
                    />
                ))}
                {nearestAgency && (
                    <Marker
                        coordinate={{
                            latitude: nearestAgency.latitude,
                            longitude: nearestAgency.longitude,
                        }}
                        title={nearestAgency.name}
                        pinColor="blue" // Couleur du marqueur de l'agence la plus proche
                    />
                )}
            </MapView>
            {nearestAgency && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Agence la plus proche : {nearestAgency.name}</Text>
                    <Text style={styles.infoText}>
                        Distance : {calculateDistance(userLocation.latitude, userLocation.longitude, nearestAgency.latitude, nearestAgency.longitude).toFixed(2)} km
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 8,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default AgencesScreen;
