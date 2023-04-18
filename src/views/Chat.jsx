import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/chat.scss';
import _debounce from 'lodash/debounce';
import Caller from '../components/Caller';
import { useSelector, useDispatch } from 'react-redux';
import Receiver from '../components/Receiver';
import Navbar from '../components/Navbar';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  openCallerScreenOn,
  openCallerScreenOff,
  receiverUIFnOn,
  receiverUIFnOff,
  setPeerId,
  callTimerOff,
  setMsg,
  setTotalOnlineUsers,
  setOpenChatInfo,
  setChatInfo,
  setDelLoading,
} from '../features/state/globalState';

import { fileUpload } from '../composable/fileUpload';
import Progress from '../components/Progress';
import { Route, Routes } from 'react-router-dom';
import TranscriptChat from './TranscriptChat';

import Logs from '../components/Logs';
import Admin from './Admin';
import Call from './Call';
import Search from '../components/Search';
import React from 'react';
import ChatInfo from '../components/chat/ChatInfo';
import ChatConroller from '../components/chat/ChatController';
import ChatTypingForm from '../components/chat/ChatTypingForm';

export default function Chat(props) {
  let navigate = useNavigate();

  const offlineTextInput = useRef();

  const openCalling = useSelector((state) => state.global.openCalling);

  const msg = useSelector((state) => state.global.msg);

  const receiverUI = useSelector((state) => state.global.receiverUI);
  const token = useSelector((state) => state.global.token);

  const siteStatus = useSelector((state) => state.global.siteStatus);

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
    //  scroll to bottom no smotth scroll without scrollIntoView
    messagesEndRef.current.scrollIntoView();
  };

  const handleUpload = async (e) => {
    // console.log(e.target.files[0].type);
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
      // console.log('uploaded');
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
        email: token?.email,
        url: url,
        deletedMsg: '',
        createdAt: new Date(),
      };
    } else if (chat) {
      msg = {
        id: token.id,
        name: token.name,
        uId: token.id,
        email: token?.email,
        chat: chat,
        deletedMsg: '',
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

  // task: try to fix scroll to bottom
  // useEffect(() => {
  //   scrollToBottom();
  // });

  useEffect(() => {
    props.socket.on('is-there-only-users', (data) => {
      // console.log(data);
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

    props.socket.on('incoming-call', (caller) => {
      if (caller.id !== props.socket.id) {
        dispatch(receiverUIFnOn());
      }
    });

    props.socket.on('close-call', (id) => {
      // console.log('call fire', id === props.socket.id);
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
      // console.log('offline-text-sent-successfully', docId);
      if (offlineTextInput && offlineTextInput.current) {
        offlineTextInput.current.form[0].value = '';
      }
      if (docId && docId.status) {
        setofflinestatus(docId.status);
        timeout = setTimeout(() => {
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
      // console.log(data);
      dispatch(setMsg(data));
      setolderMsgLoading(false);
      dispatch(setDelLoading(false));
      dispatch(setOpenChatInfo(false));
    });
  });

  useEffect(() => {
    props.socket.emit('getscchat', 60);
  }, []);

  useEffect(() => {
    const stopScrol = setInterval(() => {
      scrollToBottom();
    }, 100);

    setTimeout(() => {
      clearInterval(stopScrol);
    }, 700);
  }, [msg]);

  const openChatInfo = useSelector((state) => state.global.openChatInfo);

  const handleSelfChatInfo = (m) => {
    dispatch(setOpenChatInfo(true));
    dispatch(setChatInfo(m));
    // console.log(m);
  };

  const handleOtherChatInfo = (m) => {
    dispatch(setOpenChatInfo(true));
    dispatch(setChatInfo(m));
    // console.log(m);
  };

  // handle blur self
  const [isBlurSelf, setisBlurSelf] = useState({ isBlur: true, id: '' });
  const [isLoadedSelf, setisLoadedSelf] = useState(false);
  const handleImgOnLoadSelf = () => {
    console.log('Image Loaded!');
    setisLoadedSelf(true);
  };

  const handleBlurImageSelf = (id) => {
    setisBlurSelf({ isBlur: !isBlurSelf.isBlur, id: id });
    // console.log(id);
  };

  // after 30 seconds, the image will be blurred
  useEffect(() => {
    const timer = setTimeout(() => {
      setisBlurSelf({ isBlur: true, id: '' });
    }, 10000);
    return () => clearTimeout(timer);
  });
  // handle blur Other
  const [isBlurOther, setisBlurOther] = useState({ isBlur: true, id: '' });
  const [isLoadedOther, setisLoadedOther] = useState(false);
  const handleImgOnLoadOther = () => {
    // console.log('Image Loaded!');
    setisLoadedOther(true);
  };

  const handleBlurImageOther = (id) => {
    setisBlurOther({ isBlur: !isBlurOther.isBlur, id: id });
  };

  // after 30 seconds, the image will be blurred
  useEffect(() => {
    const timer = setTimeout(() => {
      setisBlurOther({ isBlur: true, id: '' });
    }, 10000);
    return () => clearTimeout(timer);
  });
  return (
    <>
      <Navbar callSend={callSend} socket={props.socket} />
      <Progress uploading={uploading} />
      {openChatInfo ? (
        <div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-gray-800/80 z-50">
          <ChatInfo props={props} />
        </div>
      ) : null}
      <div className="scroll-style xl:w-[600px] lg:w[500px] md:[350px] h-[70.5vh] overflow-y-scroll m-auto">
        <div>
          {openCalling && <Caller closeCall={closeCall} />}
          {receiverUI && (
            <Receiver callReceive={callReceive} callEnd={callEnd} />
          )}
        </div>

        {/* all Chats component */}
        {/* <ChatConroller
          msg={msg}
          handleOlderMessage={handleOlderMessage}
          olderMsgLoading={olderMsgLoading}
          token={token}
          messagesEndRef={messagesEndRef}
          handleSelfChatInfo={handleSelfChatInfo}
          handleOtherChatInfo={handleOtherChatInfo}
        /> */}

        {/* total chat parts */}
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
                m && m.deletedMsg ? (
                  m.chat ? (
                    <div
                      onClick={() => handleSelfChatInfo(m)}
                      ref={messagesEndRef}
                      className=" cursor-pointer relative col-start-1 col-end-4    text-gray-300 border-gray-300  border-2 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
                      key={index}
                    >
                      <h1 className=" mt-1 mb-1 first-letter:uppercase italic font-medium">
                        {m.chat}
                      </h1>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleSelfChatInfo(m)}
                      ref={messagesEndRef}
                      className=" cursor-pointer relative col-start-1 col-end-4    text-gray-300 border-gray-300  border-2 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
                      key={index}
                    >
                      <h1 className=" mt-1 mb-1 first-letter:uppercase italic font-medium">
                        Image/Video/Audio has been unsent.
                      </h1>
                    </div>
                  )
                ) : m && m.url ? (
                  <div
                    ref={messagesEndRef}
                    className=" flex flex-row-reverse items-center col-start-1 col-end-4"
                    key={index}
                  >
                    <div className="cursor-pointer relative     text-white bg-emerald-700 p-3 rounded-lg xl:max-w-full lg:max-w-full md:max-w-[400px] max-w-[300px] break-words shadow-md ml-auto mr-1">
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
                      ) : m.url && m.url.includes('images') ? (
                        <div className=" rounded-md mt-1 mb-1 relative">
                          {!isLoadedSelf ? (
                            <div className=" w-72 h-60"></div>
                          ) : null}
                          <img
                            className=""
                            loading="lazy"
                            src={m.url}
                            alt=""
                            style={{
                              filter: isBlurSelf.isBlur
                                ? 'blur(20px)'
                                : isBlurSelf.id === m._id
                                ? 'blur(0px)'
                                : 'blur(20px)',
                              transition: 'all 0.24s',
                            }}
                            onLoad={handleImgOnLoadSelf}
                          />
                          {isLoadedSelf ? (
                            <div
                              style={{
                                visibility: isBlurSelf.isBlur
                                  ? 'visible'
                                  : isBlurSelf.id === m._id
                                  ? 'hidden'
                                  : 'visible',
                              }}
                              className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
                            >
                              <button
                                onClick={() => handleBlurImageSelf(m._id)}
                                className=" border-2 rounded-full text-yellow-500 p-2 border-yellow-500 italic hover:text-yellow-600 hover:border-yellow-600 duration-300 shadow-md backdrop-blur-lg font-bold"
                              >
                                Tap to see clear
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div
                      onClick={() => handleSelfChatInfo(m)}
                      className=" ml-4 cursor-pointer text-gray-50 mr-4"
                    >
                      <ion-icon name="ellipsis-horizontal"></ion-icon>
                    </div>
                  </div>
                ) : m && m.chat ? (
                  <div
                    onClick={() => handleSelfChatInfo(m)}
                    ref={messagesEndRef}
                    className=" cursor-pointer relative col-start-1 col-end-4    text-white bg-emerald-700 p-3 rounded-lg xl:max-w-full lg:max-w-full md:max-w-[400px] max-w-[300px] break-words shadow-md ml-auto mr-1"
                    key={index}
                  >
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
                  </div>
                ) : null
              ) : m && m.deletedMsg ? (
                m.chat ? (
                  <div
                    onClick={() => handleOtherChatInfo(m)}
                    ref={messagesEndRef}
                    className=" cursor-pointer relative col-start-1 col-end-4    text-gray-300 border-gray-300  border-2 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md mr-auto ml-1 "
                    key={index}
                  >
                    <h1 className=" mt-1 mb-1 first-letter:uppercase italic font-medium">
                      {m.chat}
                    </h1>
                  </div>
                ) : (
                  <div
                    onClick={() => handleOtherChatInfo(m)}
                    ref={messagesEndRef}
                    className=" cursor-pointer relative col-start-1 col-end-4    text-gray-300 border-gray-300  border-2 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md mr-auto ml-1"
                    key={index}
                  >
                    <h1 className=" mt-1 mb-1 first-letter:uppercase italic font-medium">
                      Image/Video/Audio has been unsent.
                    </h1>
                  </div>
                )
              ) : m && m.url ? (
                <div
                  ref={messagesEndRef}
                  className=" flex  items-center col-start-1 col-end-4"
                  key={index}
                >
                  <div className=" cursor-pointer ml-1 mr-auto relative float-left text-white  bg-gray-800 p-3 rounded-lg xl:max-w-full lg:max-w-full md:max-w-[400px] max-w-[300px]  break-words shadow-md">
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
                    ) : m.url && m.url.includes('images') ? (
                      <div className="rounded-md mt-1 mb-1 relative">
                        {!isLoadedOther ? (
                          <div className=" w-72 h-60"></div>
                        ) : null}
                        <img
                          className=""
                          loading="lazy"
                          src={m.url}
                          alt=""
                          style={{
                            filter: isBlurOther.isBlur
                              ? 'blur(20px)'
                              : isBlurOther.id === m._id
                              ? 'blur(0px)'
                              : 'blur(20px)',
                            transition: 'all 0.24s',
                          }}
                          onLoad={handleImgOnLoadOther}
                        />
                        {isLoadedOther ? (
                          <div
                            style={{
                              visibility: isBlurOther.isBlur
                                ? 'visible'
                                : isBlurOther.id === m._id
                                ? 'hidden'
                                : 'visible',
                            }}
                            className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
                          >
                            <button
                              onClick={() => handleBlurImageOther(m._id)}
                              className=" border-2 rounded-full text-yellow-500 p-2 border-yellow-500 italic hover:text-yellow-600 hover:border-yellow-600 duration-300 shadow-md backdrop-blur-lg font-bold"
                            >
                              Tap to see clear
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div
                    onClick={() => handleOtherChatInfo(m)}
                    className=" ml-4 cursor-pointer text-gray-50 mr-4"
                  >
                    <ion-icon name="ellipsis-horizontal"></ion-icon>
                  </div>
                </div>
              ) : m && m.chat ? (
                <div
                  onClick={() => handleOtherChatInfo(m)}
                  className="col-start-1 col-end-4  cursor-pointer ml-1 mr-auto relative float-left text-white  bg-gray-800 p-3 rounded-lg xl:max-w-full lg:max-w-full md:max-w-[400px] max-w-[300px]  break-words shadow-md"
                  ref={messagesEndRef}
                  key={index}
                >
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
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <div className=" text-white text-2xl flex h-full w-full  justify-center items-center">
            Loading...
          </div>
        )}
      </div>
      {/* end of total chat parts */}

      {/* Chat typing form and indicator component */}
      <ChatTypingForm
        isTypings={isTypings}
        sendMsg={sendMsg}
        ismenu={ismenu}
        siteStatus={siteStatus}
        token={token}
        inputFile={inputFile}
        setismenu={setismenu}
        handleChat={handleChat}
        id={id}
        handleUpload={handleUpload}
      />
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
