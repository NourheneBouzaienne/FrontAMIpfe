import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FooterWithWaves = () => {
    return (
        <View style={styles.footerContainer}>
            <LinearGradient
                colors={['#204393', '#ffffff']} // Replace with your desired wave color and background color
                style={styles.waves}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        //position: 'absolute',
        bottom: -2, // Place the footer at the bottom of the screen
        left: 0,
        right: 0,
        zIndex: -1,
        height: 120, // Adjust the height of the footer as needed
        transform: [{ rotate: '180deg' }], // Rotate the footer by 180 degrees
    },
    waves: {
        flex: 1,
    },
});

export default FooterWithWaves;
