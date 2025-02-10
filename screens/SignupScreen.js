import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const SignupScreen = ({ navigation }) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const auth = FIREBASE_AUTH;

	const signUp = async () => {
		setLoading(true);
		try {
			// Sign Up
			const userResponse = await createUserWithEmailAndPassword(auth, email, password);
			const user = userResponse.user;
			console.log('User created:', user);

			// TODO: Implement saving user's first and last name
			// TODO: ...

			await sendEmailVerification(user);
			Alert.alert('Email Verification', 'Please verify your email before logging in. Check your inbox for the verification email.');
			
			// Navigate to Home page
			navigation.replace('Login');
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(`${errorCode} | ${errorMessage}`);
			// Optionally, show an alert with the error
			Alert.alert('Sign Up Error', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<Text style={styles.header}>Sign Up</Text>
				<TextInput
					style={styles.input}
					placeholder="First Name"
					value={firstName}
					onChangeText={setFirstName}
					keyboardType="default"
				/>
				<TextInput
					style={styles.input}
					placeholder="Last Name"
					value={lastName}
					onChangeText={setLastName}
					keyboardType="default"
				/>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				<TextInput
					style={styles.input}
					placeholder="Confirm Password"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
				/>
				{loading ? (
					<ActivityIndicator size="large" color="#0000ff" />
				) : (
					<>
						<Button title="Sign Up" onPress={signUp} />
						<Text style={styles.switchText}>
							Already have an account?{' '}
							<Text style={styles.link} onPress={() => navigation.replace('Login')}>
								Log In
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
	switchText: {
		textAlign: 'center',
		marginTop: 20,
	},
	link: {
		color: 'blue',
	},
});

export default SignupScreen;
