import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const PhotoUpload = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState([]);

  const handleSelectPhoto = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (!response.didCancel) {
        const newPhotos = [...photos, response.uri];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
      }
    });
  };

  return (
    <View>
      <Button onPress={handleSelectPhoto} title="Ajouter une photo" />

      <View>
        {photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={{ width: 200, height: 200 }} />
        ))}
      </View>
    </View>
  );
};