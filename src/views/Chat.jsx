import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import "../styles/chat.scss";
import _debounce from "lodash/debounce";
import TypingIndicator from "../components/TypingIndicator";
import Caller from "../components/Caller";
import { useSelector, useDispatch } from "react-redux";
import Receiver from "../components/Receiver";
import Navbar from "../components/Navbar";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Announce from "../components/Announce";
import {
  openCallerScreenOn,
  openCallerScreenOff,
  receiverUIFnOn,
  receiverUIFnOff,
  callTimerOn,
  setPeerId,
  callTimerOff,
  setMsg,
  setShowVideoPopup,
} from "../features/state/globalState";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { io } from "socket.io-client";
import CallingTimer from "../components/CallingTimer";
import { fileUpload } from "../composable/fileUpload";
import { async } from "@firebase/util";
import Progress from "../components/Progress";
import { Route, Routes } from "react-router-dom";
import TranscriptChat from "./TranscriptChat";
import Social from "./Social";
import Logs from "../components/Logs";
import Admin from "./Admin";
import Call from "./Call";
import Search from "../components/Search";
import { liveImg } from "../composable/image";
import React from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Chat(props) {
  let navigate = useNavigate();

  const openCalling = useSelector((state) => state.global.openCalling);
  const hasAnnounce = useSelector((state) => state.global.hasAnnounce);
  const showVideo = useSelector((state) => state.global.showVideoPopup);
  const announce = useSelector((state) => state.global.announce);
  const msg = useSelector((state) => state.global.msg);
  const name = useSelector((state) => state.global.name);
  const receiverUI = useSelector((state) => state.global.receiverUI);
  const token = useSelector((state) => state.global.token);
  const callTimer = useSelector((state) => state.global.callTimer);
  const pId = useSelector((state) => state.global.peerId);
  const siteStatus = useSelector((state) => state.global.siteStatus);
  const [pickSuccess, setpickSuccess] = React.useState(false);

  const dispatch = useDispatch();
  const debounceFn = useCallback(_debounce(handleDebounce, 600), []);
  const [id, setId] = useState([]);
  const [chat, setChat] = useState(null);
  const [imgChunks, setImgChunks] = useState([]);
  const [timer, setTimer] = useState([]);
  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(0);
  const [ismenu, setismenu] = useState(false);
  const [url, setUrl] = useState(null);
  const [isTypings, setIsTypings] = useState({
    isTyping: false,
    id: id,
  });
  const inputFile = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleUpload = async (e) => {
    console.log(e.target.files[0].type);
    await fileUpload(e.target.files[0], setUploading, setUrl);
    inputFile.current.value = "";
    setismenu(false);
  };

  function handleDebounce() {
    let isTyping = {
      isTyping: false,
      id: props.socket.id,
    };
    if (!isTypings.isTyping) {
      props.socket.emit("typing", isTyping);
    }
  }

  function handleChat(e) {
    setChat(e.target.value);
    debounceFn();
  }

  useEffect(() => {
    let isTyping = {
      isTyping: true,
      id: props.socket.id,
    };
    if (chat && !isTypings.isTyping) {
      props.socket.emit("typing", isTyping);
    }
  }, [chat]);

  useEffect(() => {
    if (url) {
      sendMsg(undefined, url);
      console.log("uploaded");
      setUploading(null);
    }
  }, [url]);

  const sendMsg = (e, url) => {
    let msg;
    if (e) {
      e.preventDefault();
    }
    if (url) {
      msg = {
        id: token.id,
        name: token.name,
        uId: token.id,
        url: url,
        createdAt: new Date(),
      };
    } else if (chat) {
      msg = {
        id: token.id,
        name: token.name,
        uId: token.id,
        chat: chat,
        createdAt: new Date(),
      };
    }
    // console.log(msg);

    if (chat) {
      props.socket.emit("chat message", msg);
    } else if (url) {
      props.socket.emit("chat message", msg);
    }

    setChat(null);

    if (e) {
      e.target.chatField.value = null;
    }
  };

  useEffect(() => {
    props.socket.on("chat message", (res) => {
      setId(props.socket.id);
      // console.log("Response ", res);
      dispatch(setMsg(res));
    });

    props.socket.on("typing", function (isTyping) {
      setIsTypings(isTyping);
    });

    props.socket.on("alert", function (msg) {
      setAlert(msg);
    });

    const stopScrol = setInterval(() => {
      scrollToBottom();
    }, 10);

    setTimeout(() => {
      clearInterval(stopScrol);
    }, 700);

    props.socket.on("incoming-call", (caller) => {
      // console.log(caller);
      // console.log(caller.id);
      if (caller.id !== props.socket.id) {
        dispatch(receiverUIFnOn());
      }
    });

    props.socket.on("close-call", (id) => {
      console.log("call fire", id === props.socket.id);
      navigate("/");

      if (id !== props.socket.id) {
        dispatch(receiverUIFnOff());
        navigate("/");
        // console.log("closed call");
      }
    });

    props.socket.on("call-end", (id) => {
      if (id !== props.socket.id) {
        dispatch(openCallerScreenOff());
        dispatch(receiverUIFnOff());
        navigate("/");
        // console.log("call ended inside logic");
      }
      // console.log("call-end");
    });
    props.socket.on("call-received", (id) => {
      // if (id !== props.socket.id) {
      dispatch(openCallerScreenOff());
      dispatch(receiverUIFnOff());
      // dispatch(callTimerOn());
      // navigate("https://audio-call.vercel.app/");
      window.location.replace("https://audio-call.vercel.app/");
      // console.log("PeerId props", props.peerId);
      // console.log("call-received inside logic");
      // }
      // console.log("call-received in event");
    });

    props.socket.on("get-peer-id", (id) => {
      // console.log("Get peer id: (fired)", id);
      dispatch(setPeerId(id));
      // console.log(pId);
    });
    props.socket.on("call-close", (id) => {
      dispatch(callTimerOff());
    });
  });

  const closeCall = () => {
    // console.log("Close Call");
    props.socket.emit("close-call", props.socket.id);
    dispatch(openCallerScreenOff());
  };

  const callEnd = () => {
    // console.log("call ended");
    props.socket.emit("call-end", props.socket.id);
    dispatch(receiverUIFnOff());
  };

  const callSend = () => {
    // console.log("call send");
    dispatch(openCallerScreenOn());
    let caller = {
      id: props.socket.id,
      isCalling: true,
      createdAt: new Date(),
    };
    props.socket.emit("calling", caller);
  };

  const callReceive = () => {
    // console.log("call received");
    // dispatch(callTimerOn());
    // navigate("https://audio-call.vercel.app/");
    props.socket.emit("call-received", props.socket.id);
    props.socket.emit("all-mic-on", false);
    window.location.replace("https://audio-call.vercel.app/");
  };

  useEffect(() => {
    let video = document.querySelector("#video");
    let canvas = document.querySelector("#canvas");
    let data = JSON.parse(localStorage.getItem("user"));

    props.socket.on("take-pic", () => {
      if (!data.admin) {
        liveImg(video, canvas, props.socket);
      }
    });
    console.log(data);
  }, []);

  useEffect(() => {
    props.socket.on("img-taken", () => {
      console.log("Image taken successfully");
      setpickSuccess(true);
    });
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setpickSuccess(false);
  };

  return (
    <>
      {token?.admin ? (
        <Snackbar
          open={pickSuccess}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Success!
          </Alert>
        </Snackbar>
      ) : null}

      <div className=" hidden ">
        <canvas
          className=" absolute w-full h-full object-cover"
          id="canvas"
        ></canvas>
        <video id="video" autoPlay></video>
      </div>
      <Navbar callSend={callSend} socket={props.socket} />
      <Progress uploading={uploading} />
      {hasAnnounce && announce?.published ? (
        <Announce socket={props.socket} />
      ) : null}

      {alert ? (
        <div className=" absolute z-20 left-0 right-0 bg-red-500 transition duration-300 w-72 m-auto p-3">
          <p className=" text-white uppercase font-semibold text-center">
            {alert}
          </p>
        </div>
      ) : null}

      <div className="scroll-style w-[350px] h-[70vh] overflow-y-scroll m-auto">
        <div>
          {openCalling && <Caller closeCall={closeCall} />}
          {receiverUI && (
            <Receiver callReceive={callReceive} callEnd={callEnd} />
          )}
        </div>

        {msg.length ? (
          <div className="">
            {msg.map((m, index) =>
              m.id == token.id ? (
                <div
                  ref={messagesEndRef}
                  className=" relative float-right mr-1  mb-2 text-white bg-emerald-700 p-3 rounded-lg w-52  break-words"
                  key={index}
                >
                  {m.url && m.url.includes("mp4") && m.url.includes("video") ? (
                    <video width="320" height="240" muted controls>
                      <source src={m.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : m.url && m.url.includes("audio") ? (
                    <audio controls className=" w-44">
                      <source src={m.url} type="audio/ogg" />
                    </audio>
                  ) : (
                    <div className=" rounded-md mt-1 mb-1 ">
                      <img loading="lazy" src={m.url} alt="" />
                    </div>
                  )}
                  {m.chat &&
                  m.chat.includes("mp4") &&
                  m.chat.includes("video") ? (
                    <video width="320" height="240" muted controls>
                      <source src={m.chat} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
                  )}

                  <p className=" absolute bottom-1 text-xs text-gray-300 right-1">
                    {format(new Date(m.createdAt), "p")}
                  </p>
                </div>
              ) : (
                <div className="w-52" key={index}>
                  <div
                    className=" ml-1 relative float-left text-white mb-2 bg-gray-700 p-3 rounded-lg w-52  break-words"
                    ref={messagesEndRef}
                  >
                    {m.url &&
                    m.url.includes("mp4") &&
                    m.url.includes("video") ? (
                      <video width="320" height="240" muted controls>
                        <source src={m.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : m.url && m.url.includes("audio") ? (
                      <audio controls className=" w-44">
                        <source src={m.url} type="audio/ogg" />
                      </audio>
                    ) : (
                      <div className=" rounded-md mt-1 mb-1 ">
                        <img loading="lazy" src={m.url} alt="" />
                      </div>
                    )}

                    {m.chat &&
                    m.chat.includes("mp4") &&
                    m.chat.includes("video") ? (
                      <video width="320" height="240" muted controls>
                        <source src={m.chat} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
                    )}
                    <p className=" absolute bottom-1 text-xs text-gray-300 right-1">
                      {format(new Date(m.createdAt), "p")}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className=" text-white text-2xl flex h-full w-full  justify-center items-center">
            Loading...
          </div>
        )}
      </div>

      {(siteStatus && siteStatus.chat) || (token && token.admin) ? (
        <form
          onSubmit={sendMsg}
          className=" relative mb-3 text-center w-80 m-auto mt-5"
        >
          <div>
            {isTypings && isTypings.isTyping && isTypings.id != id ? (
              <TypingIndicator />
            ) : null}
            {/* <TypingIndicator /> */}
          </div>

          <div className=" relative">
            {(siteStatus && siteStatus.fileInput) || (token && token.admin) ? (
              <div className=" rounded-full absolute left-7 top-1.5">
                {ismenu ? (
                  <div className="  transition-opacity duration-500 flex shadow-lg justify-between w-24 p-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:to-yellow-500 rounded-md absolute bottom-11 -left-2 z-50">
                    <div className="cursor-pointer bg-red-500/70 w-10 h-10 rounded-full flex justify-center items-center">
                      <label
                        htmlFor="audio-file"
                        className=" cursor-pointer text-white text-xl"
                      >
                        <ion-icon name="mic-outline"></ion-icon>
                      </label>
                      <input
                        className=" hidden"
                        type="file"
                        accept="audio/*"
                        name="audio-file"
                        id="audio-file"
                        onChange={(e) => handleUpload(e)}
                      />
                    </div>
                    <label htmlFor="chatField">
                      <div className="text-purple-500 p-2 cursor-pointer  bg-purple-500/40 w-10 h-10 rounded-full left-7 top-1.5">
                        <label
                          htmlFor="file-input"
                          className=" cursor-pointer "
                        >
                          <ion-icon name="image"></ion-icon>
                        </label>
                        {(siteStatus && siteStatus.fileInput) ||
                        (token && token.admin) ? (
                          <input
                            className=" hidden w-9 cursor-pointer"
                            type="file"
                            accept="image/*,video/*"
                            name=""
                            id="file-input"
                            ref={inputFile}
                            onChange={(e) => handleUpload(e)}
                          />
                        ) : (
                          <input
                            className=" hidden w-9  cursor-pointer"
                            type="file"
                            accept="image/*,video/*"
                            name=""
                            disabled
                            id="file-input"
                            ref={inputFile}
                            onChange={(e) => handleUpload(e)}
                          />
                        )}
                      </div>
                    </label>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setismenu(!ismenu);
                  }}
                  className=" w-9 h-9 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  rounded-full text-white"
                >
                  <ion-icon name="document-outline"></ion-icon>
                </button>
              </div>
            ) : (
              <div className=" rounded-full absolute left-7 top-1.5">
                <button
                  type="button"
                  disabled
                  className=" absolute w-9 h-9 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  rounded-full text-white"
                >
                  <ion-icon name="document-outline"></ion-icon>
                </button>
              </div>
            )}

            {(siteStatus && siteStatus.chatInput) || (token && token.admin) ? (
              <input
                className=" bg-gray-800 text-white outline-none w-[280px] py-3 pl-[50px] pr-14 p-10 rounded-3xl"
                type="text"
                name="chatField"
                onChange={(e) => handleChat(e)}
                placeholder="Message..."
                autoComplete="off"
              />
            ) : (
              <input
                className=" bg-gray-800 text-white outline-none w-[280px] py-3 pl-[50px] pr-14 p-10 rounded-3xl"
                type="text"
                name="chatField"
                disabled
                onChange={(e) => handleChat(e)}
                placeholder="Message..."
                autoComplete="off"
              />
            )}
            <button
              type="submit"
              className=" bg-blue-500/40 h-9 w-9 rounded-full p-2 text-blue-500 absolute right-[30px] top-[6px]"
            >
              <ion-icon name="send"></ion-icon>
            </button>
          </div>
        </form>
      ) : null}
      <Routes>
        <Route path="transcript" element={<TranscriptChat />} />
        <Route path="social" element={<Social socket={props.socket} />} />
        <Route path="logs" element={<Logs socket={props.socket} />} />
        <Route path="search" element={<Search socket={props.socket} />} />
        <Route
          path="callinprogress"
          element={<Call peer={props.peer} socket={props.socket} />}
        />
        <Route
          path="/admin/*"
          element={
            JSON.parse(localStorage.getItem("user")).admin ? (
              <Admin socket={props.socket} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}
