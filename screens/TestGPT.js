import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Button } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { ref, get, query, orderByChild } from 'firebase/database';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getFunctions, httpsCallable } from 'firebase/functions';

/*
//The Cloud functions for Firebase SDK to create Cloud Functions and triggers
const {logger} = require('firebase-functions');
const {onRequest} = require('firebase-functions/v2/https');
const {onDocumentCreated} = require('firebase-functions/v2/firestore');

//The Firebase Admin SDK to access Firestore
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
*/



const ProfileScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState(null);
    const auth = FIREBASE_AUTH;

    const [ prompt, setPrompt ] = useState('');
    const [ output, setOutput ] = useState('');
    const [ fetching, setFetching ] = useState(false);

    const handleSubmit = async () => {
        const functions = getFunctions();
        const chatCompletion = httpsCallable(functions, "chatCompletion");
        try {
            const data = {
                prompt: "say hi to me"
            }
            setFetching(true);
            const result = await chatCompletion(data);
            console.log(result.data.aiResponse);
            console.log(result);
            setOutput(result.data.aiResponse);

        } catch ( error ) {
            console.log(error);
        } finally {
            setFetching(false);
        }
    }

    // After rending, verify is user is signed in
    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    // If loading or user not present, render nothing
    if (loadingUser || !user) {
        return null;
    }

    //<Ionicons.Button name="info" size={32} onPress={() => navigation.navigate("TestGPT")}></Ionicons.Button>
    

    return (
        <View style={styles.container}>
           <Button
             disabled={fetching}
             onPress={handleSubmit}
             title={fetching ? "Fetching AI Response..." : "Submit Prompt"}
           />
           <Text>
            {output}
           </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    congratsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    space: {
        height: 20,
        width: 20,
    },
    listContainer: {
        marginTop: 30,
        padding: 2,
        backgroundColor: "#555555",
        height: 400,
        width: 300,
    },
    item: {
        backgroundColor: "#f5f520",
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
