// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp2siUtW3ADyrgN0YdNs9ZciBkDm2cpPI",
  authDomain: "sc-bend.firebaseapp.com",
  projectId: "sc-bend",
  storageBucket: "sc-bend.appspot.com",
  messagingSenderId: "743347496558",
  appId: "1:743347496558:web:98034a45e24fcf3f40a87f",
  measurementId: "G-TX296X0MMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
const db = getDatabase(app);

export {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  messaging,
  getToken,
  db,
};
