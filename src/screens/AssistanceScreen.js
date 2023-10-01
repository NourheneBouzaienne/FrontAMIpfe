import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Icon } from 'react-native-elements';

const AssistanceScreen = () => {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Icon
          name="question-circle"
          type="font-awesome"
          size={50}
          color="#204393"
        />
        <Text style={styles.cardTitle}>Besoin d'une assistance?</Text>
        <Text style={styles.cardText}>Contacter l'un de nos partenaires</Text>
      </Card>

      <Card containerStyle={styles.card}>
        <Icon
          name="car"
          type="font-awesome"
          size={50}
          color="#204393"
        />
        <Text style={styles.cardTitle}>Remorquage, voiture en panne?</Text>
        <Text style={styles.cardText}>Générale Assistance</Text>
        <Text style={styles.cardText}>+216 70 015 000</Text>
        <Text style={styles.cardText}>21, Rue Emir Abdelkader 1082 Mutuelleville, Tunis</Text>
      </Card>

      <Card containerStyle={styles.card}>
        <Icon
          name="home"
          type="font-awesome"
          size={50}
          color="#204393"
        />
        <Text style={styles.cardTitle}>Besoin d'une assistance à domicile?</Text>
        <Text style={styles.cardText}>Afrique Assistance</Text>
        <Text style={styles.cardText}>+216 71 104 580</Text>
        <Text style={styles.cardText}>Immeuble TAMAYOUZ, 4ème Etage, Centre Urbain Nord - 1082 Tunis</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: '90%',
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    borderColor: '#204393',
    borderWidth: 1,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#204393',
    marginVertical: 10,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#204393',
    textAlign: 'center',
  },
});

export default AssistanceScreen;
