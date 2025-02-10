import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Function to access the current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                // User is signed in
                console.log('User logged in:', user);
            } else {
                // User is signed out
                navigation.replace('Login');
            }
        });
        // Cleanup the component to unsubscribe when component unmounts
        return () => unsubscribe();
    }, []);

    // Function to log out of current user
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode} | ${errorMessage}`);
            // Optionally, show an alert with the error
            Alert.alert('Log Out Error', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.congratsText}>Congrats, you logged in!</Text>
            <Button title="Log Out" onPress={logOut} />
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
});

export default HomeScreen;
