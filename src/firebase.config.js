// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgONdR-w1a9dCldg2isegTVuPm_ujW10s",
  authDomain: "mobile-otp-4cb44.firebaseapp.com",
  projectId: "mobile-otp-4cb44",
  storageBucket: "mobile-otp-4cb44.appspot.com",
  messagingSenderId: "223447420395",
  appId: "1:223447420395:web:94c634f4cdee5526481dae",
  measurementId: "G-8193D008X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)