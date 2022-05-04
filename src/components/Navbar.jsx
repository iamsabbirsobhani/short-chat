import avatar from "../assets/avatar.png";
import { useDispatch } from "react-redux";

export default function Navbar({ callSend }) {
  const dispatch = useDispatch();
  return (
    <div className=" text-white m-auto w-full mb-2 p-3 bg-gray-800/40">
      <div className=" flex items-center justify-between">
        <img className=" w-9 mr-3" src={avatar} alt="" />
        <h1 className=" font-semibold text-xl">Albion Johnson</h1>
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
        {/* <div className=" ml-3 border-none w-2  h-2 bg-green-500 rounded-full"></div> */}
      </div>
    </div>
  );
}
