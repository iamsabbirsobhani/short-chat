import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import "./index.css";
import store from "./app/store";
import { Provider } from "react-redux";

import { io } from "socket.io-client";
import Chat from "./views/Chat";
const socket = io("https://short-chat-backend.herokuapp.com");
// const socket = io("http://192.168.0.100:8080");
// import { setPeerId } from "./features/state/globalState";
// import { useDispatch } from "react-redux";
// const dispatch = useDispatch();

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: 8080,
// });

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "short-chat-backend.herokuapp.com",
});
let peerId;

peer.on("open", (id) => {
  // socket.emit("abc", 4545);
  peerId = id;
  console.log("peer open", id);
  socket.emit("get-peer-id", id);
  // socket.emit("join", id);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <Chat socket={socket} peer={peer} peerId={peerId} />
      {/* <App socket={socket} peerId={peerId} peer={peer} /> */}
    </React.StrictMode>
  </Provider>
);
