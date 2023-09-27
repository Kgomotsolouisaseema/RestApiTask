// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage,ref} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBOtZWA25ABIVdRDw56v4oo2tRgbssw49g",
  authDomain: "audio-recorder-restapi.firebaseapp.com",
  projectId: "audio-recorder-restapi",
  storageBucket: "audio-recorder-restapi.appspot.com",
  messagingSenderId: "848539386598",
  appId: "1:848539386598:web:83952fa5c089837d2e3127",
  measurementId: "G-KTCJMS2MPF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const  auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const  storage = getStorage(app)
export const storageRef = ref(storage)
