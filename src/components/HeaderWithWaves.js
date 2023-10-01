import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HeaderWithWaves = () => {
    return (
        <View style={styles.headerContainer}>
            <LinearGradient
                colors={['#204393', '#ffffff']} // Replace with your desired wave color and background color
                style={styles.waves}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: -1,
        left: 0,
        right: 0,
        zIndex: -1,
        height: 110, // Adjust the height of the header as needed
    },
    waves: {
        flex: 1,
    },
});

export default HeaderWithWaves;
