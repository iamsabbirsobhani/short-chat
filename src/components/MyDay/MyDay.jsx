import { Routes, Route } from "react-router-dom";
import MyDayPage from "./MyDayPage";
import { useNavigate } from "react-router-dom";

export default function MyDay(props) {
  let navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate("myday");
        }}
        className=" cursor-pointer w-9 h-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex justify-center items-center"
      >
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
