import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExerciseList from '../components/ExerciseList';

const HomeScreen = ({ navigation }) => {
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Ionicons.Button name="person" size={32} onPress={() => navigation.navigate("Profile")}>Profile</Ionicons.Button>
                <View style={styles.space}></View>
                <Text style={styles.text}>Insert some welcome / simple tutorial text here...</Text>
                <Text style={styles.text}>Insert list of available exercises here...</Text>
                <ExerciseList navigation={navigation}/>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
    space: {
        width: 20,
        height: 20,
    },
});

export default HomeScreen;
