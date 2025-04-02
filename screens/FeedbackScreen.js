import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, ScrollView,} from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';

const FeedbackScreen = ({ route, navigation }) => {
    const { session } = route.params;
    const { user, loadingUser } = useAuthContext();
    const [expandedSections, setExpandedSections] = useState({});
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    if (loadingUser || !user) {
        return null;
    }

    const epochToDate = (epochTime) => {
        const date = new Date(epochTime);
        return date.toLocaleString();
    };

    const formattedDate = epochToDate(session.createdAt);

    const parseFeedback = (rawFeedback) => {
        const parts = rawFeedback.split(/(Repetition #\d+:|Summary:)/g).filter(Boolean);
        const parsed = [];

        for (let i = 0; i < parts.length; i++) {
            if (/Repetition #\d+:|Summary:/.test(parts[i])) {
                parsed.push({ title: parts[i].trim(), content: parts[i + 1]?.trim() || '' });
                i++;
            }
        }

        return parsed;
    };

    const feedbackSections = parseFeedback(session.feedback);

    const toggleSection = (index) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
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

            {/* Feedback Section */}
            <View style={styles.feedbackContainer}>
                <ScrollView style={styles.feedbackScroll}>
                    {feedbackSections.map((section, index) => (
                        <View key={index} style={styles.accordionSection}>
                            <TouchableOpacity
                                onPress={() => toggleSection(index)}
                                style={styles.accordionHeader}
                            >
                                <Text style={styles.accordionTitle}>{section.title}</Text>
                                <Text style={styles.chevron}>
                                    {expandedSections[index] ? '▲' : '▼'}
                                </Text>
                            </TouchableOpacity>
                            {expandedSections[index] && (
                                <View style={styles.accordionContent}>
                                    <Text style={styles.feedbackText}>{section.content}</Text>
                                </View>
                            )}
                        </View>
                    ))}
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
    },
    accordionSection: {
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#e0e0e0',
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    chevron: {
        fontSize: 18,
        color: '#555',
    },
    accordionContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    feedbackText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
});

export default FeedbackScreen;