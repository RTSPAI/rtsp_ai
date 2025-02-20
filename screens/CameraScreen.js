import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { Camera, useCameraDevice, useCameraPermission, useSkiaFrameProcessor, VisionCameraProxy } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import { computeAngles, computeLandmarks, drawAngles, drawLandmarkPoints, drawSkeleton } from '../services/PoseDetection';
import { pushup } from '../services/Exercises';
import { useRunOnJS } from 'react-native-worklets-core';
import { useSharedValue } from 'react-native-reanimated';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Camera utilization
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraDevice, setCameraDevice] = useState('front');
    const device = useCameraDevice(cameraDevice);
    const isFocused = useIsFocused();
    const appState = useAppState();
    const isActive = isFocused && appState === "active";

    // Flip camera function on press
    const flipCamera = () => {
		setCameraDevice((prevDevice) => (prevDevice === 'front' ? 'back' : 'front'));
	};

    // States to control landmarks and angles visibility
    const [showLandmarks, setShowLandmarks] = useState(true);
    const [showAngles, setShowAngles] = useState(true);
    const [repetitionCount, setRepetitions] = useState(0);

    // Use Shared Variable for repCount and repStage for easy access
    const repCount = useSharedValue(0);
    const repStage = useSharedValue("up");

    // Function to update the useState of repetition count for the container
    const updateReps = useRunOnJS((reps) => {
        setRepetitions(reps);
    });

    // After rending, verify is user is signed in
    useEffect(() => {
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

        if (exercise === "Push Ups") {
            // Call pushup function and increment the repCount based on repStage value
            pushup(angles_dict, repStage, repCount);
        }
        //TODO: SQUATS and PULL UPS - fix logic first in Exercises.js

        // Trigger UI update
        updateReps(repCount.value);

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
                </>
            ) : (
                <Text style={styles.text}>No camera permissions given.</Text>
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
});

export default CameraScreen;
