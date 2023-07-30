// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "storage-projects-data.firebaseapp.com",
  projectId: "storage-projects-data",
  storageBucket: "storage-projects-data.appspot.com",
  messagingSenderId: "536703038962",
  appId: "1:536703038962:web:cfec5c2dcc8340c7e2a76b",
  measurementId: "G-L16XD3B3ET",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
