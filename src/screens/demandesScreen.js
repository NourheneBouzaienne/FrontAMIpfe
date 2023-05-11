import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DemandeList from '../components/demandeList'

const demandesScreen = ({ navigation }) => {
    return (
        <View>
            <DemandeList navigation={navigation} />
        </View>
    )
}

export default demandesScreen

const styles = StyleSheet.create({})