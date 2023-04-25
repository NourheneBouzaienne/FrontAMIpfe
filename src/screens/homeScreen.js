
import { StyleSheet, Text, View } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import 'react-native-gesture-handler';
import React, { useRef, useState } from "react";



const Drawer = createDrawerNavigator();


const homeScreen = () => {

    return (
        <View>
            <Text>home screen</Text>
        </View>

    )
}

export default homeScreen

const styles = StyleSheet.create({})