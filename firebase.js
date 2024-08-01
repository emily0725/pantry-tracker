// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMIH-G_bcm6czHV3Zq5fcrdLSfc8i7oZE",
  authDomain: "inventory-managment-462f2.firebaseapp.com",
  projectId: "inventory-managment-462f2",
  storageBucket: "inventory-managment-462f2.appspot.com",
  messagingSenderId: "367990271452",
  appId: "1:367990271452:web:20e4976467ed223175f319",
  measurementId: "G-1583BPV2T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export{firestore}