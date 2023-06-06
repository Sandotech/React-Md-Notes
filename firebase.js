// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDBy79iLrbpn112b1Tn3jvvKcwlGWjlHG4",
    authDomain: "react-notes-5127d.firebaseapp.com",
    projectId: "react-notes-5127d",
    storageBucket: "react-notes-5127d.appspot.com",
    messagingSenderId: "597983928214",
    appId: "1:597983928214:web:d75aece4b726c8ade107b7",
    measurementId: "G-X1GH3WBQ24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const dataBase = getFirestore(app);
export const notesCollection = collection(dataBase, "notes")