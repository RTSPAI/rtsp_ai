import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { ref, get, query, orderByChild } from 'firebase/database';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState(null);
    const auth = FIREBASE_AUTH;

    // After rending, verify is user is signed in
    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    useEffect(() => {
        // Function to read user's session history
        const fetchSessions = async () => {
            // Create query of user's session history
            const uid = user.uid;
            const sessionsRef = ref(FIREBASE_DB, `users/${uid}/sessions`);
            const q = query(sessionsRef, orderByChild("createdAt"));
            let orderedSessions = [];
            try {
                const snapshot = await get(q);
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        orderedSessions.push({ id: childSnapshot.key, ...childSnapshot.val() });
                    });
                    // Sort the data
                    orderedSessions.sort((a, b) => b.createdAt - a.createdAt);
                    // TODO: Here or later, only query for necessary data 
                    // TODO: and process the createdAt field as epoch
                } else {
                    console.log("No history data found.")
                }
                setSessions(orderedSessions);
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`${errorCode} | ${errorMessage}`);
                // Optionally, show an alert with the error
                Alert.alert('Read Error', errorMessage);
            }
        }

        fetchSessions();
    }, []);

    // If loading or user not present, render nothing
    if (loadingUser || !user) {
        return null;
    }

    const onPress = (session) => {
        navigation.navigate("Feedback", { session });
    }

    const Item = ({ session }) => (
        <Pressable style={styles.item} onPress={() => onPress(session)}>
            <Text style={styles.title}>{session.exercise}</Text>
            <Text>Repetitions: {session.repetitions}</Text>
            <Text>Duration: {session.duration} sec</Text>
            <Text>Created At: {session.createdAt}</Text>
        </Pressable>
    );

    const renderItem = ({ item }) => <Item session={item} />;

    return (
        <View style={styles.container}>
            <Text style={styles.congratsText}>Welcome, {user.displayName}!</Text>
            <Text style={styles.text}>Insert logic to see session history here!</Text>
            <View style={styles.space}></View>
            <Ionicons.Button name="settings" size={32} onPress={() => navigation.navigate("Settings")}></Ionicons.Button>
            <Ionicons.Button name="info" size={32} onPress={() => navigation.navigate("TestGPT")}></Ionicons.Button>
            <View style={styles.listContainer}>
                <FlatList
                    data={sessions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
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
