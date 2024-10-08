import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setMicOn,
  setMicOff,
  callTimerOff,
  setMyvideoStream,
} from "../features/state/globalState";
export default function CallingTimer(props) {
  const pId = useSelector((state) => state.global.peerId);
  const isMicOn = useSelector((state) => state.global.isMicOn);
  const dispatch = useDispatch();

  const closeCall = () => {
    props.socket.emit("all-mic", false);
    props.socket.emit("call-close", true);
    dispatch(callTimerOff());
  };

  let myVideoStream;
  const off = function () {
    //toggle state
    myVideoStream.getAudioTracks()[0].enabled =
      !myVideoStream.getAudioTracks()[0].enabled;
  };
  const toggleMic = () => {
    // setMicToggle(!micToggle);
    off();
    console.log("Mic Toggled");
  };

  useEffect(() => {
    props.socket.emit("join", pId);
    console.log("Join ", pId);
  });
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
        myVideoStream.getAudioTracks()[0].enabled = true;

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
          console.log("Stream:user-connected, ", stream);
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

    props.socket.on("all-mic", (action) => {
      // bellow code fully turned off the mic
      // const enabled = myVideoStream.getAudioTracks();
      // enabled[0].stop();
      myVideoStream.getAudioTracks()[0].enabled = false;
      console.log("stop all mic");
    });

    props.socket.on("all-mic-on", (action) => {
      // bellow code fully turned off the mic
      // const enabled = myVideoStream.getAudioTracks();
      // enabled[0].stop();

      // myVideoStream.getAudioTracks()[0].enabled = true;
      console.log("start all mic");
    });
  });
  return (
    <div className=" flex justify-between h-[60px] items-center shadow-lg fixed top-0 text-white bg-red-500 w-full p-3 ">
      <div>
        {isMicOn ? (
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
          <h1 className=" animate-pulse">Call in progress</h1>
          <div id="video-grid"></div>
        </h1>
      </div>
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
  );
}
