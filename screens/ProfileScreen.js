import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
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

    return (
        <View style={styles.container}>
            <Text style={styles.congratsText}>Welcome, {user.displayName}!</Text>
            <Text style={styles.text}>Insert logic to see session history here!</Text>
            <Ionicons.Button name="body" size={32} onPress={() => navigation.navigate("Feedback")}>Sample Exercise</Ionicons.Button>
            <View style={styles.space}></View>
            <Ionicons.Button name="settings" size={32} onPress={() => navigation.navigate("Settings")}></Ionicons.Button>
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
    }
});

export default ProfileScreen;
