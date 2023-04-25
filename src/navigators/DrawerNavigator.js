import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import COLORS from '../../const/colors'
import SafeAreaView from 'react-native-safe-area-view';

import React from 'react'
import HomeScreen from '../screens/homeScreen'

const Drawer = createDrawerNavigator()

const DrawerNavigator = ({ navigation }) => {
    return (
        <DrawerNavigator useLegacyImplementation initialRouteName="Home" screenOptions={{
            headerShown: false,
            drawerType: 'slide',
            drawerStyle: {
                width: 200,

            },
            overlayColor: null,
            sceneContainerStyle: {
            },
        }}>

            <Drawer.Screen name="Home" component={HomeScreen} />
            {/*  {(props) => <HomeScreen  {...props} />} */}

        </DrawerNavigator>
    )
}

export default DrawerNavigator

const styles = StyleSheet.create({})