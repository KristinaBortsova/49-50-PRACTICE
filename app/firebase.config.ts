// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuVkJohVJHA_8MNp735KLYmVY6JyHP9fM",
  authDomain: "restaurant-app-db15f.firebaseapp.com",
  projectId: "restaurant-app-db15f",
  storageBucket: "restaurant-app-db15f.firebasestorage.app",
  messagingSenderId: "457667580511",
  appId: "1:457667580511:web:9c23a7552670e496d441ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);      
export const db = getFirestore(app);    

export default app;