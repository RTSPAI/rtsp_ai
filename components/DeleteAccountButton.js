import React from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { deleteUser } from "firebase/auth";
import { ref, remove } from "firebase/database";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

const DeleteAccountButton = () => {
    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;
    const user = auth.currentUser;

    // Function that handles user's data & account deletion
    const handleDeleteAccount = () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (user) {
                            try {
                                // Delete user data from Realtime Database
                                const userRef = ref(db, `users/${user.uid}`);
                                await remove(userRef);

                                // Delete user from Firebase Authentication
                                await deleteUser(user);

                                Alert.alert("Account Deleted", "Your account and data have been successfully deleted.");
                            } catch (error) {
                                console.error("Error deleting account:", error);
                                Alert.alert("Error", error.message);
                            }
                        }
                    },
                },
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
            <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DeleteAccountButton;
