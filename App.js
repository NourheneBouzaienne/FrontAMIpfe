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
import demandeList from './src/components/demandeList';
import DetailDemande from './src/components/DetailDemande';
import ContratsScreen from './src/screens/ContratsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import profileView from './src/components/profilView';
import DetailContratScreen from './src/screens/DetailContratScreen';
import GarantieContratScreen from './src/screens/GarantieContratScreen';
import AddSinistreScreen from './src/screens/AddSinistreScreen';
import DetailSinistre from './src/screens/DetailSinistre';
import sinistreList from './src/screens/sinistreList';
import DevisScreen from './src/screens/DevisScreen';
import AddDemandeDevisScreen from './src/screens/AddDemandeDevisScreen';
import ListDemandeDevis from './src/screens/ListDemandeDevis';
import NotificationsScreen from './src/screens/NotificationsScreen';
import helpScreen from './src/screens/helpScreen';
import OneSignal from 'react-native-onesignal';


import Constants from "expo-constants";
import NumerosUtiles from './src/screens/NumerosUtiles';
import ConseilsUtiles from './src/screens/ConseilsUtiles';
import AgencesScreen from './src/screens/AgencesScreen';
import QuittancesScreen from './src/screens/QuittancesScreen';
import LogoutScreen from './src/screens/LogoutScreen';
import AssistanceScreen from './src/screens/AssistanceScreen';
export default function App() {
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();


  const MainStack = createStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //const ONESIGNAL_APP_ID = "5080cbfd-767a-475d-ad79-580f76fb3bb3";



  /* OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);

  // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
  OneSignal.promptForPushNotificationsWithUserResponse();

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
  });
 */
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

  function ContratStackScreen() {
    return (
      <MainStack.Navigator>
        <MainStack.Screen name="Mes contrats" component={ContratsScreen} options={{
          headerShown: false,
          unmountOnBlur: true,

        }} />
        <MainStack.Screen name="Détails de votre contrat" component={DetailContratScreen} options={{
          unmountOnBlur: true, // Masquer l'en-tête de navigation 
          cardStyle: { backgroundColor: '#204393' },
          headerStyle: {
            backgroundColor: '#204393', // Couleur de fond de l'en-tête
            height: 80, // Hauteur de l'en-tête
            color: 'white',
          },
          headerTitleStyle: {
            color: 'white', // Couleur du texte du titre de l'en-tête
          },
          headerTintColor: 'white', // Couleur de la flèche de retour

        }} />
        <MainStack.Screen name="Détails Garanties" component={GarantieContratScreen} options={{
          unmountOnBlur: true,
          headerTintColor: '#204393', // Changer la couleur du titre ici
        }} />

      </MainStack.Navigator>
    );
  }

  function ProfilStackScreen() {
    return (
      <MainStack.Navigator>
        <MainStack.Screen name="Mon Profil" component={ProfileScreen} options={{

          unmountOnBlur: true,// Masquer l'en-tête de navigation
          headerShown: false,
        }} />
        <MainStack.Screen name="Update Profil" component={profileView} options={{
          unmountOnBlur: true,
          headerTintColor: '#204393',
        }} />

      </MainStack.Navigator>
    );
  }

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
  function DevisTabs() {
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
        <Tab.Screen name="Individuel Accident" component={DevisScreen}
          options={{
            title: "Individuel Accident",
            unmountOnBlur: true,
            headerShown: true,
            headerTintColor: '#204393',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="man-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />
        <Tab.Screen name="Multirique Habitation" component={AddDemandeDevisScreen}
          options={{
            title: "Multirisque Habitation",
            unmountOnBlur: true,
            headerTintColor: '#204393',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="home-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />

        <Tab.Screen name="Liste des demandes" component={ListDemandeDevis}
          options={{
            title: "Liste des demandes",
            unmountOnBlur: true,
            headerTintColor: '#204393',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="md-list-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />
      </Tab.Navigator>
    );
  }
  function SinistreTabs() {
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
        <Tab.Screen name="Déclarer un sinistre" component={AddSinistreScreen}
          options={{
            title: "Déclarer un sinistre",
            unmountOnBlur: true,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="add-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            ),
            headerTintColor: '#204393',
          }} />
        <Tab.Screen name="Détails" component={DetailSinistre}
          options={{
            title: "Détails",
            unmountOnBlur: true,
            headerShown: false,
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
        <Tab.Screen name="Liste des sinsitres" component={sinistreList}
          options={{
            title: "Liste des sinsitres",
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="md-list-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            ),

          }} />
      </Tab.Navigator>
    );
  }

  function HomeTabs() {
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
        <Tab.Screen name="Numéros utiles" component={NumerosUtiles}
          options={{
            title: "Numéros utiles",
            unmountOnBlur: true,
            tabBarIcon: ({ color, size, focused }) => (
              <AntDesign name="phone" color={focused ? 'red' : 'white'} size={size} />
            ),
            headerTintColor: '#204393',
          }} />
        <Tab.Screen name="Conesils" component={ConseilsUtiles}
          options={{
            title: "Conesils",
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="information-circle-outline" color={focused ? 'red' : 'white'} size={size} />
            )
          }} />

        <Tab.Screen name="Agences" component={AgencesScreen}
          options={{
            title: "Agences",
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons name="map-marker-radius-outline" color={focused ? 'red' : 'white'} size={size} />
            ),

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
              component={HomeTabs}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="home-outline" size={22} color='#ed3026' />
                ),

                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Mon Profil"
              component={ProfilStackScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="person-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Mes contrats"
              component={ContratStackScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="md-copy-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Mes sinistres"
              component={SinistreTabs}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="car-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Mes quittances"
              component={QuittancesScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="receipt-outline" size={22} color='#ed3026' />
                ),

                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Demande Devis"
              component={DevisTabs}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="card-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Assistance"
              component={AssistanceScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <AntDesign name="customerservice" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Réclamations"
              component={DemandeTabs}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="ios-chatbox-ellipses-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />

            <Drawer.Screen name="Aide"
              component={helpScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="help-circle-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />
            <Drawer.Screen name="Notifications"
              component={NotificationsScreen}
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="notifications-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }} />

            <Drawer.Screen
              name="Logout"
              options={{
                drawerIcon: ({ color }) => (
                  <Ionicons name="log-out-outline" size={22} color='#ed3026' />
                ),
                headerTintColor: '#204393',
              }}
            >
              {() => <LogoutScreen setIsLoggedIn={setIsLoggedIn} />}
            </Drawer.Screen>
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
          <Stack.Screen name="Login" options={{ headerShown: false }} >
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
