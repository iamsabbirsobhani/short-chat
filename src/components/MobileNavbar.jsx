import Drawer from "./Drawer";
import { useSelector, useDispatch } from "react-redux";
import {
  setDrawer,
  setToken,
  toggleDrawer,
} from "../features/state/globalState";
import MyDay from "./MyDay/MyDay";

export default function MobileNavbar({ callSend, socket }) {
  const drawer = useSelector((state) => state.global.drawer);
  const connectedUsers = useSelector((state) => state.global.connectedUsers);
  const token = useSelector((state) => state.global.token);

  const dispatch = useDispatch();

  function drawerToggle() {
    dispatch(toggleDrawer());
  }

  return (
    <>
      <div className=" w-full flex justify-between items-center p-3 bg-gray-900 shadow-2xl mb-2 text-white ">
        <div
          onClick={() => drawerToggle()}
          className=" text-2xl ml-2 cursor-pointer  flex  justify-center items-center"
        >
          <ion-icon name="grid"></ion-icon>
        </div>

        <div>
          {token.admin ? (
            <div>
              <MyDay />
            </div>
          ) : null}
        </div>

        {connectedUsers ? (
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
