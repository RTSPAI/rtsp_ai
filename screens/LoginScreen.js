import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const auth = FIREBASE_AUTH;

	const signIn = async () => {
		setLoading(true);
		try {
			// Sign In
			const userResponse = await signInWithEmailAndPassword(auth, email, password);
			const user = userResponse.user;
			// Check email validation
			if (!user.emailVerified) {
				await signOut(auth);
				Alert.alert('Email Not Verified', 'Please verify your email before logging in. Check your inbox for the verification email.');
				return;
			}
			// Navigate to Home page
			navigation.replace('Home');
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(`${errorCode} | ${errorMessage}`);
			// Optionally, show an alert with the error
			Alert.alert('Login Error', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const resetPassword = async () => {
		if (!email) {
			Alert.alert('Reset Password', 'Please enter your email first.');
			return;
		}
		try {
			await sendPasswordResetEmail(auth, email);
			Alert.alert('Check Your Email', 'A password reset link has been sent.');
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(`${errorCode} | ${errorMessage}`);
			// Optionally, show an alert with the error
			Alert.alert('Password Reset Error', errorMessage);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<Text style={styles.header}>Login</Text>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					textContentType="oneTimeCode"
					autoCapitalize="none"
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry={true}
					textContentType="oneTimeCode"
				/>
				<Text style={styles.forgotPassword} onPress={resetPassword}>
					Forgot Password?
				</Text>
				{loading ? (
					<ActivityIndicator size="large" color="#cccccc" />
				) : (
					<>
						<Button title="Login" onPress={signIn} />
						<Text style={styles.switchText}>
							Don't have an account?{' '}
							<Text style={styles.link} onPress={() => navigation.replace('Signup')}>
								Sign Up
							</Text>
						</Text>
					</>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		marginBottom: 20,
		paddingLeft: 10,
		borderRadius: 5,
	},
	forgotPassword: {
		color: 'blue',
		textAlign: 'right',
		marginBottom: 20,
	},
	switchText: {
		textAlign: 'center',
		marginTop: 20,
	},
	link: {
		color: 'blue',
	},
});

export default LoginScreen;
