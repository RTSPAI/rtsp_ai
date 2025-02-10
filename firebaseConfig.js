// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXOfbGrbFgoYxdQl4ui8h4h862Cs6HXjc",
  authDomain: "rtsp-ai.firebaseapp.com",
  projectId: "rtsp-ai",
  storageBucket: "rtsp-ai.firebasestorage.app",
  messagingSenderId: "641579243768",
  appId: "1:641579243768:web:f227604b4f108b8b94830d",
  measurementId: "G-7K5W1GENW0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
