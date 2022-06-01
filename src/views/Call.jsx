import { useState, useEffect } from "react";
// import Count from "./components/count";
import { useSelector, useDispatch } from "react-redux";
import { openCallerScreenOff } from "../features/state/globalState";
export default function Call(props) {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const closeCall = () => {
    console.log("Close Call");
    props.socket.emit("close-call", props.socket.id);
    dispatch(openCallerScreenOff());
  };

  let myVideoStream;

  useEffect(() => {
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const videoGrid = document.getElementById("video-grid");
    props.socket.on("abc", (userId) => {
      console.log(userId);
      setCount(userId);
    });
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        console.log("inside stream");

        props.peer.on("call", (call) => {
          call.answer(stream);
          console.log("Peer.on call");
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            console.log("call.on stream");
            addVideoStream(video, userVideoStream);
          });
        });

        props.socket.on("user-connected", (userId) => {
          console.log(userId);
          console.log("Socket.on user-connected, userId", userId);
          connectToNewUser(userId, stream);
        });
      });
    const connectToNewUser = (userId, stream) => {
      const call = props.peer.call(userId, stream);
      const video = document.createElement("video");
      console.log("Connect New User, userId", userId);
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
        console.log("Connect New User: call.on stream");
      });
    };

    const addVideoStream = (video, stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.append(video);
      });
    };
  });
  return (
    <>
      <div className="fixed top-0  left-0 w-full h-14 shadow-md   flex justify-center items-center right-0 backdrop-blur-md  m-auto">
        <div className="bg-red-500 p-2 bg-center rounded-sm shadow-md text-gray-900 bg-cover bg-no-repeat ">
          <div className=" break-words antialiased  text-center  text-gray-50 font-bold">
            <div className=" text-center text-xl flex items-center">
              <p className=" animate-pulse mr-2"> Call in progress...</p>
              <div
                onClick={() => closeCall()}
                className=" cursor-pointer bg-white text-red-500 rounded-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="video-grid"></div>
    </>
  );
}
