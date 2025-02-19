import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { ref, get, query, orderByChild } from 'firebase/database';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState(null);
    const auth = FIREBASE_AUTH;

    // After rendering, verify if the user is signed in
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
//                  // TODO: Here or later, only query for necessary data 
//                  // TODO: and process the createdAt field as epoch
                    orderedSessions.sort((a, b) => b.createdAt - a.createdAt);
                } else {
                    console.log("No history data found.");
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
    // Getting user first name to be displayed 
    const getFirstName = (fullName) => {
        return fullName ? fullName.split(' ')[0] : '';
    };

    const onPress = (session) => {
        navigation.navigate("Feedback", { session });
    }

    const Item = ({ session }) => (
        <Pressable style={styles.item} onPress={() => onPress(session)}>
            <Text style={styles.sessionTitle}>{session.exercise}</Text>
            <Text>Repetitions: {session.repetitions}</Text>
            <Text>Duration: {session.duration} sec</Text>
            <Text>Created At: {session.createdAt}</Text>
        </Pressable>
    );

    const renderItem = ({ item }) => <Item session={item} />;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome, {getFirstName(user.displayName)}</Text>
            <Text style={styles.subtitle}>View your session history below.</Text>

            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.profileButtonText}>Settings</Text>
            </TouchableOpacity>

            <View style={styles.listContainer}>
                <FlatList
                    data={sessions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E4E4E4',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    profileButton: {
        backgroundColor: '#6D8E93',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginBottom: 20,
    },
    profileButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        width: '90%',
        maxHeight: 400,
    },
    item: {
        backgroundColor: '#f9c74f',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
    },
    sessionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ProfileScreen;
