// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsm1-j3LD4EI2uNPIPrgr4xvnqs1mMh3w",
  authDomain: "e-com-site0.firebaseapp.com",
  projectId: "e-com-site0",
  storageBucket: "e-com-site0.firebasestorage.app",
  messagingSenderId: "539156934822",
  appId: "1:539156934822:web:8991d0e8fdd4d70f3c0467",
  measurementId: "G-S36BSF2Y0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);