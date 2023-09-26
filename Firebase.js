// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage,ref} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBodJkJaJxMgPfvAnpl2S0jBTG-T1MLtPE",
  authDomain: "audiojournal-bfa2a.firebaseapp.com",
  projectId: "audiojournal-bfa2a",
  storageBucket: "audiojournal-bfa2a.appspot.com",
  messagingSenderId: "616786219068",
  appId: "1:616786219068:web:4a7a14857e47ccc5c67339",
  measurementId: "G-8TNMLWNEY6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const  auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const  storage = getStorage(app)
export const storageRef = ref(storage)
