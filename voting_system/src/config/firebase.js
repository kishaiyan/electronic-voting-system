// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATwUy9PLrjwRFT8pef6wBViXxQCW6tgH0",
  authDomain: "group-proj-sse.firebaseapp.com",
  projectId: "group-proj-sse",
  storageBucket: "group-proj-sse.appspot.com",
  messagingSenderId: "487638201372",
  appId: "1:487638201372:web:ca0f2e4fa4de96097ddbd9",
  measurementId: "G-12TJS3JYB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore= getFirestore(app);