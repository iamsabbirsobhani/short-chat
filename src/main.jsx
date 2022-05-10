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

// const socket = io("http://192.168.0.100:8080");

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: 8080,
// });

const socket = io("https://short-chat-backend.herokuapp.com");

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "short-chat-backend.herokuapp.com",
});

let peerId;

peer.on("open", (id) => {
  peerId = id;
  console.log("peer open", id);
  socket.emit("get-peer-id", id);
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route
          path="/*"
          element={<App socket={socket} peerId={peerId} peer={peer} />}
        />
        {/* <Route path="transcript" element={<TranscriptChat />} />
        </Route> */}
        <Route path="/images" element={<ImageGallery />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);
