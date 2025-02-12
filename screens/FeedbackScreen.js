import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';

const FeedbackScreen = ({ route, navigation }) => {
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

    const Item = ({ feedback }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{feedback}</Text>
        </View>
    );
    
    const renderItem = ({ item }) => <Item feedback={item} />;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Insert loading of (a single/specific) exercise feedback here</Text>
            <Text>Exercise: {session.exercise}</Text>
            <Text>Created At: {session.createdAt}</Text>
            <Text>Duration: {session.duration}</Text>
            <View style={styles.listContainer}>
                <FlatList
                    data={session.feedback}
                    renderItem={renderItem}
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
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
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

export default FeedbackScreen;
