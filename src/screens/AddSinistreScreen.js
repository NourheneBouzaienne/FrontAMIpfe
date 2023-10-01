import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Linking, Animated } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';


import COLORS from '../const/colors';

import client from '../API/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectPicker from 'react-native-form-select-picker';

import DateField, { YearMonthDateField } from 'react-native-datefield';
import moment from 'moment';

import { Button, TextInput, Divider } from 'react-native-paper';




const AddSinistreScreen = () => {
  const mapRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [formValues, setFormValues] = useState({
    numCnt: '',
    date: '',
    description: '',
  });
  const [constatPhotos, setConstatPhotos] = useState([]);
  const [sinistrePhotos, setSinistrePhotos] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [token, setToken] = useState('');
  const [photos, setPhotos] = useState([]);
  const [Files, setFiles] = useState([]);
  const [location, setLocation] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(location);
  const [contractList, setContractList] = useState([]);
  const [cin, setCin] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);

  const [remorquage, setRemorquage] = useState(null);


  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isPhotoConstatSelected, setIsPhotoConstatSelected] = useState(false);
  const [isPhotoSinistreSelected, setIsPhotoSinistreSelected] = useState(false);

  const [localisation, setLocalisation] = useState(null);
  const [towingService, setTowingService] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const previousContract = useRef(selectedContract);

  const [progress, setProgress] = useState(new Animated.Value(0));





  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      const storedCin = await AsyncStorage.getItem('cin');
      if (storedCin) {
        setCin(storedCin);
      }
    };
    getToken();
  }, []);


  const getContrats = async () => {
    if (cin.trim() !== '') {
      try {
        setIsLoadingContracts(true);
        // Appel API pour récupérer les contrats du client
        const result = await client.get("/api/auth/Client/ContratsSinistre", {
          headers: {
            Authorization: token,
          },
        });
        setContractList(result.data)
        setIsLoadingContracts(false);


        console.log(contractList)
        return result.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

  const handleContractChange = (value) => {
    setSelectedContract(value);
    handleInputChange('numCnt', value);
  };

  const handleDateChange = (value) => {
    handleInputChange('date', value);
  };
  const getRemorquage = async () => {
    if (cin.trim() !== '') {
      try {
        const res = await client.get('/api/auth/Client/getRemorquage', {
          headers: {
            Authorization: token,
          },
          params: {
            numCNT: selectedContract,
          },
        });
        setRemorquage(res.data);
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

  useEffect(() => {
    getContrats();
  }, []);

  useEffect(() => {
    const delay = 500; // Délai en millisecondes
    const timeoutId = setTimeout(() => {
      if (selectedContract !== previousContract.current) {
        getRemorquage();
        previousContract.current = selectedContract;
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [selectedContract]);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync();
      setLocation(currentLocation.coords);
    };

    getLocation();
  }, []);

  const handleInputChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleConstatPhotosChange = (photos) => {
    setConstatPhotos(photos);
  };

  const handleSinistrePhotosChange = (photos) => {
    setSinistrePhotos(photos);
  };


  const showDatepicker = () => {
    setShowDatePicker(true);
  };



  /*  const handleMapPress = (event) => {
     const { latitude, longitude } = event.nativeEvent.coordinate;
 
     console.log(event.nativeEvent); // Vérifier les valeurs des coordonnées dans la console
 
     if (typeof latitude === 'number' && typeof longitude === 'number') {
       console.log('Adding coordinates:', { latitude, longitude }); // Vérifier les coordonnées ajoutées
       setCoordinates([...coordinates, { latitude, longitude }]);
       setMarkerCoordinate({ latitude, longitude });
       console.log(typeof latitude);
       console.log(typeof longitude);
     } else {
       console.error("Les valeurs de longitude et latitude ne sont pas valides");
     }
   }; */
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCoordinates([{ latitude, longitude }]);
    console.log('Adding coordinates:', { latitude, longitude }); // Vérifier les coordonnées ajoutées
    setMarkerCoordinate({ latitude, longitude });
  };


  const fitMapToBounds = () => {
    if (coordinates.length > 0) {
      const minLat = Math.min(...coordinates.map((coord) => coord.latitude));
      const maxLat = Math.max(...coordinates.map((coord) => coord.latitude));
      const minLng = Math.min(...coordinates.map((coord) => coord.longitude));
      const maxLng = Math.max(...coordinates.map((coord) => coord.longitude));

      const southwest = { latitude: minLat, longitude: minLng };
      const northeast = { latitude: maxLat, longitude: maxLng };
      const bounds = [southwest, northeast];

      mapRef.current.fitToCoordinates(bounds, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true
      });
    }
  };


  const pickImagesConstat = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        multiple: true,
      });

      if (!result.canceled) {
        const selectedFiles = result.assets.map(asset => {
          setIsPhotoConstatSelected(true);
          return {
            uri: asset.uri,
            name: asset.name,
            type: asset.type
          };
        });

        setFiles([...Files, ...selectedFiles]);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const pickImagesSinistre = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        multiple: true,
      });

      if (!result.canceled) {
        setIsPhotoSinistreSelected(true);
        const selectedFiles = result.assets.map(asset => {
          return {
            uri: asset.uri,
            name: asset.name,
            type: asset.type
          };
        });

        setSinistrePhotos([...sinistrePhotos, ...selectedFiles]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const extractLocalFilePath = (url) => {
    // Extrait le chemin d'accès local à partir de l'URL
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const localFilePath = `${FileSystem.documentDirectory}${fileName}`;
    return localFilePath;
  };

  const PhotoUpload = ({ photos, setPhotos }) => {
    const handleSelectPhoto = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
        });

        if (!result.canceled && result.assets.length > 0) {
          setIsPhotoSelected(true);
          const selectedFiles = result.assets.map(asset => {
            return {
              uri: asset.uri,
              name: asset.fileName,
              type: asset.type
            };
          });

          setPhotos([...photos, ...selectedFiles]);
        }
      }
    };

    return (
      <View>
        <Button onPress={handleSelectPhoto} title="Ajouter une photo" />

        <View>
          {photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo.uri }} style={{ width: 200, height: 200 }} />
          ))}
        </View>
      </View>
    );
  };

  /* const getLocalisation = () => {
    // Mettre à jour l'état de la localisation
    setLocalisation({ longitude, latitude });
  };
  useEffect(() => {
    if (towingService) {
      getLocalisation();
    }
  }, [towingService]);
 */


  const sendWhatsAppMessage = (message) => {
    const phoneNumber = '+21629220760'; // Remplacez par le numéro de téléphone du remorqueur

    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappURL)
      .then(() => {
        console.log('Message WhatsApp envoyé');
      })
      .catch((error) => {
        console.log('Erreur lors de l\'envoi du message WhatsApp :', error);
      });
  };


  const handleGarantieRemorquage = () => {
    let message = '';

    const latitude = location.latitude; // Récupérez la latitude depuis l'objet location
    const longitude = location.longitude; // Récupérez la longitude depuis l'objet location
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`; // Créez le lien de localisation

    //if (towingService) {
    const locationMessage = `Localisation : ${mapsLink}`;
    // = `Bonjour j'ai fait un sinistre j'ai besoin de remorquage. ${locationMessage}`;
    //message = `URGENT : Besoin de remorquage\n\n${locationMessage}\n\nInformations du sinistre :\nNuméro de contrat : ${selectedContract}\nNuméro cin : ${cin}`;
    message = `URGENT : Besoin de remorquage\n\n${locationMessage}\n`;

    /* } else {
      message = 'Pas de garantie de remorquage. Pas de localisation disponible.';
    } */
    sendWhatsAppMessage(message);

    console.log("Message envoyé")
  };



  const handleCreateSinistre = async () => {
    if (coordinates.length > 0) {
      const { latitude, longitude } = coordinates[0];
      setIsSubmitting(true);

      Animated.timing(progress, {
        toValue: 1,
        duration: 10000, // Durée de l'animation en millisecondes (ajustez selon vos besoins)
        useNativeDriver: false
      }).start();

      // Construire l'objet FormData pour envoyer les données et les fichiers
      const formData = new FormData();
      formData.append('numCnt', formValues.numCnt);

      if (remorquage) {
        console.log('remorquaaaaaaaaaaage', remorquage)

      }

      const formattedDate = moment(formValues.date).format('YYYY-MM-DD');
      formData.append('date', formattedDate);
      formData.append('description', formValues.description);

      /* constatPhotos.forEach(async (photo, index) => {
        const fileInfo = await FileSystem.getInfoAsync(photo);
        const localUri = fileInfo.uri;
        const file = {
          uri: localUri,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`, // Utilisez un nom de fichier unique pour chaque photo
        };
        formData.append('constatPhotos', file);
      }); */

      if (Files && Files.length > 0) {
        for (let i = 0; i < Files.length; i++) {
          const file = Files[i];
          const fileType = `image/${file.uri.split(".").pop()}`;
          formData.append('constatPhotos', {
            name: file.uri.substring(file.uri.lastIndexOf('/') + 1),
            type: fileType,
            uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
          });
        }
      }
      console.log('FormData:', formData);

      if (sinistrePhotos && sinistrePhotos.length > 0) {
        for (let i = 0; i < sinistrePhotos.length; i++) {
          const file = sinistrePhotos[i];
          const fileType = `image/${file.uri.split(".").pop()}`;
          formData.append('sinistrePhotos', {
            name: file.uri.substring(file.uri.lastIndexOf('/') + 1),
            type: fileType,
            uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
          });
        }

      }

      if (typeof longitude === 'number' && typeof latitude === 'number') {
        console.log('teeeeeeeeeeeeest')
        formData.append('longitude', longitude);
        formData.append('latitude', latitude);
      } else {
        console.error('Les valeurs de longitude et latitude ne sont pas valides');
      }

      // Appel à votre API backend pour créer le sinistre avec les données et les fichiers
      try {
        const response = await fetch('http://192.168.1.23:8060/api/auth/sinistre/addSinistre', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          },
        });

        const data = await response.json(); // Convertir la réponse en JSON

        const sinistre = data; // Utiliser les données JSON renvoyées
        const referenceCode = sinistre.referenceCode;

        if (remorquage) {
          Alert.alert(
            'Garantie de remorquage',
            'Avez-vous une garantie de remorquage ?',
            [
              {
                text: 'Oui',
                onPress: () => {
                  setTowingService(true);
                  handleGarantieRemorquage();
                }
              },
              {
                text: 'Non',
                onPress: () => setTowingService(false),
                style: 'cancel'
              }
            ]
          );
          setTimeout(() => {
            Alert.alert(
              'Votre sinistre est déclaré avec succès !',
              `Le code de référence de ce sinistre : ${referenceCode}`
            )
          }, 6000);

        } else {
          Alert.alert(
            'Votre sinistre est déclaré avec succès !',
            `Le code de référence de ce sinistre : ${referenceCode}`
          );
        }
      } catch (error) {
        console.error('Erreur lors de la création du sinistre:', error);
      } finally {
        setIsSubmitting(false); // Désactiver le chargement
        setProgress(new Animated.Value(0)); // Réinitialiser l'animation de chargement progressif
      }
    }

  };



  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        <View style={styles.stepContainer}>
          <View style={[styles.step, activeStep >= 1 ? styles.stepActive : null]}>
            <Text style={styles.stepText}>1</Text>
          </View>

          <View style={[styles.progress, activeStep >= 1 && styles.progressActive]} />
        </View>
        <View style={styles.stepContainer}>
          <View style={[styles.step, activeStep >= 2 ? styles.stepActive : null]}>
            <Text style={styles.stepText}>2</Text>
          </View>

          <View style={[styles.progress, activeStep >= 2 && styles.progressActive]} />
        </View>
        <View style={styles.stepContainer}>
          <View style={[styles.step, activeStep >= 3 ? styles.stepActive : null]}>
            <Text style={styles.stepText}>3</Text>
          </View>

          <View style={[styles.progress, activeStep >= 3 && styles.progressActive]} />
        </View>
      </View>

      <View style={styles.steps}>
        {activeStep === 1 && (
          <View style={styles.formCont} >
            <Text style={{ fontFamily: 'Montserrat-Regular', marginBottom: 5, color: '#204393', marginTop: 50 }}> Numéro contrat </Text>
            <View >
              <SelectPicker
                onSelectedStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular' }}
                placeholder='Sélectionnez un contrat'
                placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                selectedValue={selectedContract}
                containerStyle={{
                  backgroundColor: COLORS.backgroundNav,
                  borderWidth: 2,
                  borderRadius: 10,
                  marginBottom: 1,
                  borderColor: '#d9252c',
                }}
                doneButtonText='Done'
                doneButtonTextStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular' }}
                onValueChange={(value) => handleContractChange(value)}
              >
                {isLoadingContracts ? (
                  <ActivityIndicator color='#d9252c' />
                ) : (
                  contractList.map((contract) => (
                    <SelectPicker.Item
                      containerStyle={{ color: '#d9252c' }}
                      key={contract.NUMCNT}
                      value={contract.NUMCNT}
                      label={contract.NUMCNT}
                    />
                  ))
                )}
              </SelectPicker>

            </View>

            <Text style={{ marginBottom: 5, color: '#204393', marginTop: 50, fontFamily: 'Montserrat-Regular' }}> Date de sinistre </Text>
            <DateField
              value={formValues.date}
              defaultValue={new Date()} onSubmit={(value) => handleDateChange(value)}
            />
            <TextInput
              label="Description des circonstances"
              mode="outlined"
              activeOutlineColor='#204393'
              outlineColor="#fbfbfb"
              value={formValues.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline={true} // Activer le mode multi-lignes
              numberOfLines={7} // Définir le nombre de lignes à afficher
              style={{ marginTop: 50, minHeight: 100 }} // Ajuster la hauteur minimale souhaitée
            />
          </View>
        )}

        {activeStep === 2 && (
          <View style={styles.formCont}>
            <Text></Text>
            <Text> </Text>
            {/* <PhotoUpload photos={constatPhotos} setPhotos={setConstatPhotos} />
          <Text> Sinistre</Text>
          <PhotoUpload photos={sinistrePhotos} setPhotos={setSinistrePhotos} />
 */}
            <View style={styles.photoContainer}>
              <View style={styles.photoCard}>
                <Text style={styles.label}>Copie du constat  </Text>
                <Button style={{ width: 200, margin: 5, borderColor: "#ed3026", backgroundColor: "#204393" }}
                  textColor="white"
                  title="Ajouter des photos" onPress={pickImagesConstat} icon="camera" mode="contained" > Ajouter des photos </Button>

                {isPhotoConstatSelected && <Text style={styles.photoSelected}> Copie constat est selectionnée</Text>}
              </View>
              <Divider />

              <Text style={styles.label}>Photos des dommages </Text>
              <Button style={{ width: 200, margin: 5, borderColor: "#ed3026", backgroundColor: "#204393" }}
                textColor="white"
                title="Ajouter des photos" onPress={pickImagesSinistre} icon="camera" mode="contained" > Ajouter des photos </Button>

              {/* Conditionally render the label */}
              {isPhotoSinistreSelected && <Text style={styles.photoSelected}>Les photos des dommages sont selectionées</Text>}
            </View>

          </View>
        )}

        {activeStep === 3 && (
          <View style={styles.formCont} >
            <Text></Text>
            <MapView
              style={{ flex: 1 }}
              ref={mapRef}
              onPress={handleMapPress}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {markerCoordinate && (
                <Marker coordinate={markerCoordinate} title="Position actuelle" />
              )}
            </MapView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button
                style={{ width: 200, margin: 5, borderColor: "#204393" }}
                textColor="#204393"
                icon="google-maps"
                mode="outlined" onPress={fitMapToBounds} title="Ajuster aux limites" >
                Ajuster aux limites
              </Button>



              <Button
                style={[
                  { width: 200, margin: 5, borderColor: '#d9252c' },
                  isSubmitting && styles.loadingButton // Ajouter la classe de chargement lorsque isSubmitting est vrai
                ]}
                textColor='#d9252c'
                icon="check"
                mode="outlined"
                title="Annuler"
                onPress={handleCreateSinistre}
                disabled={isSubmitting} // Désactiver le bouton pendant le chargement
              >
                {isSubmitting ? 'En cours...' : 'Déclarer le sinistre'}
              </Button>
            </View>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {activeStep > 1 && (
          <Button onPress={() => setActiveStep(activeStep - 1)} style={{ width: 150, margin: 5, borderColor: "#204393", backgroundColor: "#204393" }}

            icon="arrow-expand-left"
            textColor="white"
            mode="outlined"> Précédent </Button>
        )}
        {activeStep < 3 && (
          <Button onPress={() => setActiveStep(activeStep + 1)}
            style={{ width: 150, margin: 5, borderColor: '#d9252c', backgroundColor: '#d9252c' }}
            textColor="white"
            icon="arrow-expand-right"
            mode="contained"
            title="Annuler" > Suivant </Button>
        )}
      </View>
    </View >
  );
};

export default AddSinistreScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //margin: 20,
    //marginTop: -100?
    backgroundColor: 'light'
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  photoCard: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 40
  },
  stepsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepTextActive: {
    color: 'blue',
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  steps: {
    alignItems: 'flex-start',
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#204393',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: '#d9252c',
  },
  progress: {
    width: 70,
    height: 2,
    backgroundColor: '#204393',
    marginTop: 8,
  },
  progressActive: {
    backgroundColor: '#d9252c',
  },
  stepText: {
    color: 'white',
  },
  formCont: {
    backgroundColor: '#fff',
    borderRadius: 0,
    borderWidth: 3,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    padding: 8,
    width: 350, // Remplacez par la valeur de largeur souhaitée
    height: 500,
  },

  input: {
    //marginBottom: 16,
    paddingHorizontal: '20%',
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 100
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.primary,
    fontFamily: 'Montserrat-Regular',
  },
  photoSelected: {
    fontSize: 12,
    marginBottom: 10,
    color: '#d9252c',
    fontFamily: 'Montserrat-Regular',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    flex: 1,
  },
  selectText: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  dropdownItem: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 5,
    marginTop: 10
  },
  loadingButton: {
    backgroundColor: '#ffcccc' // Couleur de fond pour le chargement
  }

});



