import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import WarmupScreen from './screens/WarmupScreen';
import ProfileScreen from './screens/ProfileScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import SettingsScreen from './screens/SettingsScreen';
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();
const showAllHeaders = true;

const App = () => {
	return (
		<AuthProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Warmup" component={WarmupScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: showAllHeaders }} />
					<Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: showAllHeaders }} />
				</Stack.Navigator>
			</NavigationContainer>
		</AuthProvider>
	);
};

export default App;
