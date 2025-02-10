import React, { createContext, useContext, useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

// Create the context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true); // Track initial loading state
    const auth = FIREBASE_AUTH;

    // Function to access the current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            console.log("User:", user);
            setLoadingUser(false);
        });
        // Cleanup the component to unsubscribe when component unmounts
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loadingUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuthContext = () => useContext(AuthContext);
