import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { io } from "socket.io-client";

const socket = io("http://192.168.0.100:8080");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
