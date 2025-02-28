import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';


const FeedbackScreen = ({ route, navigation }) => {
    const { session } = route.params;
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    if (loadingUser || !user) {
        return null;
    }

    const Item = ({ feedback }) => (
        <View style={styles.item}>
            <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
    );

    const renderItem = ({ item }) => <Item feedback={item} />;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Exercise Feedback</Text>
            </View>

            {/* Session Details */}
            <View style={styles.sessionContainer}>
                <Text style={styles.sectionTitle}>Session Details</Text>
                <Text style={styles.sessionText}>🛠️ Exercise: {session.exercise}</Text>
                <Text style={styles.sessionText}>⏳ Duration: {session.duration} sec</Text>
                <Text style={styles.sessionText}>📅 Created At: {session.createdAt}</Text>
            </View>

            {/* Feedback List */}
            <View style={styles.feedbackContainer}>
                <FlatList
                    data={session.feedback}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </SafeAreaView>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E4E4E4',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: height * 0.05,
    },
    headerContainer: {
        paddingTop: height * 0.03,
        marginBottom: height * 0.03,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    sessionContainer: {
        width: width * 0.9,
        backgroundColor: '#FFF',
        padding: width * 0.04,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 6,
        },
        shadowOpacity: 0.1,

    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.0,
    },
    sessionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: height * 0.005,
    },
    feedbackContainer: {
        width: width * 0.9,
        maxHeight: height * 0.4,
        marginTop: height * 0.05,
        padding: width * 0.03,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 6,
        },
        shadowOpacity: 0.1,
    },
    item: {
        backgroundColor: '#E4E4E4',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
    },
    feedbackText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default FeedbackScreen;


