import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';

const CameraScreen = ({ route, navigation }) => {
    const { exercise } = route.params;
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Camera utilization
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const isFocused = useIsFocused()
    const appState = useAppState()
    const isActive = isFocused && appState === "active"

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

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        console.log(`${Date.now()} | Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`)
    }, [])

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
