import Chat from './views/Chat';

import {
  setName,
  setToken,
  setConnectedUsers,
  setSiteBlock,
  setSiteStatus,
  setDay,
  setLoggedUser,
  setAllUsers,
  setAnnounce,
  setHasAnnounce,
  setAllAnnounce,
  setVideoPermission,
  setIsVideoOnFromEvent,
  setAdminPermissions,
} from './features/state/globalState';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import axios from 'axios';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import Signin from './views/Signin';
import Signup from './views/Signup';
import ImageGallery from './views/ImageGallery';
import { messaging, getToken } from './firebase/config';
import BlockNotice from './components/BlockNotice';
import { API } from '../api.js';

function App(props) {
  const callTimer = useSelector((state) => state.global.callTimer);
  const isVideo = useSelector((state) => state.global.videoPermission);
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
        API + '/unlock/' + `${code.target[0].value}`,
      );
      const res = await response.data;

      setstate(res && res.lock);
      setIsWrong(res && res.lock);
      setIsLoading(false);
      if (res && 'error' in res) {
        setisError(res);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    async function verifyToken() {
      const token = JSON.parse(localStorage.getItem('user'));
      try {
        if (JSON.parse(localStorage.getItem('user'))) {
          const verify = await axios.get(
            API + '/verifyToken/' + token.accessToken,
          );
          if (verify.data === true) {
            dispatch(setToken(null));
            localStorage.setItem('user', JSON.stringify(null));
          } else {
            dispatch(setToken(JSON.parse(localStorage.getItem('user'))));
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
    props.socket.on('online', () => {
      if (JSON.parse(localStorage.getItem('user'))) {
        const data = {
          id: JSON.parse(localStorage.getItem('user')).id,
          name: JSON.parse(localStorage.getItem('user'))?.name,
          email: JSON.parse(localStorage.getItem('user'))?.email,
          online: true,
          socketId: props.socket.id,
        };
        props.socket.emit('update-to-online', data);
      }
    });
  });
  useEffect(() => {
    props.socket.on('video-on', (isOn) => {
      dispatch(setIsVideoOnFromEvent(isOn));
    });

    props.socket.on('reload', (isAdmin) => {
      if (!token?.admin) {
        window.location.reload();
      }
    });

    props.socket.on('online-status', (connectedUsers) => {
      dispatch(setConnectedUsers(connectedUsers));
    });

    props.socket.on('offline', (connectedUsers) => {
      dispatch(setConnectedUsers(connectedUsers));
    });

    props.socket.on('block-status', (auth) => {
      // console.log(auth.rows[0]);
      setblock(auth.rows[0].block);
      dispatch(setSiteBlock(auth.rows[0].block));
      dispatch(setSiteStatus(auth.rows[0]));
    });

    props.socket.on('day', (day) => {
      dispatch(setDay(day));
    });

    props.socket.on('get-current-user', (user) => {
      if (user?.id === JSON.parse(localStorage.getItem('user'))?.id) {
        dispatch(setLoggedUser(user));
      }
    });
    props.socket.on('get-all-users', (users) => {
      dispatch(setAllUsers(users));
    });

    props.socket.on('has-announce', (announce) => {
      // console.log("has-announce ", announce);
      dispatch(setHasAnnounce(announce));
    });

    props.socket.on('send-announce', (announce) => {
      // console.log("send-announce ", announce);
      dispatch(setAnnounce(announce));
    });

    props.socket.on('get-all-announce', (announce) => {
      // console.log("get-all-announce ", announce);
      dispatch(setAllAnnounce(announce));
    });
  });
  // online-offline status code

  useEffect(() => {
    return () => {
      props.socket.emit(
        'userlog-out',
        new Date(),
        JSON.parse(localStorage.getItem('user'))?.id,
      );
    };
  }, []);

  // all the admin permissions events
  useEffect(() => {
    props.socket.on('get-admin-permissions', (data) => {
      dispatch(setAdminPermissions(data));
      console.log(data);
    });
  });

  useEffect(() => {
    props.socket.emit('inquiry-admin-permissions');
  }, []);
  // end of all the admin permissions events

  // fcm
  useEffect(() => {
    props.socket.emit('send-day');
    props.socket.emit('get-all-users');
    props.socket.emit('block-site-status');
    props.socket.emit(
      'userlog-log',
      new Date(),
      JSON.parse(localStorage.getItem('user'))?.id,
    );
    props.socket.emit(
      'get-logged-user',
      JSON.parse(localStorage.getItem('user'))?.id,
    );

    props.socket.emit('has-announce');
    props.socket.emit('get-announce');
    props.socket.emit('get-all-announce');

    let data = JSON.parse(localStorage.getItem('user'));
    getToken(messaging, {
      vapidKey:
        'BK5U3OatUDnGtiYBeLQ3IoB4wNE1mbsCfS30x8SJlwgXZOg4BJGvFGfjio8AdQNKg9u8xC5o_61dsw2pUyY2SCo',
    })
      .then((currentToken) => {
        if (currentToken) {
          data.token = currentToken;
          props.socket.emit('save-fcm-token', data);
        } else {
          console.log(
            'No registration token available. Request permission to generate one.',
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }, []);
  // fcm

  return (
    <div className="App">
      {isVideo ? (
        (token && token.admin) || block ? (
          <>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/signin"
                  element={
                    JSON.parse(localStorage.getItem('user')) === null ? (
                      <Signin />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/signup"
                  element={
                    JSON.parse(localStorage.getItem('user')) === null ? (
                      <Signup />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />

                <Route
                  path="/*"
                  element={
                    JSON.parse(localStorage.getItem('user')) ? (
                      <Chat
                        className=" h-80"
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
        )
      ) : (
        <div className=" border-dashed border-2 p-2 m-5">
          <div className=" text-white">
            <p className=" text-lg font-semibold">To remove this page: </p>
            <h1>
              1. Delete all the{' '}
              <span className=" text-yellow-400"> cookies </span> or{' '}
              <span className=" text-yellow-400"> Reset permissions</span> from
              website lock &nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline border-[1px] p-[1px] rounded-full "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>{' '}
              &nbsp; icon.
            </h1>
            <h1>2. Allow permission to all that wanted.</h1>
            <h1>3. Reload the site.</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
