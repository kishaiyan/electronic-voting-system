// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5Ba0N9lQOsgs-kZSgtj1XlNQPMW_WiDs",
  authDomain: "sse-group-proj.firebaseapp.com",
  projectId: "sse-group-proj",
  storageBucket: "sse-group-proj.appspot.com",
  messagingSenderId: "706305308336",
  appId: "1:706305308336:web:1c93ffbd955a8c8d246d75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore= getFirestore(app);

if (process.env.NODE_ENV === 'test') {
  app.auth().settings.appVerificationDisabledForTesting = true;
}