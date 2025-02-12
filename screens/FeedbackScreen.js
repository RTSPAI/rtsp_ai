import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';

const FeedbackScreen = ({ route, navigation }) => {
    // TODO: Unpack the session object and display feedback data
    const { session } = route.params;
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

    // TODO: Display FlatList with session's feedback
    // TODO ...
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Insert loading of (a single/specific) exercise feedback here</Text>
            <Text>{session ? JSON.stringify(session) : "n/a"}</Text>
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
});

export default FeedbackScreen;
