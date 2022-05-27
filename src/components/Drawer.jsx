import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setPage } from "../features/state/globalState";

export default function Drawer({ drawerToggle, socket }) {
  const token = useSelector((state) => state.global.token);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <div
        onClick={drawerToggle}
        className="background w-full h-full backdrop-blur-sm z-[80] fixed left-0 right-0 top-0 bottom-0"
      >
        <h1>Drawer</h1>
      </div>
      <div className="drawer p-2 w-[220px] h-full bg-gray-900 z-[100] fixed top-0 left-0 ">
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
                navigate("/");
                drawerToggle();
              }}
              className=" text-white bg-blue-500 p-2 rounded-sm shadow-md"
            >
              <div className="  flex justify-center items-center text-2xl">
                {/* <h1 className=" mr-2">Chat</h1> */}
                <ion-icon name="chatbox-ellipses"></ion-icon>
              </div>
            </button>
          </div>
          <div className=" mt-2">
            <button
              onClick={() => {
                navigate("social");
                drawerToggle();
              }}
              className=" text-white bg-blue-500 p-2 rounded-sm shadow-md"
            >
              Partager
            </button>
          </div>
          {token && token.admin === true ? (
            <div className=" mt-2">
              <button
                onClick={() => {
                  navigate("transcript");
                  drawerToggle();
                }}
                className=" text-white bg-blue-500 p-2 rounded-sm shadow-md"
              >
                Transcript
              </button>
            </div>
          ) : null}
          {token && token.admin === true ? (
            <div className=" mt-2">
              <button
                onClick={() => {
                  navigate("logs");
                  drawerToggle();
                }}
                className=" text-white bg-blue-500 p-2 rounded-sm shadow-md"
              >
                User Logs
              </button>
            </div>
          ) : null}
          <div className=" mt-2">
            <button
              onClick={() => {
                navigate("images");
                drawerToggle();
              }}
              className=" text-white bg-blue-500 p-2 rounded-sm shadow-md"
            >
              Image Gallery
            </button>
          </div>
          <div className="logout mt-4 text-center">
            <button
              onClick={() => {
                dispatch(setPage(8));
                drawerToggle();
                dispatch(setToken(null));
                localStorage.setItem("user", JSON.stringify(null));
                navigate("signin");
              }}
              className=" text-white font-semibold bg-red-500 p-2 rounded-sm shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
