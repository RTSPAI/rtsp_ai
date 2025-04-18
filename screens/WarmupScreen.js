import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { createPredictionDict, getExercisePrediction, getFinalPrediction } from '../services/ExerciseDetection';
import { useSharedValue, useRunOnJS} from 'react-native-worklets-core';


const WarmupScreen = ({ navigation }) => {
    // Basic screen states and authentication
    const { user, loadingUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // States for TF Lite model
    const plugin = useTensorflowModel(require('../assets/exercise_detection_model.tflite'));
    const model = plugin.state === 'loaded' ? plugin.model : undefined;
    const { resize } = useResizePlugin();

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
    const [timeLeft, setTimeLeft] = useState(5);
    const predictions_dict = useSharedValue(createPredictionDict());

    const stopSession = async () => {
        // Set isLoading to true to stop Frame Processor and display loading symbol
        setIsLoading(true);
        
        // Compute the most likely exercise the user is performing
        const exercise = getFinalPrediction(predictions_dict.value);

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

    const updateSharedValues = useRunOnJS((predictions) => {
        // Update predictions dictionary in main thread
        predictions_dict.value = predictions;
    });

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        if (model == null) return;

        // 1. Resize image to 224 x 224 x 3
        const resized = resize(frame, {
            scale: {
                width: 224,
                height: 224,
            },
            pixelFormat: 'rgb',
            dataType: 'float32'
        });

        // 2. Run model with given input buffer synchronously
        const outputs = model.runSync([resized]);
        
        // 3. Extract the probabilities into an array
        const valuesList = Object.values(outputs[0]);

        // 4. Interpret outputs accordingly
        const exercise = getExercisePrediction(valuesList);

        // 5. Update the dictionary data and JS thread
        predictions_dict.value[exercise] += 1;
        updateSharedValues(predictions_dict.value);
    }, [model]);

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

export default WarmupScreen;
