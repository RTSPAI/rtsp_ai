import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();

const App = () => {
	return (
		<AuthProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
					<Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
					<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
				</Stack.Navigator>
			</NavigationContainer>
		</AuthProvider>
	);
};

export default App;
