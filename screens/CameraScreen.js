import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { Camera, useCameraDevice, useCameraPermission, useSkiaFrameProcessor, VisionCameraProxy } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import { computeAngles, computeLandmarks, drawAngles, drawLandmarkPoints, drawSkeleton } from '../services/PoseDetection';
import { getTriggeredFlags, exerciseAnalysis } from '../services/Exercises';
import { useRunOnJS } from 'react-native-worklets-core';
import { useSharedValue } from 'react-native-reanimated';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createSessionObject, generatePrompt, requestAIFeedback, saveExerciseSession } from '../services/OpenAI';

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

const CameraScreen = ({ route, navigation }) => {
    // Basic screen states and authentication
    const { exercise } = route.params;
    const { user, loadingUser } = useAuthContext();
    const [ isLoading, setIsLoading] = useState(false);
    const startTimeRef = useRef(null);
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

    // States to control landmarks and angles visibility
    const [showLandmarks, setShowLandmarks] = useState(true);
    const [showAngles, setShowAngles] = useState(true);
    const [repetitionCount, setRepetitions] = useState(0);

    // Use Shared Values for repCount and repStage for easy access
    const repCount = useSharedValue(0);
    const repStage = useSharedValue("up");

    // Use Shared Values for flag counting
    const flags_dict = useSharedValue({});

    // Use Shared Values for storing flags and model feedback
    const angles_seen = useSharedValue([]);
    const feedback_seen = useSharedValue([]);
    const flags_seen = useSharedValue([]);

    // Function to update the useState of repetition count for the container
    const updateReps = useRunOnJS((reps, flags, angles) => {
        // Exit if no change to repetition count
        if (reps <= repCount.value)
            return;

        // Increment repetition
        repCount.value = reps;
        setRepetitions(reps);

        // Store flags that passed the threshold
        const valid_flags = getTriggeredFlags(flags.value);
        const all_flags = [...flags_seen.value, valid_flags];
        // Update in the background
        flags_seen.value = all_flags;

        // TODO: Run Gabby's model here and store feedback in `feedback_seen`
        // TODO: ...

        // Reset Shared Values
        angles.value = [];
        flags.value = {};
    });

    // After rending, verify is user is signed in
    useEffect(() => {
        startTimeRef.current = Date.now();
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    // If loading or user not present, render nothing
    if (loadingUser || !user) {
        return null;
    }

    // Check Camera permissions and request if necessary
    if (!hasPermission) {
        requestPermission();
    }

    const frameProcessor = useSkiaFrameProcessor((frame) => {
        'worklet'
        // Call custom Frame Processor (pose detection)
        const data = detectPose(frame);

        // Compute data dictionaries
        let landmarks_dict = computeLandmarks(data);
        let angles_dict = computeAngles(landmarks_dict);

        // Render the frame on the Skia Canvas
        frame.render();

        // Perform analysis on the current exercise based on angles and repetition stage
        exerciseAnalysis(exercise, landmarks_dict, angles_dict, flags_dict, repStage, repCount);

        // Store angle data for feedback later
        angles_seen.value = [...angles_seen.value, angles_dict]

        // Trigger UI update and feedback processing
        updateReps(repCount.value, flags_dict, angles_seen);

        // Draw skeleton and landmarks
        if (showLandmarks) {
            drawLandmarkPoints(frame, landmarks_dict);
            drawSkeleton(frame, landmarks_dict);
        }

        // Draw angles
        if (showAngles) {
            drawAngles(frame, angles_dict, landmarks_dict);
        }
    }, [showAngles, showLandmarks]);

    const stopSession = async () => {
        // Set isLoading to true to stop Frame Processor and display loading symbol
        setIsLoading(true);

        // If no reps completed, navigate back to home screen.
        if (repCount.value <= 0) {
            navigation.pop();
            return;
        }

        try {
            // Query OpenAI feedback
            // TODO: Add fake data to feedback_seen for now;
            let flags = flags_seen.value;
            let modelFeedback = feedback_seen.value;
            for (let i = 0; i < flags.length; i++) {
                modelFeedback.push(["N/A", "N/A"]);
            }
            const prompt = generatePrompt(exercise, flags, modelFeedback);
            const response = await requestAIFeedback(prompt);

            // Create session object
            const userId = user.uid;
            const session = createSessionObject(exercise);
            session.duration = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
            session.feedback = response;
            session.repetitions = repCount.value;

            // Save session data to Firebase
            saveExerciseSession(userId, session);

            // Display feedback to the user
            navigation.replace('Feedback', { session });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode} | ${errorMessage}`);
            // Optionally, show an alert with the error
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

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
                    <View style={styles.repCounterContainer}>
                        <Text style={styles.repCounterText}>Reps: {repetitionCount}</Text>
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
                    <View style={styles.anglesButtonContainer}>
                        <MaterialIcon
                            name="math-compass"
                            size={30}
                            color="#fff"
                            onPress={() => setShowAngles(!showAngles)}
                        />
                    </View>
                    <View style={styles.landmarksButtonContainer}>
                        <FontIcon
                            name="male"
                            size={30}
                            color="#fff"
                            onPress={() => setShowLandmarks(!showLandmarks)}
                        />
                    </View>
                    <View style={styles.stopButtonContainer}>
                        <TouchableOpacity style={styles.stopButton} onPress={() => stopSession()}>
                            <Text style={styles.stopButtonText}>Stop Session</Text>
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
    repCounterContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    repCounterText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    flipButtonContainer: {
		position: 'absolute',
		top: 100,
		right: 20,
	},
    anglesButtonContainer: {
		position: 'absolute',
		top: 150,
        right: 20,
	},
    landmarksButtonContainer: {
		position: 'absolute',
		top: 200,
        right: 26,
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

export default CameraScreen;
