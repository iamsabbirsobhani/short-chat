import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import store from "./app/store";
import { Provider } from "react-redux";

import { io } from "socket.io-client";
// const socket = io("https://short-chat-backend.herokuapp.com");
const socket = io("http://192.168.0.100:8080");

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <App socket={socket} />
    </React.StrictMode>
  </Provider>
);
