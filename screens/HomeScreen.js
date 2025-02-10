import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(`USER ID: ${uid}`)
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.congratsText}>Congrats, you logged in!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default HomeScreen;
