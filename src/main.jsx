import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import store from "./app/store";
import { Provider } from "react-redux";
import { io } from "socket.io-client";
import ImageGallery from "./views/ImageGallery";
import TranscriptChat from "./views/TranscriptChat";
import Signin from "./views/Signin";
import Signup from "./views/Signup";
import { Navigate } from "react-router-dom";

// const socket = io(
//   "http://192.168.0.100:8080",
//   JSON.parse(localStorage.getItem("user"))
// );

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: 8080,
// });

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

const socket = io("https://sc-backend-akjr.onrender.com");
// const socket = io("http://localhost:8083");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>
);
