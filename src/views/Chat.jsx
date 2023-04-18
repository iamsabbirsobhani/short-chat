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
    // messagesEndRef.current?.scrollIntoView();
    messagesEndRef.current?.scrollTo(0, messagesEndRef.current.scrollHeight);
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
  useEffect(() => {
    scrollToBottom();
  });

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
        <ChatConroller
          msg={msg}
          handleOlderMessage={handleOlderMessage}
          olderMsgLoading={olderMsgLoading}
          token={token}
          messagesEndRef={messagesEndRef}
          handleSelfChatInfo={handleSelfChatInfo}
          handleOtherChatInfo={handleOtherChatInfo}
        />
      </div>
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
        scrollToBottom={scrollToBottom}
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
