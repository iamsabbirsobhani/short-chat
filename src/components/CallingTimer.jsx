import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function CallingTimer(props) {
  const pId = useSelector((state) => state.global.peerId);
  const [sec, setSec] = useState(0);
  const [min, setmin] = useState(0);
  const [hour, sethour] = useState(0);
  const [micToggle, setMicToggle] = useState(true);

  let secL = 0;
  let minL = 0;
  let hourL = 0;
  useEffect(() => {
    const interval = setInterval(() => {
      setSec(secL);
      secL++;
      if (secL > 60) {
        secL = 1;
        minL++;
        setmin(minL);
      }
      if (minL > 60) {
        minL = 0;
        hourL++;
        sethour(hourL);
      }
      //   console.log("Hour:", hourL, "Min: ", minL, "Sec: ", secL);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const toggleMic = () => {
    setMicToggle(!micToggle);
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
          console.log("Socket.on user-connected, userId", props.peerId, pId);
          connectToNewUser(pId, stream);
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
  }, []);
  return (
    <div className=" flex justify-between h-[60px] items-center shadow-lg absolute top-0 text-white bg-red-500 w-full p-3 ">
      <div>
        {micToggle ? (
          <div
            onClick={() => toggleMic()}
            className=" cursor-pointer shadow-md bg-white text-red-500 text-2xl flex justify-center items-center w-8 h-8 rounded-sm"
          >
            <ion-icon name="mic-outline"></ion-icon>
          </div>
        ) : (
          <div
            onClick={() => toggleMic()}
            className=" cursor-pointer shadow-md bg-white text-red-500 text-2xl flex justify-center items-center w-8 h-8 rounded-sm"
          >
            <ion-icon name="mic-off-outline"></ion-icon>
          </div>
        )}
      </div>
      <div>
        <h1 className=" font-semibold tracking-wider">
          {hour}:{min}:{sec}
          <div id="video-grid"></div>
        </h1>
      </div>
      <div className=" cursor-pointer bg-white text-red-500 rounded-sm">
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
  );
}
