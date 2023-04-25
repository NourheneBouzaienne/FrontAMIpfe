import { StyleSheet, Text, View, Image } from 'react-native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import React from 'react'

const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
    return (
        <><DrawerContentScrollView style={{ paddingVertical: 20 }} >
            <View style={{
                marginLeft: 10,
                marginVertical: 10,
                marginBottom: 30
            }}>
                <Image source={require('../../assets/AmiLOGO.png')} style={{ height: 80, width: 230 }} />
            </View>
            <DrawerItemList {...props} />
            {/* <DrawerItem
                label="Help"
                onPress={() => props.navigation.navigate('Notifications')}
            /> */}

        </DrawerContentScrollView>
            {/*  <Drawer.Screen name="Home" component={HomeScreen} />

            {(props) => <HomeScreen  {...props} />} */}
        </>
    )
}

export default CustomDrawerContent

const styles = StyleSheet.create({})