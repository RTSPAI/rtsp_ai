import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CongratsScreen = () => {
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

export default CongratsScreen;