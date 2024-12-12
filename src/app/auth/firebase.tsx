
import 'firebase/auth';
import {initializeApp } from 'firebase/app';

const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyBcrrkNLTGkrjHpLF2h9ATvKm-kgX8NAGA",
  authDomain: "liqueous-387606.firebaseapp.com",
  projectId: "liqueous-387606",
  storageBucket: "liqueous-387606.appspot.com",
  messagingSenderId: "806620983559",
  appId: "1:806620983559:web:12977a213bc32c5d87d5a2",
  measurementId: "G-F0FDBCEH29"
};

const firebaseApp = initializeApp(firebaseConfig);

export {
    firebaseApp
};
