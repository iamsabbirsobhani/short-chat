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
  apiKey: "AIzaSyApeh-Xu-wCEDCey1MHlftsRwF8lg1YToo",
  authDomain: "short-chat-c385d.firebaseapp.com",
  projectId: "short-chat-c385d",
  storageBucket: "short-chat-c385d.appspot.com",
  messagingSenderId: "525525221823",
  appId: "1:525525221823:web:1c3040ab9abbbc2d82a10a",
  measurementId: "G-Q8TC6K6P4Z",
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
