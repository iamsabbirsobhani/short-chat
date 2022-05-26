import Chat from "./views/Chat";
import CallingTimer from "./components/CallingTimer";
import { setName, setToken } from "./features/state/globalState";
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

const API = "https://short-chat-backend.herokuapp.com/verifyToken/";

function App(props) {
  const callTimer = useSelector((state) => state.global.callTimer);
  const istoken = useSelector((state) => state.global.token);
  const pId = useSelector((state) => state.global.peerId);
  const [state, setstate] = useState(true);
  const [isWrong, setIsWrong] = useState(false);
  const [isError, setisError] = useState(null);
  const [isLodaing, setIsLoading] = useState(false);
  const [hasToken, sethasToken] = useState(false);
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
      if ("error" in res) {
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

  return (
    <div className="App">
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
        {callTimer && (
          <CallingTimer peerId={pId} peer={props.peer} socket={props.socket} />
        )}
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
    </div>
  );
}

export default App;
