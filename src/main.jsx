import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { io } from "socket.io-client";
import Navbar from "./components/Navbar";

// const socket = io("https://short-chat-backend.herokuapp.com");
const socket = io("http://localhost:8080");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Navbar />
    <App socket={socket} />
  </React.StrictMode>
);
