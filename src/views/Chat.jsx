import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import "../styles/chat.scss";
import _debounce from "lodash/debounce";
import TypingIndicator from "../components/TypingIndicator";
import Caller from "../components/Caller";
import { useSelector, useDispatch } from "react-redux";
import Receiver from "../components/Receiver";
import Navbar from "../components/Navbar";
import {
  openCallerScreenOn,
  openCallerScreenOff,
  receiverUIFnOn,
  receiverUIFnOff,
  callTimerOn,
  setPeerId,
  callTimerOff,
} from "../features/state/globalState";
import { io } from "socket.io-client";
import CallingTimer from "../components/CallingTimer";
import { fileUpload } from "../composable/fileUpload";
import { async } from "@firebase/util";
import Progress from "../components/Progress";
import { Route, Routes } from "react-router-dom";
import TranscriptChat from "./TranscriptChat";
import Social from "./Social";

export default function Chat(props) {
  const openCalling = useSelector((state) => state.global.openCalling);
  const name = useSelector((state) => state.global.name);
  const receiverUI = useSelector((state) => state.global.receiverUI);
  const callTimer = useSelector((state) => state.global.callTimer);
  const pId = useSelector((state) => state.global.peerId);
  const dispatch = useDispatch();
  const debounceFn = useCallback(_debounce(handleDebounce, 600), []);
  const [msg, setMsg] = useState([]);
  const [id, setId] = useState([]);
  const [chat, setChat] = useState(null);
  const [imgChunks, setImgChunks] = useState([]);
  const [timer, setTimer] = useState([]);
  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(0);
  const [url, setUrl] = useState(null);
  const [isTypings, setIsTypings] = useState({
    isTyping: false,
    id: id,
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleUpload = async (e) => {
    console.log(e.target.files[0].name);
    await fileUpload(e.target.files[0], setUploading, setUrl);
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
        id: props.socket.id,
        name: name,
        url: url,
        createdAt: new Date(),
      };
    } else if (chat) {
      msg = {
        id: props.socket.id,
        name: name,
        chat: chat,
        createdAt: new Date(),
      };
    }

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

  // everytime mounted this page will be
  // emit event chat message for showing messages
  // useEffect(() => {
  //   props.socket.emit("chat message");
  //   console.log("Mounted");
  //   return () => {
  //     console.log("Dismounted");
  //   };
  // });

  useEffect(() => {
    props.socket.on("chat message", (res) => {
      setId(props.socket.id);
      setMsg(res);
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
      console.log(caller);
      console.log(caller.id);
      if (caller.id !== props.socket.id) {
        dispatch(receiverUIFnOn());
      }
    });

    props.socket.on("close-call", (id) => {
      if (id !== props.socket.id) {
        dispatch(receiverUIFnOff());
        // console.log("closed call");
      }
    });

    props.socket.on("call-end", (id) => {
      if (id !== props.socket.id) {
        dispatch(openCallerScreenOff());
        dispatch(receiverUIFnOff());
        // console.log("call ended inside logic");
      }
      // console.log("call-end");
    });
    props.socket.on("call-received", (id) => {
      // if (id !== props.socket.id) {
      dispatch(openCallerScreenOff());
      dispatch(receiverUIFnOff());
      dispatch(callTimerOn());
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
    dispatch(callTimerOn());
    props.socket.emit("call-received", props.socket.id);
    props.socket.emit("all-mic-on", false);
  };

  return (
    <>
      <Navbar callSend={callSend} />
      <Progress uploading={uploading} />
      {alert ? (
        <div className=" absolute z-20 left-0 right-0 bg-red-500 transition duration-300 w-72 m-auto p-3">
          <p className=" text-white uppercase font-semibold text-center">
            {alert}
          </p>
        </div>
      ) : null}

      <div className="scroll-style w-[350px] h-[68vh] overflow-y-scroll m-auto">
        <div>
          {openCalling && <Caller closeCall={closeCall} />}
          {receiverUI && (
            <Receiver callReceive={callReceive} callEnd={callEnd} />
          )}
        </div>

        {msg.length ? (
          <div className="">
            {msg.map((m, index) =>
              m.id == id ? (
                <div
                  ref={messagesEndRef}
                  className=" relative float-right mr-1  mb-2 text-white bg-emerald-700 p-3 rounded-lg w-52  break-words"
                  key={index}
                >
                  {m.chat && <h1 className=" mt-1 mb-1 ">{m.chat}</h1>}
                  {m.url && (
                    <div className=" rounded-md mt-1 mb-1 ">
                      <img loading="lazy" src={m.url} alt="" />
                    </div>
                  )}

                  <p className=" absolute bottom-1 text-xs text-gray-300 right-1">
                    {format(new Date(m.createdAt), "p")}
                  </p>
                </div>
              ) : (
                <div className="w-52">
                  <div
                    className=" ml-1 relative float-left text-white mb-2 bg-gray-700 p-3 rounded-lg w-52 break-words"
                    key={index}
                    ref={messagesEndRef}
                  >
                    {m.chat && <h1 className=" mt-1 mb-1 ">{m.chat}</h1>}
                    {m.url && (
                      <div className=" rounded-md mt-1 mb-1 ">
                        <img loading="lazy" src={m.url} alt="" />
                      </div>
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
          <label htmlFor="chatField">
            <div className="text-purple-500 p-2 bg-purple-500/40 w-9 h-9 rounded-full absolute left-7 top-1.5">
              <label htmlFor="file-input" className=" cursor-pointer ">
                <ion-icon name="image"></ion-icon>
              </label>
              <input
                className=" hidden w-9"
                type="file"
                name=""
                id="file-input"
                onChange={(e) => handleUpload(e)}
              />
            </div>
          </label>
          <input
            className=" bg-gray-800 text-white outline-none w-[280px] py-3 pl-[50px] pr-14 p-10 rounded-3xl"
            type="text"
            name="chatField"
            onChange={(e) => handleChat(e)}
            placeholder="Message..."
            autoComplete="off"
          />
          <button
            type="submit"
            className=" bg-blue-500/40 h-9 w-9 rounded-full p-2 text-blue-500 absolute right-[30px] top-[6px]"
          >
            <ion-icon name="send"></ion-icon>
          </button>
        </div>
      </form>
      <Routes>
        <Route path="transcript" element={<TranscriptChat />} />
        <Route path="social" element={<Social />} />
      </Routes>
    </>
  );
}
