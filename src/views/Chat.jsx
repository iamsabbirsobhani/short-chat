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
} from "../features/state/globalState";
import { io } from "socket.io-client";
import CallingTimer from "../components/CallingTimer";

export default function Chat(props) {
  const openCalling = useSelector((state) => state.global.openCalling);
  const receiverUI = useSelector((state) => state.global.receiverUI);
  const dispatch = useDispatch();

  const debounceFn = useCallback(_debounce(handleDebounce, 600), []);
  const [msg, setMsg] = useState([]);
  const [id, setId] = useState([]);
  const [chat, setChat] = useState(null);
  const [imgChunks, setImgChunks] = useState([]);
  const [timer, setTimer] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isTypings, setIsTypings] = useState({
    isTyping: false,
    id: id,
  });
  const messagesEndRef = useRef(null);
  const imgref = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
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
    // console.log(chat, "- Has chnaged");

    let isTyping = {
      isTyping: true,
      id: props.socket.id,
    };
    if (chat && !isTypings.isTyping) {
      props.socket.emit("typing", isTyping);
    }
  }, [chat]);

  const sendMsg = (e) => {
    e.preventDefault();
    let msg = {
      id: props.socket.id,
      chat: chat,
      createdAt: new Date(),
    };
    // console.log(msg);
    if (chat) {
      // props.socket.emit("chat message", `${chat} ${props.socket.id}`);
      props.socket.emit("chat message", msg);
    }
    setChat(null);
    e.target.chatField.value = null;
  };

  useEffect(() => {
    // console.log(props.socket.id);
    props.socket.on("chat message", (res) => {
      setId(props.socket.id);
      setMsg(res);
    });
    props.socket.on("typing", function (isTyping) {
      // console.log(isTyping);
      setIsTypings(isTyping);
    });
    // for image
    let imgAr = [];
    // props.socket.on("img-chunk", function (chunk) {
    //   imgAr.push(chunk);
    //   setImgChunks(imgAr);
    //   // console.log(imgChunks);
    // });

    // props.socket.on("timer", function (sec) {
    //   // console.log(sec);
    //   setTimer(sec);
    // });

    props.socket.on("alert", function (msg) {
      // console.log(msg);
      setAlert(msg);
    });

    const stopScrol = setInterval(() => {
      scrollToBottom();
      // console.log("sd");
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
      }
      console.log("closed call");
    });

    props.socket.on("call-end", (id) => {
      if (id !== props.socket.id) {
        dispatch(openCallerScreenOff());
        dispatch(receiverUIFnOff());
        console.log("call ended inside logic");
      }
      console.log("call-end");
    });
  });

  const closeCall = () => {
    console.log("Close Call");
    props.socket.emit("close-call", props.socket.id);
    dispatch(openCallerScreenOff());
  };

  const callEnd = () => {
    console.log("call ended");
    props.socket.emit("call-end", props.socket.id);
    dispatch(receiverUIFnOff());
  };
  const callSend = () => {
    console.log("call send");
    dispatch(openCallerScreenOn());
    let caller = {
      id: props.socket.id,
      isCalling: true,
      createdAt: new Date(),
    };
    props.socket.emit("calling", caller);
  };

  return (
    <>
      <Navbar callSend={callSend} />
      <CallingTimer />
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
          {receiverUI && <Receiver callEnd={callEnd} />}
        </div>
        {msg.length ? (
          <div className="">
            {/* style={
                   m.includes(id)
                     ? { flex: "right", whiteSpace: "pre-wrap", color: "gray" }
                     : { color: "" }
                 } */}
            {msg.map((m, index) =>
              m.id == id ? (
                <div
                  ref={messagesEndRef}
                  className=" relative float-right mr-1  mb-2 text-white bg-emerald-700 p-3 rounded-lg w-52  break-words"
                  key={index}
                >
                  <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
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
                    <h1 className=" mt-1 mb-1">{m.chat}</h1>
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
      {/* <img src={`data:image/jpeg;base64,` + window.btoa(imgChunks)} alt="" /> */}
    </>
  );
}
