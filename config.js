// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdu-qsdhLNx8rn3YubCC_phSCr05Amtsc",
  authDomain: "conecte-gravidez.firebaseapp.com",
  databaseURL: "https://conecte-gravidez-default-rtdb.firebaseio.com",
  projectId: "conecte-gravidez",
  storageBucket: "conecte-gravidez.firebasestorage.app",
  messagingSenderId: "517923423605",
  appId: "1:517923423605:web:ec736a6536a07691d1ff3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);