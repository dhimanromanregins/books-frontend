// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Import the getAuth function
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk0W9i5lv60nTXR4oysF7sgwmT54zWEf0",
  authDomain: "books-b2a0d.firebaseapp.com",
  projectId: "books-b2a0d",
  storageBucket: "books-b2a0d.appspot.com",
  messagingSenderId: "930079501050",
  appId: "1:930079501050:web:b9d3f64509f4899e573743",
  measurementId: "G-1XK8HLM50M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and export the auth object
export const auth = getAuth(app);
