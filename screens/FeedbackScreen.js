import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
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

    const epochToDate = (epochTime) =>{
        const date = new Date(epochTime);
        return date.toLocaleString();
    }

    const formattedDate = epochToDate(session.createdAt);

    // Formats Feedback
    const formatFeedback = (feedback) => {
        return feedback.split(/(Repetition #\d+:|Summary:)/g).map((part, index) => {
            if (/Repetition #\d+:|Summary:/.test(part)) {
                return <Text key={index} style={{ fontWeight: 'bold' }}>{part}</Text>;
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Exercise Feedback</Text>
            </View>

            {/* Session Details */}
            <View style={styles.sessionContainer}>
                <Text style={styles.sectionTitle}>Session Details</Text>
                <Text style={styles.sessionText}> Exercise: {session.exercise}</Text>
                <Text style={styles.sessionText}> Duration: {session.duration} sec</Text>
                <Text style={styles.sessionText}> Created At: {formattedDate}</Text>
            </View>

            {/* Feedback */}
            <View style={styles.feedbackContainer}>
                <ScrollView style={styles.feedbackScroll}>
                    <Text style={styles.feedbackText}>{formatFeedback(session.feedback)}</Text>
                </ScrollView>
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
        marginBottom: height * 0.01,
    },
    sessionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: height * 0.005,
    },

    feedbackContainer: {
        width: width * 0.9,
        marginTop: height * 0.05,
        padding: width * 0.05,
        backgroundColor: '#FFF',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    feedbackScroll: {
        maxHeight: height * 0.5,
        paddingVertical: 10,
    },
    feedbackText: {
        fontSize: 16,
        color: '#333',
        //fontWeight: 'bold',
        lineHeight: 24,
    },
});

export default FeedbackScreen;


