import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useAuthContext, resetScreens } from '../context/AuthContext';
import { useTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';

function tensorToString(tensor) {
    return `${tensor.dataType} [${tensor.shape}]`;
  }

const WarmupScreen = ({ navigation }) => {
    const { user, loadingUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const plugin = useTensorflowModel(require('../assets/injury_prevention_model.tflite'));
    const inputTensor = plugin.model?.inputs[0];
    const inputWidth = inputTensor?.shape[1] ?? 0;
    const inputHeight = inputTensor?.shape[2] ?? 0;
    if (inputTensor != null) {
        console.log(`Input: ${inputTensor.dataType} ${inputWidth} x ${inputHeight}`);
    }
    // After rending, verify is user is signed in
    useEffect(() => {
        resetScreens(user, loadingUser, navigation);
    }, [user, loadingUser, navigation]);

    // If loading or user not present, render nothing
    if (loadingUser || !user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Insert warmup/exercise detection logic here</Text>
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

export default WarmupScreen;
