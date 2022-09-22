import Drawer from "./Drawer";
import { useSelector, useDispatch } from "react-redux";
import {
  setDrawer,
  setToken,
  toggleDrawer,
} from "../features/state/globalState";
import MyDay from "./MyDay/MyDay";
import Stories from "./Stories";
import { useState, useEffect } from "react";

export default function MobileNavbar({ callSend, socket }) {
  const drawer = useSelector((state) => state.global.drawer);
  const siteStatus = useSelector((state) => state.global.siteStatus);
  const connectedUsers = useSelector((state) => state.global.connectedUsers);
  const token = useSelector((state) => state.global.token);
  const [showStories, setshowStories] = useState(false);
  const [lockscreen, setlockscreen] = useState(false);
  const [lockscreenmsg, setlockscreenmsg] = useState("");
  const dispatch = useDispatch();

  function drawerToggle() {
    dispatch(toggleDrawer());
  }

  function isLockedScreen() {
    setlockscreen(true);
  }

  function unlockScreen(e) {
    e.preventDefault();
    console.log(e.target[0].value);
    if (e.target[0].value) {
      fetch(`http://localhost:8083/lockscreen/${e.target[0].value}`)
      // fetch(
      //   `https://short-chat-backend.herokuapp.com/lockscreen/${e.target[0].value}`
      // )
        .then((res) => res.json())
        .then((response) => {
          if (response === false) {
            setlockscreen(response);
          } else {
            setlockscreen(true);
            setlockscreenmsg(response?.msg);
          }
        });
    } else {
      setlockscreenmsg("Empty code buddy! 😁");
    }
    e.target[0].value = null;
  }

  return (
    <>
      <div className=" w-full flex justify-between items-center p-3 bg-gray-900 shadow-2xl mb-2 text-white ">
        {(siteStatus && siteStatus.menu) || (token && token.admin) ? (
          <div
            onClick={() => drawerToggle()}
            className=" text-2xl ml-2 cursor-pointer  flex  justify-center items-center"
          >
            <ion-icon name="grid"></ion-icon>
          </div>
        ) : null}

        <div>
          <button
            onClick={() => isLockedScreen()}
            className=" bg-gray-500/50 w-8 h-8 flex justify-center items-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div>

        {/* lockscreen overlay no business with nav menus */}
        {lockscreen ? (
          <div className=" flex justify-center items-center w-full h-full fixed top-0 left-0 right-0 bottom-0 z-[100] backdrop-blur-xl">
            <div className=" border-2 border-gray-200/50">
              <form onSubmit={unlockScreen}>
                <input
                  className=" p-2 px-3 outline-none text-black"
                  type="password"
                  placeholder="😂"
                />
                {lockscreenmsg ? (
                  <div>
                    <p className=" w-44 ml-3 mt-3 text-red-500 font-bold break-all">
                      {lockscreenmsg}
                    </p>
                  </div>
                ) : null}
                <div className=" text-center mt-3">
                  <button className=" w-full h-10 bg-blue-500">Yup!</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
        {/* end lockscreen overlay */}

        {(siteStatus && siteStatus.day) || (token && token.admin) ? (
          <div>
            <div>
              <MyDay useSelector={useSelector} socket={socket} />
            </div>
          </div>
        ) : null}

        {/* {(siteStatus && siteStatus.day) || (token && token.admin) ? (
          <div>
            <button
              className=" p-2 px-3 bg-gray-700 rounded-sm font-semibold"
              onClick={() => {
                setshowStories(!showStories);
              }}
            >
              Stories
            </button>
            {showStories && <Stories />}
          </div>
        ) : null} */}

        {(connectedUsers && siteStatus && siteStatus.online) ||
        (token && token.admin) ? (
          <div className=" flex">
            {connectedUsers.map((item, index) =>
              item.id !== token.id && item.online ? (
                <div
                  key={index}
                  className="flex items-center ml-2 border-2  p-1"
                >
                  {item.online ? (
                    <>
                      <div className="name mr-2 ">
                        <p>{item.name}</p>
                      </div>
                      <div className="name h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    </>
                  ) : null}
                </div>
              ) : null
            )}
          </div>
        ) : null}

        {(siteStatus && siteStatus.call) || (token && token.admin) ? (
          <div
            onClick={callSend}
            className=" cursor-pointer bg-green-500 w-8 h-8 flex justify-center items-center rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
        ) : null}
      </div>
      {/* <div>
        <Drawer />
      </div> */}
      <div>
        {drawer ? <Drawer socket={socket} drawerToggle={drawerToggle} /> : null}
      </div>
    </>
  );
}
