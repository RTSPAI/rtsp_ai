import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { computeAngles, computeLandmarks } from '../services/PoseDetection';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { useSharedValue } from 'react-native-worklets-core';
import { generateExercisePredictionPrompt, requestExercisePrediction } from '../services/OpenAI';


// Initialize custom Frame Processor Plugin for pose detection
const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectPose');

// Define function to call custom frame processor.
export function detectPose(frame) {
    'worklet'
    if (plugin == null) {
        throw new Error("Failed to load Frame Processor Plugin!");
    }
    return plugin.call(frame);
}

const GptWarmupScreen = ({ navigation }) => {
    // Basic screen states and authentication
    const { user, loadingUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Camera utilization
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraDevice, setCameraDevice] = useState('front');
    const device = useCameraDevice(cameraDevice);
    const isFocused = useIsFocused();
    const appState = useAppState();
    const isActive = !isLoading && isFocused && appState === "active";

    // Flip camera function on press
    const flipCamera = () => {
        setCameraDevice((prevDevice) => (prevDevice === 'front' ? 'back' : 'front'));
    };

    // States for exercise prediction
    const [timeLeft, setTimeLeft] = useState(8);
    const angles_seen = useSharedValue([]);

    const stopSession = async () => {
        
        // Set isLoading to true to stop Frame Processor and display loading symbol
        setIsLoading(true);
        
        // Compute the most likely exercise the user is performing
        // TODO: Define this function
        const prompt = generateExercisePredictionPrompt(angles_seen.value);
        const exercise = await requestExercisePrediction(prompt);

        // Pop up to confirm model prediction
        Alert.alert(
            `Exercise: ${exercise}`,
            "Please confirm if the given answer is correct or incorrect.",
            [
                {
                    text: "Correct", onPress: () => {
                        navigation.replace("Camera", { exercise });
                    }
                },
                {
                    text: "Incorrect", style: "destructive", onPress: () => {
                        navigation.pop();
                    }
                },
            ]
        );
    }

    useEffect(() => {
        // If already processing, end the timer
        if (isLoading) {
            return;
        }

        if (timeLeft <= 0) {
            stopSession(); // Run the function when timer hits zero
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    // If loading or user not present, render nothing
    if (loadingUser || !user) {
        return null;
    }

    // Check Camera permissions and request if necessary
    if (!hasPermission) {
        requestPermission();
    }

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        // Call custom Frame Processor (pose detection)
        const data = detectPose(frame);

        // Compute data dictionaries
        let landmarks_dict = computeLandmarks(data);
        let angles_dict = computeAngles(landmarks_dict);

        // Store angle data for feedback later
        angles_seen.value = [...angles_seen.value, angles_dict]
    }, []);

    return (
        <View style={styles.container}>
            {hasPermission ? (
                <>
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isActive}
                        frameProcessor={frameProcessor}
                        enableFpsGraph
                    />
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>Time Left: {timeLeft}</Text>
                    </View>
                    <View style={styles.flipButtonContainer}>
                        {/* Flip Camera Button with Icon */}
                        <FontIcon
                            name="refresh" // can also use camera icon instead of flip icon
                            size={30}
                            color="#fff"
                            onPress={flipCamera}
                        />
                    </View>
                    <View style={styles.stopButtonContainer}>
                        <TouchableOpacity style={styles.stopButton} onPress={() => stopSession()}>
                            <Text style={styles.stopButtonText}>End Detection</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <Text style={styles.text}>No camera permissions given.</Text>
            )}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#666666" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            )}
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
    timerContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    timerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    flipButtonContainer: {
        position: 'absolute',
        top: 100,
        right: 20,
    },
    stopButtonContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    stopButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 5,
    },
    stopButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default GptWarmupScreen;
