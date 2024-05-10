import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setPage } from '../features/state/globalState';
import { useEffect, useState } from 'react';

export default function Drawer({ drawerToggle, socket }) {
  const token = useSelector((state) => state.global.token);
  const permit = useSelector((state) => state.global.adminPermissions);
  const [ischangePasswordOpen, setischangePasswordOpen] = useState(false);
  const [ischangePasswordMsg, setischangePasswordMsg] = useState('');
  const [isinputMsgMaxLengthOpen, setisinputMsgMaxLengthOpen] = useState(false);
  const [isinputMsgMaxLengthMsg, setisinputMsgMaxLengthMsg] = useState('');

  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('change-startup-password', (data) => {
      if (data && data.status === true) {
        setischangePasswordMsg('Password Changed!');
      } else {
        setischangePasswordOpen(true);
        setischangePasswordMsg('Try Again!');
      }
    });

    socket.on('get-admin-permissions', (data) => {
      if (data) {
        setisinputMsgMaxLengthMsg('Input Message Max Length Changed!');
      } else {
        setisinputMsgMaxLengthOpen(true);
        setisinputMsgMaxLengthMsg('Try Again!');
      }
    });
  });

  return (
    <>
      <div
        onClick={drawerToggle}
        className="background w-full h-full backdrop-blur-sm z-[80] fixed left-0 right-0 top-0 bottom-0 "
      ></div>
      <div className="overflow-y-scroll drawer p-2 w-[220px] h-full  bg-gradient-to-r from-gray-600/50 to-gray-700/50 z-[100] fixed top-0 left-0 ">
        <div className=" flex items-center justify-end mt-2 mb-2 mr-2">
          <div
            onClick={drawerToggle}
            className=" shadow-md  cursor-pointer rounded-sm close-button font-bold w-7 h-7 flex justify-center items-center  bg-gray-700/80 text-white text-right text-xl "
          >
            <ion-icon name="close" className=""></ion-icon>
          </div>
        </div>

        <div className=" text-white text-center mt-2 mb-2 font-bold text-xl">
          <h1>{token.name.toUpperCase()}</h1>
        </div>
        <div className="menu mt-3 ml-3  ">
          <div className=" mt-2 ">
            <button
              onClick={() => {
                dispatch(setPage(8));
                navigate('/');
                drawerToggle();
              }}
              className=" text-white border-[1px] border-gray-500  p-2 rounded-sm shadow-md w-full  duration-300"
            >
              <div className="  flex justify-center items-center text-2xl">
                <ion-icon name="chatbox-ellipses"></ion-icon>
              </div>
            </button>
          </div>

          {/* {token && token.admin === true ? ( */}
          <div className=" mt-2">
            <button
              onClick={() => {
                navigate('logs');
                drawerToggle();
              }}
              className=" text-white border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
            >
              User Logs
            </button>
          </div>
          {/* ) : null} */}

          {token && token.admin === true ? (
            <div className=" mt-2">
              <button
                onClick={() => {
                  navigate('images');
                  drawerToggle();
                }}
                className=" text-white border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
              >
                Image Gallery
              </button>
            </div>
          ) : null}

          {token && token.admin === true ? (
            permit && permit.fileInput ? (
              <div className=" mt-2">
                <button
                  onClick={() => {
                    socket.emit('set-admin-permissions', 'fileInput', false);
                    // drawerToggle();
                  }}
                  className=" text-red-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
                >
                  File Off
                </button>
              </div>
            ) : (
              <div className=" mt-2">
                <button
                  onClick={() => {
                    socket.emit('set-admin-permissions', 'fileInput', true);
                    // drawerToggle();
                  }}
                  className=" text-green-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
                >
                  File On?
                </button>
              </div>
            )
          ) : null}

          {token && token.admin === true ? (
            permit && permit.online ? (
              <div className=" mt-2">
                <button
                  onClick={() => {
                    socket.emit('set-admin-permissions', 'online', false);
                    // drawerToggle();
                  }}
                  className=" text-red-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
                >
                  Online Off
                </button>
              </div>
            ) : (
              <div className=" mt-2">
                <button
                  onClick={() => {
                    socket.emit('set-admin-permissions', 'online', true);
                    // drawerToggle();
                  }}
                  className=" text-green-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
                >
                  Online On?
                </button>
              </div>
            )
          ) : null}

          {token && token.admin === true ? (
            permit && permit.chatInput ? (
              <div className=" mt-2">
                <button
                  onClick={() => {
                    socket.emit('set-admin-permissions', 'chatInput', false);
                    // drawerToggle();
                  }}
                  className=" text-red-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
                >
                  Chat Input Off
                </button>
              </div>
            ) : (
              <div className=" mt-2">
                <button
                  onClick={() => {
                    socket.emit('set-admin-permissions', 'chatInput', true);
                    // drawerToggle();
                  }}
                  className=" text-green-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
                >
                  Chat Input On?
                </button>
              </div>
            )
          ) : null}

          {/* password change */}
          {token && token.admin === true ? (
            <div className=" mt-3">
              <button
                onClick={() => {
                  setischangePasswordOpen(true);
                  // drawerToggle();
                }}
                className=" text-red-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
              >
                Change Password
              </button>
            </div>
          ) : null}

          {ischangePasswordOpen ? (
            <div className=" border p-1 rounded-md mt-3 w-[100%] border-gray-500">
              <div className=" ml-auto mr-0 w-fit">
                <button
                  onClick={() => {
                    setischangePasswordOpen(false);
                  }}
                  className=" p-2 bg-red-500 rounded-md text-white mt-3"
                >
                  Close
                </button>
              </div>
              <form
                className=" mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setischangePasswordMsg('Changing...');
                  // console.log(e.target[0].value);
                  socket.emit('change-startup-password', e.target[0].value);
                }}
              >
                <input
                  type="text"
                  className="p-2 w-full"
                  placeholder="Password"
                  required
                />
                <p className=" text-red-500 mt-3">{ischangePasswordMsg}</p>
                <button
                  className=" p-2 bg-blue-500 rounded-md text-white mt-3 w-full"
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            </div>
          ) : null}

          {/* end of password change */}

          {/* input msg max length change */}
          {token && token.admin === true ? (
            <div className=" mt-3">
              <button
                onClick={() => {
                  setisinputMsgMaxLengthOpen(true);
                  // drawerToggle();
                }}
                className=" text-red-500 border-[1px] border-gray-500 p-2 rounded-sm shadow-md w-full uppercase font-semibold tracking-wider  duration-500"
              >
                Change Message Max Length
              </button>
            </div>
          ) : null}

          {isinputMsgMaxLengthOpen ? (
            <div className=" border p-1 rounded-md mt-3 w-[100%] border-gray-500">
              <div className=" ml-auto mr-0 w-fit">
                <button
                  onClick={() => {
                    setisinputMsgMaxLengthOpen(false);
                  }}
                  className=" p-2 bg-red-500 rounded-md text-white mt-3"
                >
                  Close
                </button>
              </div>
              <form
                className=" mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setisinputMsgMaxLengthMsg('Changing...');
                  // console.log(e.target[0].value);
                  socket.emit(
                    'set-admin-permissions',
                    'inputMaxLength',
                    e.target[0].value,
                  );
                }}
              >
                <input
                  type="text"
                  className="p-2 w-full"
                  placeholder="Input Message Max Length"
                  required
                />
                <p className=" text-red-500 mt-3">{isinputMsgMaxLengthMsg}</p>
                <button
                  className=" p-2 bg-blue-500 rounded-md text-white mt-3 w-full"
                  type="submit"
                >
                  Change Limit
                </button>
              </form>
            </div>
          ) : null}

          {/* end of input msg max length change */}

          <div className="logout mt-4 text-center relative -bottom-32">
            <button
              onClick={() => {
                dispatch(setPage(8));
                drawerToggle();
                dispatch(setToken(null));
                localStorage.setItem('user', JSON.stringify(null));
                navigate('signin');
              }}
              className="font-bold border-2 border-gray-500 text-red-500  p-2 rounded-sm shadow-md"
            >
              Logout
            </button>

            <div className="mt-10 text-gray-500">
              <h1>Copyright &copy; {new Date().getFullYear()}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
