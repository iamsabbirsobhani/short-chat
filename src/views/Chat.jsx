import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/chat.scss';
import _debounce from 'lodash/debounce';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TypingIndicator from '../components/TypingIndicator';
import MobileNavbar from '../components/MobileNavbar';

import {
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
import Search from '../components/Search';
import React from 'react';
import ChatInfo from '../components/chat/ChatInfo';
import ChatTypingForm from '../components/chat/ChatTypingForm';
import CustomVideoPlayer from '../components/CustomVideoPlayer';

export default function Chat(props) {
  let navigate = useNavigate();

  const offlineTextInput = useRef();

  const msg = useSelector((state) => state.global.msg);
  const token = useSelector((state) => state.global.token);
  const connectedUsers = useSelector((state) => state.global.connectedUsers);
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
  const messagesContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);

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
        createdAt: Date.now(),
      };
    } else if (chat) {
      msg = {
        id: token.id,
        name: token.name,
        uId: token.id,
        email: token?.email,
        chat: chat,
        deletedMsg: '',
        createdAt: Date.now(),
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
  });

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
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const handleOlderMessage = () => {
    // Disable auto-scroll and save current position
    setShouldAutoScroll(false);
    if (messagesContainerRef.current && msg.length > 0) {
      const currentScrollTop = messagesContainerRef.current.scrollTop;
      const currentScrollHeight = messagesContainerRef.current.scrollHeight;

      // Store the relative position (percentage from top)
      const scrollPercentage =
        currentScrollTop /
        (currentScrollHeight - messagesContainerRef.current.clientHeight);
      localStorage.setItem('chatScrollPosition', scrollPercentage.toString());
    }

    setolderMsgLoading(true);
    setIsLoadingOlder(true);
    props.socket.emit('getscchat', msg.length + 60);
  };

  useEffect(() => {
    props.socket.on('getscchatevent', (data) => {
      // console.log(data);
      const oldMessageCount = msg.length;
      dispatch(setMsg(data));
      setolderMsgLoading(false);
      setIsLoadingOlder(false);
      dispatch(setDelLoading(false));
      dispatch(setOpenChatInfo(false));

      // Restore scroll position after older messages are loaded
      if (messagesContainerRef.current && data.length > oldMessageCount) {
        setTimeout(() => {
          const savedPercentage = localStorage.getItem('chatScrollPosition');
          if (savedPercentage) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            const newScrollTop =
              parseFloat(savedPercentage) *
              (newScrollHeight - messagesContainerRef.current.clientHeight);
            messagesContainerRef.current.scrollTop = newScrollTop;
            localStorage.removeItem('chatScrollPosition');
          }
          // Re-enable auto-scroll for new messages
          setShouldAutoScroll(true);
        }, 100);
      }
    });
  });

  useEffect(() => {
    props.socket.emit('getscchat', 60);
  }, []);

  // Only scroll to bottom for new messages when auto-scroll is enabled
  useEffect(() => {
    if (shouldAutoScroll && !isLoadingOlder) {
      const stopScrol = setInterval(() => {
        scrollToBottom();
      }, 100);

      setTimeout(() => {
        clearInterval(stopScrol);
      }, 700);
    }
  }, [msg, shouldAutoScroll, isLoadingOlder]);

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

  // Check if there are other users online (excluding current user)
  const otherUsersOnline =
    connectedUsers &&
    connectedUsers.some((user) => user.id !== token?.id && user.online);

  // Get online user names (excluding current user)
  const onlineUserNames = connectedUsers
    ? connectedUsers
        .filter((user) => user.id !== token?.id && user.online)
        .map((user) => user.name || user.username || 'Unknown User')
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <MobileNavbar socket={props.socket} />
      <Progress uploading={uploading} />

      {/* Chat Info Modal */}
      {openChatInfo ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50">
          <ChatInfo props={props} />
        </div>
      ) : null}

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6 pt-16 sm:pt-24 min-h-screen">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 sm:p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ion-icon
                    name="chatbubbles"
                    className="text-lg sm:text-xl"
                  ></ion-icon>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold truncate">
                    Live Chat
                  </h1>
                  <p className="text-sm sm:text-sm text-white/80 truncate">
                    Real-time messaging
                  </p>
                </div>
              </div>
              {otherUsersOnline && (
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-right">
                    <span className="text-sm font-medium">Online</span>
                    {onlineUserNames.length > 0 && (
                      <div className="text-xs text-white/80 truncate max-w-20 sm:max-w-32">
                        {onlineUserNames.length === 1
                          ? onlineUserNames[0]
                          : onlineUserNames.length === 2
                          ? `${onlineUserNames[0]} & ${onlineUserNames[1]}`
                          : `${onlineUserNames[0]} +${
                              onlineUserNames.length - 1
                            } others`}
                      </div>
                    )}
                  </div>

                  {/* Online Users Tooltip */}
                  {onlineUserNames.length > 1 && (
                    <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-48">
                      <div className="text-xs text-white/60 mb-2 font-medium">
                        Online Users:
                      </div>
                      <div className="space-y-1">
                        {onlineUserNames.map((name, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-white">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="flex-1 overflow-y-auto scroll-smooth bg-gradient-to-b from-gray-50/5 to-gray-50/10"
            ref={messagesContainerRef}
          >
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              {/* Messages */}
              {msg.length ? (
                <div className="space-y-3 sm:space-y-4">
                  {/* Load More Button */}
                  {!olderMsgLoading ? (
                    <div className="flex justify-center">
                      <button
                        onClick={handleOlderMessage}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Load Older Messages
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="flex items-center space-x-2 text-white/70">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs sm:text-sm">Loading...</span>
                      </div>
                    </div>
                  )}
                  {/* Message List */}
                  {msg.map((m, index) =>
                    token && m.uId == token.id ? (
                      // Self Messages
                      m && m.deletedMsg ? (
                        m.chat ? (
                          <div
                            onClick={() => handleSelfChatInfo(m)}
                            ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                            className="flex justify-end cursor-pointer"
                            key={index}
                          >
                            <div className="bg-gray-400/30 border border-gray-400/50 text-gray-300 max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-br-md shadow-lg backdrop-blur-sm">
                              <p className="italic font-medium text-base sm:text-base">
                                {m.chat}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleSelfChatInfo(m)}
                            ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                            className="flex justify-end cursor-pointer"
                            key={index}
                          >
                            <div className="bg-gray-400/30 border border-gray-400/50 text-gray-300 max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-br-md shadow-lg backdrop-blur-sm">
                              <p className="italic font-medium text-sm sm:text-sm">
                                Image/Video/Audio has been unsent.
                              </p>
                            </div>
                          </div>
                        )
                      ) : m && m.url ? (
                        // Self Media Messages
                        <div
                          ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                          className="flex justify-end items-end space-x-1 sm:space-x-2"
                          key={index}
                        >
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-br-md shadow-lg">
                            {m.url &&
                            m.url.includes('mp4') &&
                            m.url.includes('video') ? (
                              <CustomVideoPlayer
                                src={m.url}
                                className="w-full"
                              />
                            ) : m.url && m.url.includes('audio') ? (
                              <audio controls className="w-full sm:w-44">
                                <source src={m.url} type="audio/ogg" />
                              </audio>
                            ) : m.url && m.url.includes('images') ? (
                              <div className="relative">
                                {!isLoadedSelf && (
                                  <div className="w-full h-32 sm:h-48 sm:w-72 sm:h-60 bg-gray-200/20 rounded-lg animate-pulse"></div>
                                )}
                                <img
                                  className="rounded-lg max-w-full w-full"
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
                                {isLoadedSelf && (
                                  <div
                                    style={{
                                      visibility: isBlurSelf.isBlur
                                        ? 'visible'
                                        : isBlurSelf.id === m._id
                                        ? 'hidden'
                                        : 'visible',
                                    }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <button
                                      onClick={() => handleBlurImageSelf(m._id)}
                                      className="bg-yellow-500/90 hover:bg-yellow-600/90 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm"
                                    >
                                      Tap to see clear
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                          <button
                            onClick={() => handleSelfChatInfo(m)}
                            className="text-white/70 hover:text-white transition-colors duration-200"
                          >
                            <ion-icon name="ellipsis-horizontal"></ion-icon>
                          </button>
                        </div>
                      ) : m && m.chat ? (
                        // Self Text Messages
                        <div
                          onClick={() => handleSelfChatInfo(m)}
                          ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                          className="flex justify-end cursor-pointer"
                          key={index}
                        >
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-br-md shadow-lg">
                            {m.chat &&
                            m.chat.includes('mp4') &&
                            m.chat.includes('video') ? (
                              <CustomVideoPlayer
                                src={m.chat}
                                className="w-full"
                              />
                            ) : (
                              <p className="break-words text-base sm:text-base">
                                {m.chat}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null
                    ) : // Other Messages
                    m && m.deletedMsg ? (
                      m.chat ? (
                        <div
                          onClick={() => handleOtherChatInfo(m)}
                          ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                          className="flex justify-start cursor-pointer"
                          key={index}
                        >
                          <div className="bg-gray-400/30 border border-gray-400/50 text-gray-300 max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm">
                            <p className="italic font-medium text-base sm:text-base">
                              {m.chat}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleOtherChatInfo(m)}
                          ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                          className="flex justify-start cursor-pointer"
                          key={index}
                        >
                          <div className="bg-gray-400/30 border border-gray-400/50 text-gray-300 max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm">
                            <p className="italic font-medium text-sm sm:text-sm">
                              Image/Video/Audio has been unsent.
                            </p>
                          </div>
                        </div>
                      )
                    ) : m && m.url ? (
                      // Other Media Messages
                      <div
                        ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                        className="flex justify-start items-end space-x-1 sm:space-x-2"
                        key={index}
                      >
                        <button
                          onClick={() => handleOtherChatInfo(m)}
                          className="text-white/70 hover:text-white transition-colors duration-200"
                        >
                          <ion-icon name="ellipsis-horizontal"></ion-icon>
                        </button>
                        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-bl-md shadow-lg">
                          {m.url &&
                          m.url.includes('mp4') &&
                          m.url.includes('video') ? (
                            <CustomVideoPlayer
                              src={m.url}
                              poster={m.url}
                              options={{
                                controls: true,
                                autoplay: false,
                                loop: false,
                                volume: 1,
                                muted: false,
                                quality: {
                                  default: 1080,
                                  options: [
                                    {
                                      url: m.url,
                                      width: 1920,
                                      height: 1080,
                                      bitrate: 10000,
                                    },
                                    {
                                      url: m.url,
                                      width: 1280,
                                      height: 720,
                                      bitrate: 5000,
                                    },
                                    {
                                      url: m.url,
                                      width: 640,
                                      height: 360,
                                      bitrate: 2000,
                                    },
                                  ],
                                },
                              }}
                            />
                          ) : m.url && m.url.includes('audio') ? (
                            <audio controls className="w-full sm:w-44">
                              <source src={m.url} type="audio/ogg" />
                            </audio>
                          ) : m.url && m.url.includes('images') ? (
                            <div className="relative">
                              {!isLoadedOther && (
                                <div className="w-full h-32 sm:h-48 sm:w-72 sm:h-60 bg-gray-200/20 rounded-lg animate-pulse"></div>
                              )}
                              <img
                                className="rounded-lg max-w-full w-full"
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
                              {isLoadedOther && (
                                <div
                                  style={{
                                    visibility: isBlurOther.isBlur
                                      ? 'visible'
                                      : isBlurOther.id === m._id
                                      ? 'hidden'
                                      : 'visible',
                                  }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <button
                                    onClick={() => handleBlurImageOther(m._id)}
                                    className="bg-yellow-500/90 hover:bg-yellow-600/90 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm"
                                  >
                                    Tap to see clear
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : m && m.chat && m.name ? (
                      // Other Text Messages
                      <div
                        onClick={() => handleOtherChatInfo(m)}
                        className="flex justify-start cursor-pointer"
                        ref={index === 0 ? scrollAnchorRef : messagesEndRef}
                        key={index}
                      >
                        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white max-w-[85vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl rounded-bl-md shadow-lg">
                          {m.chat &&
                          m.chat.includes('mp4') &&
                          m.chat.includes('video') ? (
                            <CustomVideoPlayer
                              src={m.chat}
                              poster={m.chat}
                              options={{
                                controls: true,
                                autoplay: false,
                                loop: false,
                                volume: 1,
                                muted: false,
                                quality: {
                                  default: 1080,
                                  options: [
                                    {
                                      url: m.chat,
                                      width: 1920,
                                      height: 1080,
                                      bitrate: 10000,
                                    },
                                    {
                                      url: m.chat,
                                      width: 1280,
                                      height: 720,
                                      bitrate: 5000,
                                    },
                                    {
                                      url: m.chat,
                                      width: 640,
                                      height: 360,
                                      bitrate: 2000,
                                    },
                                  ],
                                },
                              }}
                            />
                          ) : (
                            <p className="break-words text-base sm:text-base">
                              {m.chat}
                            </p>
                          )}
                          <p className="text-sm text-gray-300 mt-1">{m.name}</p>
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/70">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-base sm:text-lg">Loading messages...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input Form */}
          <div className="p-2 sm:p-4 bg-white/5 backdrop-blur-sm border-t border-white/10 relative flex-shrink-0">
            {/* Typing Indicator - Only show for others typing */}
            {isTypings && isTypings.isTyping && isTypings.id !== id ? (
              <TypingIndicator />
            ) : null}

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
          </div>
        </div>
      </div>

      <Routes>
        <Route
          path="transcript"
          element={<TranscriptChat socket={props.socket} />}
        />

        <Route path="logs" element={<Logs socket={props.socket} />} />
        <Route path="search" element={<Search socket={props.socket} />} />
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
    </div>
  );
}
