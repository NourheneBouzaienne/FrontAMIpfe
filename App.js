import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerGroup, DrawerScreen } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, StackActions, TabActions } from '@react-navigation/native';

import COLORS from './src/const/colors';
import InscriptionScreen from './src/screens/InscriptionScreen';
import LoginScreen from './src/screens/loginScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { IconComponentProvider, Icon } from "@react-native-material/core";
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import registerScreen from './src/screens/registerScreen';
import { createStackNavigator } from '@react-navigation/stack';
import ActivationForm from './src/screens/ActivationForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import homeScreen from './src/screens/homeScreen';
import demandeScreen from './src/screens/demandesScreen';
import demandesScreen from './src/screens/demandesScreen';
import AddDemande from './src/components/AddDemande';

import { HomeIcon as HomeOutline, HeartIcon as HeartOutline, ShoppingBagIcon as BagOutline } from 'react-native-heroicons/outline';
import { HomeIcon as HomeSolid, HeartIcon as HeartSolid, ShoppingBagIcon as BagSolid } from 'react-native-heroicons/solid';
import profileView from './src/components/profilView';
import demandeList from './src/components/demandeList';
import DetailDemande from './src/components/DetailDemande';
import ContratsScreen from './src/screens/ContratsScreen';


export default function App() {
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();


  const MainStack = createStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      });
    };
    loadFonts();

    try {
      const value = AsyncStorage.getItem('token')

      if (value) {
        isLoggedIn = true;
      } else {
        isLoggedIn = false;
      }
    } catch (e) {
      // error reading value
    }

  }, []);


  function DemandeTabs() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#ed3026',
          inactiveTintColor: 'white',
          ActiveBackgroundColor: '#ed3026',
          inactiveBackgroundColor: COLORS.primary,

        }}
        screenOptions={{
          tabBarStyle: {
            borderRadius: 5,
            marginHorizontal: 10,
            //borderColor: '#ed3026',
            backgroundColor: 'white',
            marginTop: -20
          }
        }}
      >
        <Tab.Screen name="Ajouter une réclamation" component={AddDemande}
          options={{
            title: "Ajouter une réclamation",
            unmountOnBlur: true,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="add-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />
        <Tab.Screen name="Détails" component={DetailDemande}
          options={{
            title: "Détails",
            unmountOnBlur: true,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="information-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />
        {/* <Tab.Screen name="Details" component={DetailsDemande}
          options={{
            title: "Details",
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="md-create" color={color} size={size} />
            )
          }} /> */}
        <Tab.Screen name="Liste des réclamations" component={demandeList}
          options={{
            title: "Liste des réclamations",
            unmountOnBlur: true,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="md-list-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />
      </Tab.Navigator>
    );
  }

  if (isLoggedIn) {
    return (
      <>

        <NavigationContainer>

          <Drawer.Navigator initialRoute='Accueil' screenOptions={{
            headerShown: true,
            drawerType: 'slide',
            drawerStyle: {
              width: 250,
              backgroundColor: COLORS.backgroundNav,
            },
            drawerActiveBackgroundColor: COLORS.primary,
            drawerInactiveTintColor: COLORS.primary,
            drawerActiveTintColor: 'white',
            overlayColor: null,
            sceneContainerStyle: {
              backgroundColor: COLORS.black,
            },
            drawerLabelStyle: {
              fontFamily: 'Montserrat-Regular', // Changer la police de caractères ici
            },
          }}
            drawerContent={props => <CustomDrawerContent {...props} />}
            useLegacyImplementation>

            <Drawer.Screen name="Accueil"
              component={homeScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="home-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Mon Profil"
              component={profileView}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="person-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Mes Contrats"
              component={ContratsScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="md-copy-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Mes Sinistres"
              component={InscriptionScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="car-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Demande Devis"
              component={demandesScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="card-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Assistance"
              component={InscriptionScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <AntDesign name="customerservice" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Réclamations"
              component={DemandeTabs}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="ios-chatbox-ellipses-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Logout"
              component={LoginScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="log-in-outline" size={22} color='#ed3026' />
                )
              }} />
            {/* <Drawer.Screen name="Login"
              component={LoginScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="log-in-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="Register"
              component={registerScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="log-in-outline" size={22} color='#ed3026' />
                )
              }} />
            <Drawer.Screen name="ActivationForm" options={{ drawerLabel: '' }}>
              {() => (
                <MainStack.Navigator>
                  <MainStack.Screen name="ActivationForm" component={ActivationForm} />
                </MainStack.Navigator>
              )}
            </Drawer.Screen> */}
          </Drawer.Navigator>
        </NavigationContainer>

      </>
    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={registerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ActivationForm" component={ActivationForm} options={{ headerShown: false }} />



        </Stack.Navigator>
      </NavigationContainer>
    );
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
