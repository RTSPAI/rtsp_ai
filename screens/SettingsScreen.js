import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import DeleteAccountButton from '../components/DeleteAccountButton';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import { useAuthContext, resetScreens } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // After rending, verify is user is signed in
    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
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
            <Text style={styles.text}> Insert settings logic here!</Text>
            <Button style={styles.warningText} title="Log Out" onPress={logOut} />
            <DeleteAccountButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    warningText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    }
});

export default SettingsScreen;
