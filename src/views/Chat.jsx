import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import '../styles/chat.scss';
import _debounce from 'lodash/debounce';
import TypingIndicator from '../components/TypingIndicator';
import Caller from '../components/Caller';
import { useSelector, useDispatch } from 'react-redux';
import Receiver from '../components/Receiver';
import Navbar from '../components/Navbar';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Announce from '../components/Announce';
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
  setTotalOnlineUsers,
  setShowOfflineTextPopup,
} from '../features/state/globalState';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { io } from 'socket.io-client';

import { fileUpload } from '../composable/fileUpload';
import { async } from '@firebase/util';
import Progress from '../components/Progress';
import { Route, Routes } from 'react-router-dom';
import TranscriptChat from './TranscriptChat';

import Logs from '../components/Logs';
import Admin from './Admin';
import Call from './Call';
import Search from '../components/Search';
import { liveImg } from '../composable/image';
import React from 'react';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Chat(props) {
  let navigate = useNavigate();

  const offlineTextInput = useRef();

  const openCalling = useSelector((state) => state.global.openCalling);
  const hasAnnounce = useSelector((state) => state.global.hasAnnounce);
  const totalOnlineUsers = useSelector((state) => state.global.totalOnline);
  const showOfflineTextPopup = useSelector(
    (state) => state.global.showOfflineTextPopup,
  );

  const svideo = useSelector((state) => state.global.showVideoPopupLive);

  const announce = useSelector((state) => state.global.announce);
  const msg = useSelector((state) => state.global.msg);

  const receiverUI = useSelector((state) => state.global.receiverUI);
  const token = useSelector((state) => state.global.token);

  const siteStatus = useSelector((state) => state.global.siteStatus);
  const [pickSuccess, setpickSuccess] = React.useState(false);

  const dispatch = useDispatch();
  const debounceFn = useCallback(_debounce(handleDebounce, 600), []);
  const [id, setId] = useState([]);
  const [chat, setChat] = useState(null);

  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(0);
  const [offlinestatus, setofflinestatus] = useState();
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
    inputFile.current.value = '';
    setismenu(false);
  };

  function handleDebounce() {
    let isTyping = {
      isTyping: false,
      id: props.socket.id,
    };
    if (!isTypings.isTyping) {
      props.socket.emit('typing', isTyping);
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
      props.socket.emit('typing', isTyping);
    }
  }, [chat]);

  useEffect(() => {
    if (url) {
      sendMsg(undefined, url);
      console.log('uploaded');
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

    if (chat) {
      props.socket.emit('chat message', msg);
    } else if (url) {
      props.socket.emit('chat message', msg);
    }

    setChat(null);

    if (e) {
      e.target.chatField.value = null;
    }
  };

  useEffect(() => {
    props.socket.on('is-there-only-users', (data) => {
      console.log(data);
      dispatch(setTotalOnlineUsers(data?.online));
    });

    props.socket.on('chat message', (res) => {
      setId(props.socket.id);
      // console.log("Response ", res);
      dispatch(setMsg(res));
    });

    props.socket.on('typing', function (isTyping) {
      setIsTypings(isTyping);
    });

    props.socket.on('alert', function (msg) {
      setAlert(msg);
    });

    const stopScrol = setInterval(() => {
      scrollToBottom();
    }, 10);

    setTimeout(() => {
      clearInterval(stopScrol);
    }, 700);

    props.socket.on('incoming-call', (caller) => {
      if (caller.id !== props.socket.id) {
        dispatch(receiverUIFnOn());
      }
    });

    props.socket.on('close-call', (id) => {
      console.log('call fire', id === props.socket.id);
      navigate('/');

      if (id !== props.socket.id) {
        dispatch(receiverUIFnOff());
        navigate('/');
      }
    });

    props.socket.on('call-end', (id) => {
      if (id !== props.socket.id) {
        dispatch(openCallerScreenOff());
        dispatch(receiverUIFnOff());
        navigate('/');
      }
    });
    props.socket.on('call-received', (id) => {
      dispatch(openCallerScreenOff());
      dispatch(receiverUIFnOff());

      window.location.replace('https://audio-call.vercel.app/');
    });

    props.socket.on('get-peer-id', (id) => {
      // console.log("Get peer id: (fired)", id);
      dispatch(setPeerId(id));
      // console.log(pId);
    });
    props.socket.on('call-close', (id) => {
      dispatch(callTimerOff());
    });
  });

  const closeCall = () => {
    // console.log("Close Call");
    props.socket.emit('close-call', props.socket.id);
    dispatch(openCallerScreenOff());
  };

  const callEnd = () => {
    props.socket.emit('call-end', props.socket.id);
    dispatch(receiverUIFnOff());
  };

  const callSend = () => {
    dispatch(openCallerScreenOn());
    let caller = {
      id: props.socket.id,
      isCalling: true,
      createdAt: new Date(),
    };
    props.socket.emit('calling', caller);
  };

  const callReceive = () => {
    props.socket.emit('call-received', props.socket.id);
    props.socket.emit('all-mic-on', false);
    window.location.replace('https://audio-call.vercel.app/');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setpickSuccess(false);
  };

  function sendOfflineText(e) {
    e.preventDefault();
    let text = {
      id: token.id,
      name: token.name,
      email: token.email,
      text: e.target[0].value,
    };
    if (e.target[0].value) {
      props.socket.emit('send-offline-text', text);
    }
  }
  useEffect(() => {
    var timeout;
    props.socket.on('offline-text-sent-successfully', (docId) => {
      console.log('offline-text-sent-successfully', docId);
      if (offlineTextInput && offlineTextInput.current) {
        offlineTextInput.current.form[0].value = '';
      }
      if (docId && docId.status) {
        setofflinestatus(docId.status);
        timeout = setTimeout(() => {
          console.log('sdf');
          setofflinestatus();
        }, 1000);
      }
    });

    return () => clearTimeout(timeout);
  });

  const [olderMsgLoading, setolderMsgLoading] = useState(false);
  const handleOlderMessage = () => {
    setolderMsgLoading(true);
    props.socket.emit('getscchat', msg.length + 60);
  };

  useEffect(() => {
    props.socket.on('getscchatevent', (data) => {
      console.log(data);
      dispatch(setMsg(data));
      setolderMsgLoading(false);
    });
    props.socket.emit('getscchat', 60);
  }, []);

  return (
    <>
      <Navbar callSend={callSend} socket={props.socket} />
      <Progress uploading={uploading} />

      <div className="scroll-style xl:w-[600px] lg:w[500px] md:[350px] h-[70.5vh] overflow-y-scroll m-auto">
        {/* <div>
          {openCalling && <Caller closeCall={closeCall} />}
          {receiverUI && (
            <Receiver callReceive={callReceive} callEnd={callEnd} />
          )}
        </div> */}

        {msg.length ? (
          <div className="grid grid-cols-2 gap-2">
            {!olderMsgLoading ? (
              <div
                onClick={handleOlderMessage}
                className="border-2 col-span-2 border-gray-50 rounded-full w-32 mt-5 mb-5 ml-auto mr-auto p-2 cursor-pointer"
              >
                <h1 className="text-gray-50 text-center text-xs">
                  Older Messages
                </h1>
              </div>
            ) : (
              <div>
                <div className=" z-50 fixed w-full h-full left-0 right-0 bottom-0 top-0  ml-auto mr-auto flex justify-center items-center bg-gray-400/50">
                  <h1 className="text-gray-50 text-center text-lg font-bold">
                    Loading...
                  </h1>
                </div>
              </div>
            )}
            {msg.map((m, index) =>
              token && m.uId == token.id ? (
                <div
                  ref={messagesEndRef}
                  className=" relative col-start-1 col-end-4    text-white bg-emerald-700 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
                  key={index}
                >
                  {m.url && m.url.includes('mp4') && m.url.includes('video') ? (
                    <video width="320" height="240" muted controls>
                      <source src={m.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : m.url && m.url.includes('audio') ? (
                    <audio controls className=" w-44">
                      <source src={m.url} type="audio/ogg" />
                    </audio>
                  ) : (
                    <div className=" rounded-md mt-1 mb-1 ">
                      <img loading="lazy" src={m.url} alt="" />
                    </div>
                  )}
                  {m.chat &&
                  m.chat.includes('mp4') &&
                  m.chat.includes('video') ? (
                    <video width="320" height="240" muted controls>
                      <source src={m.chat} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
                  )}

                  {/* <p className=" absolute bottom-0 text-[10px] text-gray-300 right-1">
                    {format(new Date(m.createdAt), 'PPp')}
                  </p> */}
                </div>
              ) : (
                <div className="col-start-1 col-end-4" key={index}>
                  <div
                    className=" ml-1 relative float-left text-white  bg-gray-800 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-full  break-words shadow-md"
                    ref={messagesEndRef}
                  >
                    {m.url &&
                    m.url.includes('mp4') &&
                    m.url.includes('video') ? (
                      <video width="320" height="240" muted controls>
                        <source src={m.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : m.url && m.url.includes('audio') ? (
                      <audio controls className=" w-44">
                        <source src={m.url} type="audio/ogg" />
                      </audio>
                    ) : (
                      <div className=" rounded-md mt-1 mb-1 ">
                        <img loading="lazy" src={m.url} alt="" />
                      </div>
                    )}

                    {m.chat &&
                    m.chat.includes('mp4') &&
                    m.chat.includes('video') ? (
                      <video width="320" height="240" muted controls>
                        <source src={m.chat} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
                    )}
                    {/* <p className=" relative bottom-0 text-[10px] text-gray-300 right-1">
                      {format(new Date(m.createdAt), 'PPp')}
                    </p> */}
                  </div>
                </div>
              ),
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
          className=" relative mb-3 text-center max-w-[600px] m-auto mt-5"
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
                  <div className="backdrop-blur-md shadow-lg transition-opacity duration-500 flex  justify-between w-24 p-1 rounded-md absolute bottom-11 -left-2 z-50">
                    <div className="cursor-pointer w-10 h-10 rounded-full flex justify-center items-center">
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
                      <div className="text-gray-50 p-2 cursor-pointer   w-10 h-10 rounded-full left-7 top-1.5">
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
                  className=" w-9 h-9 border-[1px] border-gray-500 rounded-md text-white"
                >
                  <ion-icon name="document-outline"></ion-icon>
                </button>
              </div>
            ) : (
              <div className=" rounded-full absolute left-7 top-1.5">
                <button
                  type="button"
                  disabled
                  className=" absolute w-9 h-9 bg-gradient-to-r rounded-full text-white"
                >
                  <ion-icon name="document-outline"></ion-icon>
                </button>
              </div>
            )}

            {(siteStatus && siteStatus.chatInput) || (token && token.admin) ? (
              <input
                className=" bg-gray-700 text-white outline-none w-full py-3 pl-[70px] pr-16 p-10 shadow-sm rounded-sm "
                type="text"
                name="chatField"
                onChange={(e) => handleChat(e)}
                placeholder="Message..."
                autoComplete="off"
              />
            ) : (
              <input
                className=" bg-gray-800 text-white outline-none w-full py-3 pl-[70px] pr-16 p-10 rounded-3xl"
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
              className="  h-9 w-9 p-2 text-gray-300 absolute right-[30px] top-[6px] hover:text-gray-400"
            >
              <ion-icon name="send"></ion-icon>
            </button>
          </div>
        </form>
      ) : null}
      <Routes>
        <Route
          path="transcript"
          element={<TranscriptChat socket={props.socket} />}
        />

        <Route path="logs" element={<Logs socket={props.socket} />} />
        <Route path="search" element={<Search socket={props.socket} />} />
        <Route
          path="callinprogress"
          element={<Call peer={props.peer} socket={props.socket} />}
        />
        <Route
          path="/admin/*"
          element={
            JSON.parse(localStorage.getItem('user')).admin ? (
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
