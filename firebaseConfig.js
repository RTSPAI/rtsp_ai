// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);