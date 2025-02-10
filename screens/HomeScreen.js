import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import { useAuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // After rending, verify is user is signed in
    useEffect(() => {
        if (!loadingUser && !user) {
            navigation.replace('Login');
        }
    }, [user, loadingUser, navigation]);

    // If loading or user not present, render nothing
    if (loadingUser || !user) {
        return null;
    }

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
            <Text style={styles.congratsText}>Welcome, {user.displayName}!</Text>
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
