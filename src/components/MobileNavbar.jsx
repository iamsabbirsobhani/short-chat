import Drawer from "./Drawer";
import { useSelector, useDispatch } from "react-redux";
import { setDrawer, toggleDrawer } from "../features/state/globalState";

export default function MobileNavbar({ callSend }) {
  const drawer = useSelector((state) => state.global.drawer);
  const dispatch = useDispatch();

  function drawerToggle() {
    dispatch(toggleDrawer());
  }

  return (
    <>
      <div className=" w-full flex justify-between items-center p-3 bg-gray-900 shadow-2xl mb-2 text-white">
        <div
          onClick={() => drawerToggle()}
          className=" text-2xl ml-2 cursor-pointer  flex  justify-center items-center"
        >
          <ion-icon name="grid"></ion-icon>
        </div>

        <div
          onClick={callSend}
          className=" cursor-pointer bg-green-500 w-8 h-8 flex justify-center items-center rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
      </div>
      {/* <div>
        <Drawer />
      </div> */}
      <div>{drawer ? <Drawer drawerToggle={drawerToggle} /> : null}</div>
    </>
  );
}
