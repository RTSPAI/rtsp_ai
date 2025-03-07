//** PLEASE NOTE: THIS IS ONLY A PLAYGROUND. Code needs to be migrated to CameraScreen.js when done.

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createSessionObject, generatePrompt, requestAIFeedback, saveExerciseSession } from '../services/OpenAI';

const TestGPT = ({ navigation }) => {
    const [output, setOutput] = useState('');
    const [fetching, setFetching] = useState(false);

    // Define fake data for testing
    const exercise = "Push Ups"
    const flags = [
        ["Make sure to keep your knees straight", "Make sure to keep your hips straight"],
        ["Make sure to keep your hips straight"],
        []
    ]
    const modelFeedback = [["At Risk", "Poor"], ["Not At Risk", "Good"], ["Not At Risk", "Excellent"]]

    // Function to request feedback on button click
    const handleSubmit = async () => {
        try {
            // Query OpenAI feedback
            setFetching(true);
            const prompt = generatePrompt(exercise, flags, modelFeedback);
            const response = await requestAIFeedback(prompt);
            console.log(response);
            setOutput(response);

            // Create session object
            const userId = "F8GheDktjVNlWpRDXtiFIy5e0Wh1"; // maxbagatini@hotmail.com account
            const session = createSessionObject(exercise);
            session.duration = 45;
            session.feedback = response;
            session.repetitions = 3;

            // Write session data to DB
            saveExerciseSession(userId, session);
        } catch (error) {
            console.log(error);
        } finally {
            setFetching(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.small}>
                {generatePrompt(exercise, flags, modelFeedback)}
            </Text>
            <Button
                disabled={fetching}
                onPress={handleSubmit}
                title={fetching ? "Fetching AI Response..." : "Submit Prompt"}
            />
            <Text style={styles.small}>
                {output}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    small: {
        fontSize: 9,
    },
});

export default TestGPT;
