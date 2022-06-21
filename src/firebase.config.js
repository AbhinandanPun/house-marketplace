// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ1o7QdlTKkMzXfEreazT1CZWRgSbe89s",
  authDomain: "house-market-app-64cb3.firebaseapp.com",
  projectId: "house-market-app-64cb3",
  storageBucket: "house-market-app-64cb3.appspot.com",
  messagingSenderId: "137867987313",
  appId: "1:137867987313:web:b500799505fb34f9dc8ed0"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()