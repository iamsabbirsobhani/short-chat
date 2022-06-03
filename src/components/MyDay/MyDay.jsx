import { Routes, Route } from "react-router-dom";
import MyDayPage from "./MyDayPage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function MyDay(props) {
  let navigate = useNavigate();
  const user = props.useSelector((state) => state.global.user);
  const token = props.useSelector((state) => state.global.token);
  useEffect(() => {
    // console.log("MyDay User: ", user);
  }, []);
  return (
    <>
      <div
        onClick={() => {
          navigate("myday");
          props.socket.emit(
            "is-new-day",
            JSON.parse(localStorage.getItem("user"))?.id
          );
        }}
        className=" cursor-pointer w-9 h-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex justify-center items-center relative"
      >
        {user?.newDay ? (
          <div className=" absolute text-[10px] p-[1px] -top-1  -right-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-sm">
            <h1>New</h1>
          </div>
        ) : null}
        <ion-icon name="images-outline"></ion-icon>
      </div>

      <Routes>
        <Route
          path="myday"
          element={<MyDayPage socket={props.socket} navigate={navigate} />}
        />
      </Routes>
    </>
  );
}
