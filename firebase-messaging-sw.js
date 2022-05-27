importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyApeh-Xu-wCEDCey1MHlftsRwF8lg1YToo",
  authDomain: "short-chat-c385d.firebaseapp.com",
  projectId: "short-chat-c385d",
  storageBucket: "short-chat-c385d.appspot.com",
  messagingSenderId: "525525221823",
  appId: "1:525525221823:web:1c3040ab9abbbc2d82a10a",
  measurementId: "G-Q8TC6K6P4Z",
};
const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging(); // for receiving data from server & notification style as well
