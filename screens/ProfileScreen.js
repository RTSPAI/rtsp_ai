import React, { useEffect, useState } from 'react';
import {Text,StyleSheet,FlatList,Pressable,TouchableOpacity,Alert,Dimensions,} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { ref, get, query, orderByChild } from 'firebase/database';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [sessions, setSessions] = useState([]);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    useEffect(() => {
        const fetchSessions = async () => {
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

                    orderedSessions.sort((a, b) => b.createdAt - a.createdAt);
                } else {
                    console.log("No history data found.");
                }
                setSessions(orderedSessions);
            } catch (error) {
                Alert.alert('Read Error', error.message);
            }
        };
        fetchSessions();
    }, []);

    if (loadingUser || !user) {
        return null;
    }

    const getFirstName = (fullName) => {
        return fullName ? fullName.split(' ')[0] : '';
    };

    const onPress = (session) => {
        navigation.navigate("Feedback", { session });
    };

    const epochToDate = (epochTime) => {
        const date = new Date(epochTime);
        return date.toLocaleString();
    };

    const Item = ({ session }) => (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={() => onPress(session)}
        >
            <Text style={styles.cardTitle}>{session.exercise}</Text>
            <Text style={styles.cardText}>Repetitions: {session.repetitions}</Text>
            <Text style={styles.cardText}>Duration: {session.duration} sec</Text>
            <Text style={styles.cardText}>Created At: {epochToDate(session.createdAt)}</Text>
        </Pressable>
    );

    const renderItem = ({ item }) => <Item session={item} />;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome, {getFirstName(user.displayName)}</Text>
            <Text style={styles.subtitle}>View your session history below.</Text>

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.navigate('Settings')}
            >
                <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>

            <FlatList
                data={sessions}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: height * 0.03, paddingHorizontal: width * 0.05 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E4E4E4',
        alignItems: 'center',
        paddingTop: height * 0.04,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.01,
    },
    subtitle: {
        fontSize: 17,
        color: '#666',
        marginBottom: height * 0.03,
        textAlign: 'center',
        paddingHorizontal: width * 0.1,
    },
    settingsButton: {
        backgroundColor: '#6D8E93',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.06,
        borderRadius: 10,
        marginBottom: height * 0.02,
    },
    settingsButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFF',
        padding: width * 0.05,
        marginBottom: height * 0.015,
        width: width * 0.85,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    cardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    cardText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 2,
    },
});

export default ProfileScreen;
