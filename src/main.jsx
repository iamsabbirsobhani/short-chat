import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import store from "./app/store";
import { Provider } from "react-redux";

import { io } from "socket.io-client";
const socket = io("https://short-chat-backend.herokuapp.com");
// const socket = io("http://192.168.0.100:8080");

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: 8080,
// });

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "short-chat-backend.herokuapp",
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <App socket={socket} peer={peer} />
    </React.StrictMode>
  </Provider>
);
