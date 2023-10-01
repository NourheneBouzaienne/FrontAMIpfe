import React, { useState, useRef } from 'react';
import { StyleSheet, Platform, View, Modal, ImageBackground, Linking, Image, TouchableOpacity, Text, ScrollView, Alert, FlatList } from 'react-native';
import SelectPicker from 'react-native-form-select-picker';
import moment from 'moment';
import client from '../API/client';
import COLORS from '../const/colors';
import { Button, TextInput, Divider } from 'react-native-paper';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Font from 'expo-font';
import { encode } from 'base-64';
import * as FileSystem from 'expo-file-system';
import PDFLib, { PDFDocument, PDFPage, SetMediaBoxOptions, TextDrawingOptions, RectangleDrawingOptions, ImageDrawingOptions } from 'react-native-pdf-lib';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { convert } from 'react-native-html-to-pdf';

import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import DateField, { YearMonthDateField } from 'react-native-datefield';


const DevisScreen = () => {

    const [dateNaissance, setDateNaissance] = useState('');
    const [profession, setProfession] = useState('');
    const [capitalDeces, setCapitalDeces] = useState('');
    const [incapacitePermanente, setIncapacitePermanente] = useState('');
    const [indemniteJournaliere, setIndemniteJournaliere] = useState(false);
    const [franchiseJournaliere, setFranchiseJournaliere] = useState('');
    const [fraisMedicauxRembourses, setFraisMedicauxRembourses] = useState('');
    const [plafondFraisMedicaux, setPlafondFraisMedicaux] = useState('');
    const [limiteIndemnite, setLimiteIndemnite] = useState(0);
    const [montantIndemnite, setMontantIndemnite] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [montantDeces, setMontantDeces] = useState('');
    const [montantIncapacite, setMontantIncapacite] = useState('');
    const [montantFraisMedicaux, setMontantFraisMedicaux] = useState(0);
    const [montantIndemniteJournaliere, setMontantIndemniteJournaliere] = useState('');
    const [devis, setDevis] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [tauxClasse, setTauxClasse] = useState(0);
    const [sommePrimes, setSommesPrimes] = useState('');



    const [profile, setProfile] = useState({})
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [numTel, setNumTel] = useState('');
    const [name, setName] = useState('');

    const modalRef = useRef(null);

    const [recapDevisCalculated, setRecapDevisCalculated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [token, setToken] = useState('');
    const [cin, setCin] = useState('');




    const handleConfirmAlert = () => {
        // Cacher l'alerte une fois que l'utilisateur a confirmé
        setShowAlert(false);
    };
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const getProfil = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const result = await client.get("/api/auth/Client/profile", {
                headers: {
                    Authorization: token,
                },
            })

            console.log("Result:", result.data);
            return result.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const result = await getProfil();
            setProfile(result)
            console.log("profil", result);

        };
        fetchData();
    }, [name, email, numTel, adresse])
    useEffect(() => {
        const loadData = async () => {
            // Charger les polices de caractères
            await Font.loadAsync({
                'Argon': require('../../assets/fonts/Argon-Regular.otf'),
                'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),

            });
            // Récupérer les données depuis AsyncStorage
        };

        loadData();

    }, []);

    const professions = [
        { label: 'Administrateur', value: 'Administrateur', classe: 1 },
        { label: 'Bijoutier', value: 'Bijoutier', classe: 1 },
        { label: 'Etudiant', value: 'Etudiant', classe: 1 },
        { label: 'Stagiaire', value: 'Stagiaire', classe: 1 },
        { label: 'Boucher sans abatage', value: 'Boucher sans abatage', classe: 3 },
        { label: 'Boulanger', value: 'Boulanger', classe: 2 },
        { label: 'Brocanteur', value: 'Brocanteur', classe: 2 },
        { label: 'Cafetier', value: 'Cafetier', classe: 2 },
        { label: 'Caissière de magasin', value: 'Caissière de magasin', classe: 1 },
        { label: 'Carreleur', value: 'Carreleur', classe: 4 },
        { label: 'Agent d\'assurance', value: 'Agent d\'assurance', classe: 2 },
        { label: 'Chef d\'atelier sans emploi d\'outils dangereux', value: 'Chef d\'atelier sans emploi d\'outils dangereux', classe: 2 },
        { label: 'Chef d\'atelier avec emploi d\'outils dangereux', value: 'Chef d\'atelier avec emploi d\'outils dangereux', classe: 3 },
        { label: 'Chirurgien', value: 'Chirurgien', classe: 2 },
        { label: 'Coiffeur', value: 'Coiffeur', classe: 2 },
        { label: 'Comptable', value: 'Comptable', classe: 1 },
        { label: 'Conducteur autobus', value: 'Conducteur autobus', classe: 3 },
        { label: 'Conducteur de travaux', value: 'Conducteur de travaux', classe: 4 },
        { label: 'Confiseur', value: 'Confiseur', classe: 1 },
        { label: 'Agent de change', value: 'Agent de change', classe: 1 },
        { label: 'Crémier', value: 'Crémier', classe: 1 },
        { label: 'Cuisinier', value: 'Cuisinier', classe: 2 },
        { label: 'Dactylo', value: 'Dactylo', classe: 1 },
        { label: 'Diplomate', value: 'Diplomate', classe: 1 },
        { label: 'Docker', value: 'Docker', classe: 4 },
        { label: 'Ebéniste', value: 'Ebéniste', classe: 4 },
        { label: 'Ecclésiastique', value: 'Ecclésiastique', classe: 1 },
        { label: 'Electicien', value: 'Electicien', classe: 4 },
        { label: 'Employé de bureau', value: 'Employé de bureau', classe: 1 },
        { label: 'Epicier', value: 'Epicier', classe: 1 },
        { label: 'Facteur', value: 'Facteur', classe: 1 },
        { label: 'Forgeron', value: 'Forgeron', classe: 4 },
        { label: 'Fourreur', value: 'Fourreur', classe: 2 },
        { label: 'Fraiseur', value: 'Fraiseur', classe: 3 },
        { label: 'Garcon de café', value: 'Garcon de café', classe: 2 },
        { label: 'Garagiste', value: 'Garagiste', classe: 3 },
        { label: 'Imprimeur Industriel', value: 'Imprimeur Industriel', classe: 2 },
        { label: 'Imprimeur Manuel', value: 'Imprimeur Manuel', classe: 1 },
        { label: 'Infirmiére', value: 'Infirmiére', classe: 2 },
        { label: 'Architectes avec déplacements inférieurs à 20.000 KM', value: 'Architectes avec déplacements inférieurs à 20.000 KM', classe: 1 },
        { label: 'Ingénieur d\'etude', value: 'Ingénieur d\'etude', classe: 1 },
        { label: 'Ingenieur de travaux', value: 'Ingenieur de travaux', classe: 2 },
        { label: 'Ingenieur de travaux dangereux', value: 'Ingenieur de travaux dangereux', classe: 3 },
        { label: 'Inspecteur d\'assurance', value: 'Inspecteur d\'assurance', classe: 3 },
        { label: 'Instituteur', value: 'Instituteur', classe: 1 },
        { label: 'Kinésitherapeute', value: 'Kinésitherapeute', classe: 2 },
        { label: 'Libraire', value: 'Libraire', classe: 1 },
        { label: 'Maçon', value: 'Maçon', classe: 4 },
        { label: 'Magasinier', value: 'Magasinier', classe: 2 },
        { label: 'Magistrat', value: 'Magistrat', classe: 1 },
        { label: 'Architectes avec déplacements supérieurs à 20.000 KM', value: 'Architectes avec déplacements supérieurs à 20.000 KM', classe: 2 },
        { label: 'Manutentionnaire manipulant des produits non dangereux', value: 'Manutentionnaire manipulant des produits non dangereux', classe: 2 },
        { label: 'Manutentionnaire manipulant des produits dangereux', value: 'Manutentionnaire manipulant des produits dangereux', classe: 3 },
        { label: 'Mécanicien', value: 'Mécanicien', classe: 3 },
        { label: 'Médecin', value: 'Médecin', classe: 2 },
        { label: 'Menuisier', value: 'Menuisier', classe: 4 },
        { label: 'Modéliste', value: 'Modéliste', classe: 1 },
        { label: 'Notaire', value: 'Notaire', classe: 1 },
        { label: 'Ouvreuse de cinema', value: 'Ouvreuse de cinema', classe: 1 },
        { label: 'Ouvrier industrie légére', value: 'Ouvrier industrie légére', classe: 3 },
        { label: 'Artiste peintre', value: 'Artiste peintre', classe: 1 },
        { label: 'Ouvrier industrie lourde', value: 'Ouvrier industrie lourde', classe: 4 },
        { label: 'Pâtissier', value: 'Pâtissier', classe: 2 },
        { label: 'Peintre de bâtiment', value: 'Peintre de bâtiment', classe: 4 },
        { label: 'Prestidigitateur', value: 'Prestidigitateur', classe: 2 },
        { label: 'Restaurateur', value: 'Restaurateur', classe: 3 },
        { label: 'Assistante sociale', value: 'Assistante sociale', classe: 1 },
        { label: 'Soudeur', value: 'Soudeur', classe: 3 },
        { label: 'Technicien TV', value: 'Technicien TV', classe: 2 },
        { label: 'Terrassier', value: 'Terrassier', classe: 4 },
        { label: 'Vendeuse', value: 'Vendeuse', classe: 1 },
        { label: 'Vitrier', value: 'Vitrier', classe: 4 },
        { label: 'Agent de l\'administration fiscale', value: 'Agent de l\'administration fiscale', classe: 5 },
        { label: 'Agriculteur', value: 'Agriculteur', classe: 3 },
        { label: 'Agent de douane', value: 'Agent de douane', classe: 5 },
        { label: 'Ouvrier agricole', value: 'Ouvrier agricole', classe: 3 },
        { label: 'Chauffeur', value: 'Chauffeur', classe: 3 },
        { label: 'Avocat', value: 'Avocat', classe: 1 },
    ];

    const handleCapitalDecesChange = value => {
        setCapitalDeces(value);
        setIncapacitePermanente(value);
        const limiteIndemniteJ = (parseFloat(value) + parseFloat(value)) / 1000 * 0.25;
        setLimiteIndemnite(limiteIndemniteJ);
    };



    const handleProfessionChange = value => {
        setProfession(value);
        const selectedProfession = professions.find(profession => profession.value === value);
        //setFranchiseJournaliere(classes[selectedProfession.classe].franchise);
    };


    const handleIndemniteJournaliereChange = value => {
        setMontantIndemnite(value);
    };

    const handleMontantIndemniteChange = value => {
        const limiteIndemnite = (parseFloat(capitalDeces) + parseFloat(incapacitePermanente)) / 1000 * 0.25;
        setLimiteIndemnite(limiteIndemnite);
        const indemnite = parseFloat(value);

        if (!isNaN(indemnite) && indemnite <= limiteIndemnite) {
            setMontantIndemnite(value);
        } else {
            setMontantIndemnite(0); // Réinitialiser la valeur du montant de l'indemnité
            console.log("La valeur saisie dépasse la limite d'indemnité journalière");
        }
    };


    const handleDateNaissanceChange = value => {
        const currentDate = moment();
        const enteredDate = moment(value, 'DD/MM/YYYY');
        const ageDiff = currentDate.diff(enteredDate, 'years');

        if (ageDiff < 18) {
            setErrorMessage("Vous devez avoir au moins 18 ans.");
            console.log("Vous devez avoir au moins 18 ans.");
        } else {
            setErrorMessage("");
        }

        setDateNaissance(value);
    };




    const handleFranchiseJournaliereChange = (value) => {

        setFranchiseJournaliere(value);

    };
    const handleFraisMedicauxRemboursesChange = value => {
        setFraisMedicauxRembourses(value);
        if (value === 'oui') {
            const plafond = parseFloat(incapacitePermanente) * 0.01;
            setPlafondFraisMedicaux(plafond.toString());
        } else {
            setPlafondFraisMedicaux('0'); // Définir le plafond des frais médicaux à 0 lorsque la valeur est "non"
        }
    };


    const handleRecapDevis = () => {
        // Calcul du montant de la garantie Décès
        const montantDeces = parseFloat(capitalDeces).toFixed(3);

        // Calcul du montant de la garantie Incapacité permanente total ou partielle
        const montantIncapacite = parseFloat(incapacitePermanente).toFixed(3);

        // Calcul du montant de la garantie Frais médicaux
        const montantFraisMedicaux = fraisMedicauxRembourses === 'oui' ? parseFloat(plafondFraisMedicaux).toFixed(3) : 'Non souscrite';

        // Calcul du montant de la garantie Incapacité temporaire (indemnité journalière)
        const montantIndemniteJournaliere = indemniteJournaliere ? `${parseFloat(montantIndemnite).toFixed(3)} DT par jour à partir du ${parseInt(franchiseJournaliere) + 1}ème jour du sinistre` : 'Non souscrite';

        // Mise à jour des montants des garanties
        setMontantDeces(montantDeces);
        setMontantIncapacite(montantIncapacite);
        setMontantFraisMedicaux(montantFraisMedicaux);
        setMontantIndemniteJournaliere(montantIndemniteJournaliere);
        setRecapDevisCalculated(true);


    };
    const obtenirClasseParProfession = (profession) => {
        const professionSelectionnee = professions.find((p) => p.value === profession);
        console.log('Profession sélectionnée:', professionSelectionnee);
        const classe = professionSelectionnee ? professionSelectionnee.classe : 0;
        console.log('Classe correspondante:', classe);
        return classe;
    };



    const tauxParClasse = {
        1: 0.001,
        2: 0.0012,
        3: 0.0016,
        4: 0.0022,
        5: 0.003,
    };

    const obtenirTauxParClasse = (classe) => {
        if (classe in tauxParClasse) {
            console.log('tauxparclass', tauxParClasse[classe])
            return tauxParClasse[classe];

        } else {
            return 0; // Par défaut, le taux est 0 si la classe n'est pas trouvée
        }
    };





    const obtenirTauxParProfession = (profession) => {
        const classe = obtenirClasseParProfession(profession);
        console.log('ClasseTaux', classe)
        return obtenirTauxParClasse(classe);

    };


    const obtenirPrimeDeces = (capitalDeces, profession) => {
        const taux = obtenirTauxParProfession(profession);
        console.log('TAAAAAAAUX', taux)
        return capitalDeces * taux;
    };

    const obtenirPrimeIncapacite = (capitalIncapacite, profession) => {
        const taux = obtenirTauxParProfession(profession);
        return capitalIncapacite * taux;
    };

    const calculerPrimeFraisMedicaux = (classeProfession, limiteFraisMedicaux) => {
        // Tableau des taux et limites des frais médicaux par classe professionnelle
        const tableauTauxFraisMedicaux = {
            1: [
                { limite: 50, taux: 2.5 },
                { limite: 100, taux: 3.5 },
                { limite: 150, taux: 4.5 },
                { limite: 200, taux: 5.5 },
                { limite: 250, taux: 6 },
                { limite: 300, taux: 6.5 },
                { limite: 400, taux: 7.5 },
                { limite: 500, taux: 8.5 },
                { limite: 600, taux: 9.5 }
            ],
            2: [
                { limite: 50, taux: 3.5 },
                { limite: 100, taux: 5 },
                { limite: 150, taux: 6.5 },
                { limite: 200, taux: 8 },
                { limite: 250, taux: 8.5 },
                { limite: 300, taux: 9 },
                { limite: 400, taux: 10.5 },
                { limite: 500, taux: 12 },
                { limite: 600, taux: 13.5 }
            ],
            3: [
                { limite: 50, taux: 4.5 },
                { limite: 100, taux: 7 },
                { limite: 150, taux: 9 },
                { limite: 200, taux: 11 },
                { limite: 250, taux: 12 },
                { limite: 300, taux: 13 },
                { limite: 400, taux: 15 },
                { limite: 500, taux: 17 },
                { limite: 600, taux: 19 }
            ],
            4: [
                { limite: 50, taux: 5.5 },
                { limite: 100, taux: 9.5 },
                { limite: 150, taux: 12.5 },
                { limite: 200, taux: 15 },
                { limite: 250, taux: 16.5 },
                { limite: 300, taux: 17.5 },
                { limite: 400, taux: 20.5 },
                { limite: 500, taux: 23 },
                { limite: 600, taux: 26 }
            ],
            5: [
                { limite: 50, taux: 6 },
                { limite: 100, taux: 10 },
                { limite: 150, taux: 13 },
                { limite: 200, taux: 16 },
                { limite: 250, taux: 17 },
                { limite: 300, taux: 18 },
                { limite: 400, taux: 21 },
                { limite: 500, taux: 24 },
                { limite: 600, taux: 27 }
            ]
        };

        const classeProfessionInt = parseInt(classeProfession, 10);

        if (classeProfessionInt in tableauTauxFraisMedicaux) {
            let tauxClasse = 0;
            for (let i = 0; i < tableauTauxFraisMedicaux[classeProfessionInt].length; i++) {
                const limiteItem = tableauTauxFraisMedicaux[classeProfessionInt][i].limite;

                if (limiteItem >= montantFraisMedicaux) {
                    tauxClasse = tableauTauxFraisMedicaux[classeProfessionInt][i].taux;
                    break;
                }
            }

            if (tauxClasse !== 0) {
                const primeFraisMedicaux = tauxClasse;
                return primeFraisMedicaux;
            } else {
                const primeFraisMedicaux = 0;
                return primeFraisMedicaux;
            }
        } else {
            throw new Error("Aucun taux correspondant trouvé pour la classe professionnelle.");
        }
    };
    /* const calculerIndemniteIncapacite = (classeProfession, franchise) => {
        // Tableau des taux d'indemnité par classe professionnelle et franchise
        const tableauTauxIndemnite = {
            1: [
                { franchise: 0, taux: 0 },
                { franchise: 10, taux: 3 },
                { franchise: 15, taux: 2.5 },
                { franchise: 30, taux: 1.5 }
            ],
            2: [
                { franchise: 0, taux: 4 },
                { franchise: 10, taux: 4.5 },
                { franchise: 15, taux: 3.5 },
                { franchise: 30, taux: 2.5 }
            ],
            3: [
                { franchise: 0, taux: 6 },
                { franchise: 10, taux: 6 },
                { franchise: 15, taux: 5 },
                { franchise: 30, taux: 4 }
            ],
            4: [
                { franchise: 0, taux: 9 },
                { franchise: 10, taux: 6 },
                { franchise: 15, taux: 4 },
                { franchise: 30, taux: 5 }
            ]
        };

        // Vérification si la classe professionnelle existe dans le tableau des taux
        if (classeProfession in tableauTauxIndemnite) {
            const tauxFranchise = tableauTauxIndemnite[classeProfession].find(
                (item) => item.franchise === franchise
            );

            if (tauxFranchise) {
                const tauxClasse = tauxFranchise.taux;
                return tauxClasse;
            } else {
                throw new Error('Aucun taux d\'indemnité correspondant trouvé pour la franchise spécifiée.');
            }

        } else {
            throw new Error('Aucun taux d\'indemnité correspondant trouvé pour la classe professionnelle.');
        }
    }; */

    const calculerIndemniteIncapacite = (classeProfession, franchise) => {
        // Tableau des taux d'indemnité par classe professionnelle et franchise
        const tableauTauxIndemnite = {
            1: {
                0: 0,
                10: 3,
                15: 2.5,
                30: 1.5
            },
            2: {
                0: 4,
                10: 4.5,
                15: 3.5,
                30: 2.5
            },
            3: {
                0: 6,
                10: 6,
                15: 5,
                30: 4
            },
            4: {
                0: 9,
                10: 6,
                15: 4,
                30: 5
            }
        };

        // Vérification si la classe professionnelle existe dans le tableau des taux
        if (classeProfession in tableauTauxIndemnite) {
            const tauxClasse = tableauTauxIndemnite[classeProfession][franchise];

            if (tauxClasse !== undefined) {
                return tauxClasse;
            } else {
                return tauxClasse;
                //throw new Error('Aucun taux d\'indemnité correspondant trouvé pour la franchise spécifiée.');
            }
        } else {
            throw new Error('Aucun taux d\'indemnité correspondant trouvé pour la classe professionnelle.');
        }
    };

    const obtenirAge = (dateNaissance) => {
        const currentDate = moment();
        const enteredDate = moment(dateNaissance, 'DD/MM/YYYY');
        const age = currentDate.diff(enteredDate, 'years');

        return age;
    };
    const obtenirMajoration = (age) => {
        if (age >= 18 && age <= 55) {
            if (age >= 40 && age <= 49) {
                return 1.2;
            } else if (age >= 50 && age <= 55) {
                return 1.4;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };



    const handleCalculDevis = () => {


        const capitalDeces = parseFloat(montantDeces || 0);
        console.log(capitalDeces)

        const capitalIncapacite = parseFloat(montantIncapacite || 0);
        console.log(capitalIncapacite)

        const indemniteJournaliere = parseFloat(montantIndemniteJournaliere);
        //const plafondFraisMedicaux = parseFloat(plafondFraisMedicaux);
        console.log('plafoooooooond', plafondFraisMedicaux)
        const classeProfession = obtenirClasseParProfession(profession);
        console.log('Claaaaaaaaaaaaasse', classeProfession)


        const taux = obtenirTauxParProfession(profession);
        const primeDeces = obtenirPrimeDeces(capitalDeces, profession);
        const primeIncapacite = obtenirPrimeIncapacite(capitalIncapacite, profession);


        const tauxIndemnite = calculerIndemniteIncapacite(classeProfession, franchiseJournaliere);
        let primeIndemnite = 0;

        if (!isNaN(indemniteJournaliere)) {
            primeIndemnite = indemniteJournaliere * tauxIndemnite;
        }

        // Calcul du montant net des frais médicaux
        //const montantNetFraisMedicaux = obtenirMontantNetFraisMedicaux(plafondFraisMedicaux, capitalDeces); // Remplacer obtenirMontantNetFraisMedicaux par votre fonction de calcul
        const primeFraisMedicaux = calculerPrimeFraisMedicaux(classeProfession, parseFloat(plafondFraisMedicaux));

        // const primeFraisMedicaux = calculerPrimeFraisMedicaux(classeProfession, plafondFraisMedicaux);

        // Calcul du montant final des frais médicaux
        const age = obtenirAge(dateNaissance); // Remplacer obtenirAge par votre fonction de calcul
        const majoration = obtenirMajoration(age); // Remplacer obtenirMajoration par votre fonction de calcul
        const montantFinalFraisMedicaux = (((primeFraisMedicaux * majoration) + 5) * 1.12) + 3;
        console.log(majoration)
        let sommePrimesNet = primeDeces + primeIncapacite + primeFraisMedicaux + primeIndemnite;
        console.log(sommePrimesNet)
        if (majoration !== 0) {
            sommePrimesNet = ((sommePrimesNet * majoration) + 5) * 1.12 + 3;
        } else {
            sommePrimesNet = (sommePrimesNet + 5) * 1.12 + 3;
        }
        setSommesPrimes(sommePrimesNet)
        console.log('Somme des primes:', sommePrimes);
        const devisData = [
            {
                libelle: 'Décès',
                code: 'DEC',
                montant: `${primeDeces.toFixed(3)} DT`,
                limites: `${capitalDeces.toFixed(3)}`,
                franchise: 'Pas de franchise',
            },
            {
                libelle: 'Incapacité permanente totale ou partielle',
                code: 'PERM',
                montant: `${primeIncapacite.toFixed(3)} DT`,
                limites: `${capitalIncapacite.toFixed(3)}`,
                franchise: 'Pas de franchise',
            },
            {
                libelle: 'Frais médicaux',
                code: 'FRAI',
                montant: `${primeFraisMedicaux} DT`,
                limites: `${parseFloat(plafondFraisMedicaux).toFixed(3)}`,
                franchise: 'Pas de franchise',
            },
            {
                libelle: 'Incapacité temporaire (indemnité journalière)',
                code: 'TEMP',
                montant: `${parseFloat(primeIndemnite).toFixed(3)} DT`,
                limites: `${parseFloat(limiteIndemnite).toFixed(3)}`,
                franchise: `${franchiseJournaliere}`,
            },
        ];

        setDevis(devisData);
        console.log(devisData)
        console.log(devis)
        setModalVisible(true);
    };
    const stylesCSS = `
    
    .row {
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 7px;
    }
    
    .label {
        font-size: 16px;
    }
    
    .tableContainer {
        margin-top: 20px;
        border-width: 1px;
        border-color:#204393;
        background-color: #fff;
    }
    
    .tableRow {
        flex-direction: row;
        border-bottom-width: 1px;
        border-color:#204393;
    }
    
    .tableHeader {
        flex: 1;
        padding-vertical: 10px;
        padding-horizontal: 5px;
        font-family: Montserrat-Regular;
        color: #ed3026;
    }
    
    .tableData {
        flex: 1;
        padding-vertical: 10px;
        padding-horizontal: 3px;
        font-family: Montserrat-Regular;
        color: #204393;
        font-size: 12px;
    }
    
    .tableFooter {
        flex: 1;
        padding-vertical: 10px;
        padding-horizontal: 5px;
        text-align: center;
        font-family: Montserrat-Regular;
        color: #ed3026;
    }
    
    .logo {
        resize-mode: contain;
        padding: 10px;
        margin-top: 15px;
    }
    
    .modalContent {
        margin: 10px;
    }
    
    .contenu {
        flex-direction: row;
        margin: 5px;
        border-width: 1px;
        border-color: #204393;
        margin-top: 20px;
    }
    
    .labels {
        background-color:#204393;
        width: 135px;
    }
    
    .labelText {
        color: white;
        font-weight: bold;
        margin-bottom: 12px;
    }
    
    .userInfoText {
        margin-bottom: 12px;
        color: #204393;
    }
    `;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
      <style>
      /* Placez les styles CSS adaptés ici */
      body {
        
      }

      .modalContent {
        margin: 10px;
      }

      .headerContainer {
        text-align: center;
        margin-bottom: 20px;
      }

      .logo {
        width: 300px;
        height: auto;
        padding: 10px;
        margin-top: 15px;
      }

      .contenu {
        display: flex;
        justify-content: center;
        margin: 5px;
        border: 1px solid #204393;
        margin-top: 20px;
      }

      .labels {
        background-color: #204393;
        width: 135px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
      }

      .labelText {
        color: white;
        font-weight: bold;
        margin-bottom: 12px;
      }

      .userInfo {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .userInfoText {
        margin-bottom: 12px;
        color: #204393;
      }

      .tableContainer {
        margin-top: 20px;
        border: 1px solid #204393;
        background-color: #fff;
        border-collapse: collapse;
        width: 100%;
      }

      .tableRow {
        border-bottom: 1px solid #204393;
      }

      .tableRow:first-child .tableHeader {
        border-bottom: 1px solid #204393;
      }

      .tableHeader {
        padding: 10px;
        font-family: 'Montserrat', sans-serif;
        color: #ed3026;
        font-weight: bold;
        text-align: center;
      }

      .tableData {
        padding: 10px;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        text-align: center;
        color: #204393;
      }

      .tableFooter {
        padding: 10px;
        text-align: center;
        font-family: 'Montserrat', sans-serif;
        color: #ed3026;
        font-weight: bold;
      }
      
      table {
        width: 100%;
      }
    </style>
      </head>
      <body>
        <div class="modalContent">
          <div class="headerContainer">
            <img
              src="https://www.assurancesami.com/sites/default/files/logo-ami-assurance.png"
              class="logo"
            />
          </div>
          <div class="contenu">
            <div class="labels">
              <span class="labelText">Nom Prénom</span>
              <span class="labelText">Pièce d'identité</span>
              <span class="labelText">Email</span>
            </div>
            <div class="userInfo">
              <span class="userInfoText">${profile.name}</span>
              <span class="userInfoText">${profile.username}</span>
              <span class="userInfoText">${profile.email}</span>
            </div>
          </div>
          <table class="tableContainer">
            <tr class="tableRow" >
              <th class="tableHeader" colspan="4">Devis Individuel Accident</th>
            </tr>
            <tr class="tableRow">
              <th class="tableHeader">Code Garantie</th>
              <th class="tableHeader">Libelle des Garanties</th>
              <th class="tableHeader">Limites (DT)</th>
              <th class="tableHeader">Franchise</th>
            </tr>
            ${devis
            .map(
                (item, index) => `
              <tr class="tableRow">
                <td class="tableData">${item.code}</td>
                <td class="tableData">${item.libelle}</td>
                <td class="tableData">${item.limites}</td>
                <td class="tableData">${item.franchise}</td>
              </tr>
            `
            )
            .join('')}
            <tr class="tableRow">
              <td class="tableFooter" colspan="4">
                Le montant à payer pour votre assurance Individuel Accident en TTC
                est de: ${parseFloat(sommePrimes).toFixed(3)} DT
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    
`;

    const [selectedPrinter, setSelectedPrinter] = useState();
    const [showSecondAlert, setShowSecondAlert] = useState(false);

    const print = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        await Print.printAsync({
            html,
            printerUrl: selectedPrinter?.url, // iOS only
        });
    };

    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ html });
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    const selectPrinter = async () => {
        const printer = await Print.selectPrinterAsync(); // iOS only
        setSelectedPrinter(printer);
    };
    const handleDownloadPDF = async () => {
        const modalContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Styles CSS pour le contenu HTML */
          </style>
        </head>
        <body>
          <!-- Contenu HTML du composant Modal -->
        </body>
      </html>
    `;

        const options = {
            html: modalContent,
            fileName: 'myFile.pdf',
            directory: 'Documents',
        };

        convert(options)
            .then((pdf) => {
                // Traitement du fichier PDF
                console.log('Chemin du fichier PDF :', pdf.filePath);
            })
            .catch((error) => {
                // Gestion des erreurs
                console.log('Erreur lors du téléchargement du fichier', error);
            });
    }
    useEffect(() => {
        if (modalVisible) {
            const timer = setTimeout(() => {
                setShowSecondAlert(true);
            }, 2000); // Temps en millisecondes (2 secondes dans cet exemple)

            // Assurez-vous de nettoyer le timer lorsque le composant est démonté
            return () => clearTimeout(timer);
        }
    }, [modalVisible]);
    const handleConfirmAlert2 = () => {
        // Cacher le premier modal une fois que l'utilisateur a confirmé
        //setModalVisible(false);
        setShowSecondAlert(false);
    };


    const handleSouscription = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return null;
        }

        try {
            // Faites l'appel à l'API avec le token d'authentification
            await client.post("/api/auth/souscription/effectuer", null, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            // Si la requête a réussi, affichez une alerte de confirmation
            Alert.alert(
                "Souscription réussie",
                "Votre demande de souscription a été enregistrée. Un email vous sera envoyé immédiatement.",
                [{ text: "OK" }]
            );

        } catch (error) {
            // En cas d'erreur lors de la requête, affichez une alerte d'erreur
            alert("Une erreur est survenue lors de la soumission de votre demande. Veuillez réessayer plus tard.");
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView style={styles.stepContainer}>
                {/* Partie 1: Profession, Capacité décès, Incapacité */}
                {currentStep === 1 && (
                    <>
                        <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>Date de naissance</Text>
                        <TextInput
                            value={dateNaissance}
                            onChangeText={handleDateNaissanceChange}
                            placeholder="Format: DD/MM/YYYY"
                            mode="outlined"
                            activeOutlineColor='#ed3026'
                            outlineColor='#204393'
                        />
                        {/*  <DateField
                            value={dateNaissance}
                            defaultValue={new Date()} onSubmit={(value) => handleDateNaissanceChange(value)}
                        />  */}
                        {!!errorMessage && <Text style={{ marginBottom: 5, fontFamily: 'Montserrat-Regular', color: '#ed3026' }}>{errorMessage}</Text>}

                        <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>Profession </Text>
                        <SelectPicker
                            placeholder="Sélectionnez votre profession"
                            placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                            selectedValue={profession}
                            onValueChange={handleProfessionChange}
                        >
                            {professions.map((profession, index) => (
                                <SelectPicker.Item
                                    key={`${profession.value}_${index}`}
                                    label={profession.label}
                                    value={profession.value}
                                />
                            ))}
                        </SelectPicker>

                        <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>Le capital qui sera servi aux bénéficiaires choisis par vos soins suite à un évènement accidentel de la vie :</Text>
                        <SelectPicker
                            placeholder="Sélectionnez le capital"
                            placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                            selectedValue={capitalDeces}
                            onValueChange={handleCapitalDecesChange}
                        >
                            <SelectPicker.Item key="10000" label="10000 DT" value="10000" />
                            <SelectPicker.Item key="20000" label="20000 DT" value="20000" />
                            <SelectPicker.Item key="30000" label="30000 DT" value="30000" />
                            <SelectPicker.Item key="40000" label="40000 DT" value="40000" />
                            <SelectPicker.Item key="50000" label="50000 DT" value="50000" />
                        </SelectPicker>

                        <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>Veuillez saisir le capital souhaité, qui vous sera versé en cas d'incapacité permanente :</Text>

                        <TextInput

                            mode="outlined"
                            activeOutlineColor='#ed3026'
                            outlineColor='#204393'
                            value={incapacitePermanente}
                            editable={false}
                            keyboardType="numeric"


                        />
                    </>
                )}

                {/* Partie 2: Indémnité journalière, Montant, Franchise */}
                {currentStep === 2 && (
                    <>
                        <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>Voudriez-vous avoir une indemnité journalière en cas d'incapacité temporaire ?</Text>
                        <SelectPicker
                            selectedValue={indemniteJournaliere ? 'oui' : 'non'}
                            placeholder="Sélectionnez"
                            placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                            onValueChange={value => setIndemniteJournaliere(value === 'oui')}
                        >
                            <SelectPicker.Item label="Non" value="non" />
                            <SelectPicker.Item label="Oui" value="oui" />
                        </SelectPicker>

                        {indemniteJournaliere && (
                            <>
                                <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                                    Veuillez saisir le montant de l'indemnité journalière souhaitée, qui vous sera versée en cas d'incapacité temporaire.
                                </Text>
                                <Text style={{ marginBottom: 5, fontFamily: 'Montserrat-Regular', color: '#ed3026' }}>
                                    (Veuillez ne pas dépasser : {`${limiteIndemnite} dt`})
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    activeOutlineColor='#ed3026'
                                    outlineColor='#204393'
                                    value={montantIndemnite}
                                    onChangeText={handleMontantIndemniteChange}
                                    keyboardType="numeric"
                                />

                                <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                                    Veuillez sélectionner la Franchise (nombre de jours) :
                                </Text>
                                <SelectPicker
                                    selectedValue={franchiseJournaliere}
                                    onValueChange={handleFranchiseJournaliereChange}
                                    placeholder="Sélectionnez"
                                    placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                                >
                                    <SelectPicker.Item label="0 jour" value="0" />
                                    <SelectPicker.Item label="10 jours" value="10" />
                                    <SelectPicker.Item label="15 jours" value="15" />
                                    <SelectPicker.Item label="30 jours" value="30" />
                                </SelectPicker>
                            </>
                        )}

                        {!indemniteJournaliere && (
                            <>
                                <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                                    Veuillez saisir le montant de l'indemnité journalière souhaitée, qui vous sera versée en cas d'incapacité temporaire.
                                </Text>
                                <Text style={{ marginBottom: 5, fontFamily: 'Montserrat-Regular', color: '#ed3026' }}>
                                    (Veuillez ne pas dépasser : {`${limiteIndemnite} dt`})
                                </Text>
                                <TextInput
                                    value="0"  // Définir la valeur comme étant 0 lorsque l'option "Non" est sélectionnée
                                    editable={false}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    activeOutlineColor='#ed3026'
                                    outlineColor='#204393'
                                />

                                <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                                    Veuillez sélectionner la Franchise (nombre de jours) :
                                </Text>
                                <SelectPicker
                                    selectedValue="0"  // Définir la valeur comme étant 0 lorsque l'option "Non" est sélectionnée
                                    onValueChange={handleFranchiseJournaliereChange}
                                    placeholder="Sélectionnez"
                                    placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                                >
                                    <SelectPicker.Item label="0 jour" value="0" />
                                    <SelectPicker.Item label="10 jours" value="10" />
                                    <SelectPicker.Item label="15 jours" value="15" />
                                    <SelectPicker.Item label="30 jours" value="30" />
                                </SelectPicker>
                            </>
                        )}
                    </>
                )}
                {/* Partie 3: Frais médicaux */}
                {currentStep === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                            Voudriez-vous que les frais médicaux soient remboursés ?
                        </Text>
                        <SelectPicker
                            selectedValue={fraisMedicauxRembourses}
                            onValueChange={handleFraisMedicauxRemboursesChange}
                            placeholder='Sélectionnez'
                            placeholderStyle={{ color: '#d9252c', fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                        >
                            <SelectPicker.Item label="Non" value="non" />
                            <SelectPicker.Item label="Oui" value="oui" />
                        </SelectPicker>

                        {fraisMedicauxRembourses === 'oui' && (
                            <>
                                <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                                    Veuillez saisir le plafond des frais médicaux à rembourser :
                                </Text>
                                <TextInput
                                    value={plafondFraisMedicaux}
                                    editable={false}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    activeOutlineColor='#ed3026'
                                    outlineColor='#204393'
                                />
                            </>
                        )}
                        {!fraisMedicauxRembourses && (
                            <>
                                <Text style={{ marginBottom: 5, color: '#204393', fontFamily: 'Montserrat-Regular' }}>
                                    Veuillez saisir le plafond des frais médicaux à rembourser :
                                </Text>

                                <TextInput
                                    value="0"
                                    editable={false}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    activeOutlineColor='#ed3026'
                                    outlineColor='#204393'
                                />
                            </>
                        )}
                    </View>
                )}

                {montantDeces !== '' && montantIncapacite !== '' && (
                    <View style={styles.recapContainer}>
                        <Text style={styles.recapTitle}>Récapitulatif des données fournies :</Text>

                        {/* Table Row 1 */}
                        <View style={styles.tableRowRecap}>
                            <Text style={styles.tableLabel}>Les garanties souscrites :</Text>
                            <View style={styles.tableValue}>
                                <Text style={styles.recapValue}>Décès</Text>
                                <Text style={styles.recapValue}>Incapacité permanente total ou partielle</Text>
                                <Text style={styles.recapValue}>Frais médicaux</Text>
                                <Text style={styles.recapValue}>Incapacité temporaire (indemnité journalière)</Text>
                            </View>
                        </View>

                        {/* Table Row 2 */}
                        <View style={styles.tableRowRecap}>
                            <Text style={styles.tableLabel}>Les capitaux assurés :</Text>
                            <View style={styles.tableValue}>
                                <Text style={styles.recapValue}>{montantDeces} DT</Text>
                                <Text style={styles.recapValue}>{montantIncapacite} DT</Text>
                                <Text style={styles.recapValue}>{montantFraisMedicaux} DT</Text>
                                <Text style={styles.recapValue}>{montantIndemniteJournaliere} </Text>
                            </View>
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Boutons Précédent et Suivant */}
            <View style={styles.buttonContainerDevis}>
                {currentStep > 1 && (
                    <Button icon="arrow-expand-left"
                        textColor="white"
                        mode="outlined" style={{ width: 150, margin: 5, borderColor: "#204393", backgroundColor: "#204393" }} onPress={handlePreviousStep}>Précédent</Button>
                )}
                {currentStep < 3 && (
                    <Button textColor="white"
                        icon="arrow-expand-right"
                        mode="contained" style={{ width: 150, margin: 5, borderColor: '#d9252c', backgroundColor: '#d9252c' }} onPress={handleNextStep}>Suivant</Button>
                )}
                {currentStep === 3 && (
                    <>
                        <Button
                            onPress={handleRecapDevis}

                            mode="contained"
                            color="#204393"
                            style={{ width: 150, margin: 5, borderColor: "#204393", backgroundColor: "#204393" }}
                        >
                            Confirmer
                        </Button>
                        {recapDevisCalculated && (
                            <View style={styles.obtenirDevisButtonContainer}>
                                <Button
                                    style={{
                                        backgroundColor: '#d9252c',
                                        width: 150,
                                        borderColor: '#d9252c',
                                        alignSelf: 'center',
                                    }}
                                    title="Élaborer devis"
                                    mode="contained"
                                    icon="calculator"
                                    onPress={handleCalculDevis}
                                >
                                    Générer devis
                                </Button>
                            </View>
                        )}
                    </>
                )}

            </View>

            <Modal ref={modalRef} visible={modalVisible} transparent={false} animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                    <View style={styles.headerContainer}>
                        <Image source={require('../../assets/AmiLOGO.png')} style={styles.logo} />
                    </View>
                    <View style={styles.contenu}>
                        <View style={styles.labels}>
                            <Text style={styles.labelText}> Nom  Prénom  </Text>
                            <Text style={styles.labelText}> Pièce d'identité </Text>
                            <Text style={styles.labelText}> Email </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userInfoText}> {profile.name} </Text>
                            <Text style={styles.userInfoText}> {profile.username} </Text>
                            <Text style={styles.userInfoText}> {profile.email} </Text>
                        </View>
                    </View>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>                    Devis Individuel Accident</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>Code Garantie</Text>
                            <Text style={styles.tableHeader}>Libelle des Garanties</Text>

                            <Text style={styles.tableHeader}>Limites (DT)</Text>
                            <Text style={styles.tableHeader}>Franchise</Text>
                        </View>
                        {devis.map((item, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableData}>{item.code}</Text>

                                <Text style={styles.tableData}>{item.libelle}</Text>
                                <Text style={styles.tableData}>{item.limites}</Text>
                                <Text style={styles.tableData}>{item.franchise} Jours</Text>
                            </View>
                        ))}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableFooter}>Le montant à payer pour votre assurance Individuel Accident en TTC est de: {parseFloat(sommePrimes).toFixed(3)} DT</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>

                        <Button title="Print to PDF file"
                            style={{ backgroundColor: '#204393' }}
                            textColor="white"
                            icon="download-circle-outline"
                            mode="elevated" onPress={print} >Télécharger</Button>

                        <Button title="Print to PDF file"
                            style={{ backgroundColor: '#204393' }}
                            textColor="white"
                            icon="share-outline"
                            mode="elevated"
                            onPress={printToFile}>Partager</Button>
                        {Platform.OS === 'ios' && (
                            <>
                                <View style={styles.spacer} />
                                <Button title="Select printer" onPress={selectPrinter} >Select printer</Button>
                                <View style={styles.spacer} />
                                {selectedPrinter ? (
                                    <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
                                ) : undefined}
                            </>
                        )}


                    </View>

                    <Button
                        style={{
                            backgroundColor: '#d9252c',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            position: 'absolute',
                            left: 10,
                        }}
                        contentStyle={{
                            marginLeft: 12,
                            //size: 30
                        }}
                        icon="close-circle-outline"
                        mode="contained"
                        color="#d9252c"
                        onPress={() => setModalVisible(false)}
                        iconSize={30}

                    />
                </View>
            </Modal>
            <Modal visible={showSecondAlert} transparent animationType="fade">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10 }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderWidth: 3, borderColor: '#204393' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Regular', marginBottom: 10, color: '#ed3026' }}>Votre devis a été calculé avec succès.
                            !</Text>
                        <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Regular', marginBottom: 20 }}>
                            Protégez votre avenir dès maintenant en souscrivant à notre assurance Individuel Accident !

                        </Text>
                        <Button style={{ borderColor: "#204393" }}
                            textColor="#204393"
                            mode="outlined"
                            title="Envoyer une demande de souscription" onPress={() => handleSouscription()}> Envoyer une demande de souscription</Button>
                        <Button style={{

                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: 50,
                            height: 50,
                            borderRadius: 20,
                            position: 'absolute',
                            right: 1,
                            margin: 2
                        }}
                            contentStyle={{
                                marginLeft: 12,
                                width: 50,
                                height: 50,

                            }}
                            textColor='#ed3026'
                            icon="close-circle-outline"
                            mode="text"
                            color="#d9252c" title="Fermer" onPress={handleConfirmAlert2}></Button>
                    </View>
                </View>
            </Modal>
        </View>
    );






};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white'
    },
    formContainer: {
        //width: '100%',
        borderWidth: 2,
        borderColor: COLORS.primary,
        padding: 10,

    },
    stepContainer: {
        //marginBottom: 20,
        //marginTop: -200
    },
    recapContainer: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 5,

    },
    recapTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary,
        marginBottom: 10,
    },
    tableRowRecap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    tableLabel: {
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        color: '#ed3026',
    },
    tableValue: {
        flex: 2,


    },
    recapValue: {
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    buttonContainerDevis: {
        flexDirection: 'row',
        justifyContent: 'center',


    },
    obtenirDevisButtonContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 90,
    },

    button: {
        width: '20%',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7
    },
    label: {
        fontSize: 16
    },
    tableContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: '#fff',
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: COLORS.primary, // Couleur personnalisée
    },
    tableHeader: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,

        fontFamily: 'Montserrat-Regular',
        color: '#ed3026'
    },
    tableData: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 3,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.primary,
        fontSize: 12,



    },
    tableFooter: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        //fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        color: '#ed3026'
    },

    logo: {
        width: 400,
        height: 70,
        resizeMode: 'contain',
        padding: 10,
        marginTop: 15

    },
    modalContent: {
        margin: 10
    },
    contenu: {
        flexDirection: 'row',
        margin: 5,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginTop: 20

    },
    labels: {
        backgroundColor: COLORS.primary,
        width: 135,

    },
    labelText: {
        //padding: 10,
        //marginTop: 20,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 12


    },
    userInfoText: {
        marginBottom: 12,
        color: COLORS.primary
    },


});

export default DevisScreen;

