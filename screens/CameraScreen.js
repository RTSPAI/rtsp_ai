import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { Camera, useCameraDevice, useCameraPermission, useSkiaFrameProcessor, VisionCameraProxy, Frame, runAsync } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import { Skia, PaintStyle, matchFont } from '@shopify/react-native-skia';
import { computeAngles, computeLandmarks, drawSkeleton } from '../services/PoseDetection';

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
    const { exercise } = route.params;
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Camera utilization
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const isFocused = useIsFocused();
    const appState = useAppState();
    const isActive = isFocused && appState === "active";



    // State to control landmark and angle visibility
	const [showLandmarks, setShowLandmarks] = useState(true);
	const [showAngles, setShowAngles] = useState(true);

    // Set color of joints and skeleton 
	const paint = Skia.Paint();
	paint.setStyle(PaintStyle.Fill);
	paint.setStrokeWidth(2);
    paint.setColor(Skia.Color('red'));

	// Set font for Skia text
	const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
	const fontStyle = {
		fontFamily,
		fontSize: 54, // Increased font size
		fontStyle: "normal",
		fontWeight: "bold",
	};
	const font = matchFont(fontStyle);



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
        // console.log(landmarks_dict);
        let angles_dict = computeAngles(landmarks_dict);
        // console.log(angles_dict);

        frame.render()

        // Draw circles (landmarks)
        if (showLandmarks) {
            for (const landmark in landmarks_dict) {
                let l = landmarks_dict[landmark]
                frame.drawCircle(
                    l['x'], //* Number(frameWidth),
                    l['y'],// * Number(frameHeight),
                    6,
                    paint,
                );
            }
        }

        // Draw skeleton
        if (showLandmarks) {
            drawSkeleton(frame, landmarks_dict);
        }

        // Draw angles
        if (showAngles) {
            for (const [landmark, angle] of Object.entries(angles_dict)) {
                if (angle == undefined || angle < 0 || angle > 360)
                    continue;
                let x = landmarks_dict[landmark]['x']// * Number(frameWidth);
                let y = landmarks_dict[landmark]['y']// * Number(frameHeight);
                let text = parseInt(angle) + "°";
                let paint = Skia.Paint();
                paint.setColor(Skia.Color('white'));

                frame.save();
                frame.rotate(270, x, y);
                frame.drawText(text, x, y, paint, font);
                frame.restore();
            }
        }
        // console.log(`Finished drawing | Timestamp: ${Date.now()}`)
    }, [showAngles, showLandmarks]);

    return (
        <View style={styles.container}>
            {hasPermission ? (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isActive}
                    frameProcessor={frameProcessor}
                    enableFpsGraph
                />
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
});

export default CameraScreen;
