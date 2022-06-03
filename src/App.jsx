import Chat from "./views/Chat";
import CallingTimer from "./components/CallingTimer";
import {
  setName,
  setToken,
  setConnectedUsers,
  setSiteBlock,
  setSiteStatus,
  setDay,
  setLoggedUser,
} from "./features/state/globalState";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import axios from "axios";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import Signin from "./views/Signin";
import Signup from "./views/Signup";
import ImageGallery from "./views/ImageGallery";
import { messaging, getToken } from "./firebase/config";
import BlockNotice from "./components/BlockNotice";

const API = "https://short-chat-backend.herokuapp.com/verifyToken/";

function App(props) {
  const callTimer = useSelector((state) => state.global.callTimer);
  const token = useSelector((state) => state.global.token);
  const pId = useSelector((state) => state.global.peerId);
  const [state, setstate] = useState(true);
  const [isWrong, setIsWrong] = useState(false);
  const [isError, setisError] = useState(null);
  const [isLodaing, setIsLoading] = useState(false);
  const [hasToken, sethasToken] = useState(false);
  const [block, setblock] = useState(true);
  const dispatch = useDispatch();

  async function handleLogin(code) {
    setIsWrong(false);
    setIsLoading(true);
    setisError(null);
    code.preventDefault();
    try {
      const response = await axios.get(
        `https://short-chat-backend.herokuapp.com/${code.target[0].value}`
      );
      const res = await response.data;
      setstate(res);
      setIsWrong(res);
      setIsLoading(false);
      if (res && "error" in res) {
        setisError(res);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    async function verifyToken() {
      const token = JSON.parse(localStorage.getItem("user"));
      try {
        if (JSON.parse(localStorage.getItem("user"))) {
          const verify = await axios.get(API + token.accessToken);
          if (verify.data === true) {
            dispatch(setToken(null));
            localStorage.setItem("user", JSON.stringify(null));
          } else {
            dispatch(setToken(JSON.parse(localStorage.getItem("user"))));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    verifyToken();
  }, []);

  // online-offline status code
  useEffect(() => {
    props.socket.on("online", () => {
      const data = {
        online: true,
        socketId: props.socket.id,
        id: JSON.parse(localStorage.getItem("user")).id,
      };
      props.socket.emit("update-to-online", data);
    });
  });
  useEffect(() => {
    props.socket.on("online-status", (connectedUsers) => {
      dispatch(setConnectedUsers(connectedUsers));
    });

    props.socket.on("offline", (connectedUsers) => {
      dispatch(setConnectedUsers(connectedUsers));
    });

    props.socket.on("block-status", (auth) => {
      setblock(auth.rows[0].block);
      dispatch(setSiteBlock(auth.rows[0].block));
      dispatch(setSiteStatus(auth.rows[0]));
    });

    props.socket.on("day", (day) => {
      dispatch(setDay(day));
    });

    props.socket.on("get-current-user", (user) => {
      if (user?.id === JSON.parse(localStorage.getItem("user"))?.id) {
        dispatch(setLoggedUser(user));
      }
    });
  });
  // online-offline status code

  // fcm
  useEffect(() => {
    props.socket.emit("send-day");
    props.socket.emit("block-site-status");
    props.socket.emit(
      "get-logged-user",
      JSON.parse(localStorage.getItem("user"))?.id
    );

    let data = JSON.parse(localStorage.getItem("user"));
    getToken(messaging, {
      vapidKey:
        "BK5U3OatUDnGtiYBeLQ3IoB4wNE1mbsCfS30x8SJlwgXZOg4BJGvFGfjio8AdQNKg9u8xC5o_61dsw2pUyY2SCo",
    })
      .then((currentToken) => {
        if (currentToken) {
          data.token = currentToken;
          props.socket.emit("save-fcm-token", data);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }, []);
  // fcm

  return (
    <div className="App">
      {(token && token.admin) || block ? (
        <>
          <BrowserRouter>
            <Routes>
              <Route
                path="/signin"
                element={
                  JSON.parse(localStorage.getItem("user")) === null ? (
                    <Signin />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  JSON.parse(localStorage.getItem("user")) === null ? (
                    <Signup />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              <Route
                path="/*"
                element={
                  JSON.parse(localStorage.getItem("user")) ? (
                    <Chat
                      socket={props.socket}
                      peer={props.peer}
                      peerId={props.peerId}
                    />
                  ) : (
                    <Navigate to="signin" />
                  )
                }
              />
              <Route path="/images" element={<ImageGallery />} />
            </Routes>
          </BrowserRouter>
          <header>
            {/* {callTimer && (
              <CallingTimer
                peerId={pId}
                peer={props.peer}
                socket={props.socket}
              />
            )} */}
            {state && (
              <Login
                isError={isError}
                isLodaing={isLodaing}
                isWrong={isWrong}
                state={state}
                handleLogin={handleLogin}
              />
            )}
          </header>
        </>
      ) : (
        <BlockNotice />
      )}
    </div>
  );
}

export default App;
