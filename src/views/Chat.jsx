import { useState, useEffect, useRef } from "react";
import "../styles/chat.scss";
export default function Chat(props) {
  const [msg, setMsg] = useState([]);
  const [id, setId] = useState([]);
  const [chat, setChat] = useState(null);
  const [imgChunks, setImgChunks] = useState([]);
  const [timer, setTimer] = useState([]);
  const [alert, setAlert] = useState(null);
  const messagesEndRef = useRef(null);
  const imgref = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  const sendMsg = (e) => {
    e.preventDefault();

    if (chat) {
      props.socket.emit("chat message", `${chat} ${props.socket.id}`);
    }
    setChat(null);
    e.target.chatField.value = null;
  };

  useEffect(() => {
    console.log(props.socket.id);
    props.socket.on("chat message", (res) => {
      setId(props.socket.id);
      // console.log(res);
      setMsg(res);
    });
    // for image
    let imgAr = [];
    props.socket.on("img-chunk", function (chunk) {
      imgAr.push(chunk);
      setImgChunks(imgAr);
      console.log(imgChunks);
    });

    props.socket.on("timer", function (sec) {
      console.log(sec);
      setTimer(sec);
    });

    props.socket.on("alert", function (msg) {
      console.log(msg);
      setAlert(msg);
    });

    const stopScrol = setInterval(() => {
      scrollToBottom();
      console.log("sd");
    }, 10);

    setTimeout(() => {
      clearInterval(stopScrol);
    }, 2000);
  });

  return (
    <>
      {/* <p className=" text-3xl text-red-400">ID: {id}</p> */}

      {alert ? (
        <div className=" absolute left-0 right-0 bg-red-500 transition duration-300 w-72 m-auto p-3">
          <p className=" text-white uppercase font-semibold text-center">
            {alert}
          </p>
        </div>
      ) : null}
      <div className="scroll-style w-80 h-[72vh] overflow-y-scroll m-auto">
        <div className="">
          {/* style={
                  m.includes(id)
                    ? { flex: "right", whiteSpace: "pre-wrap", color: "gray" }
                    : { color: "" }
                } */}
          {msg.map((m, index) =>
            m.includes(id) ? (
              <h1
                ref={messagesEndRef}
                className=" float-right mr-1  mb-3 text-white bg-emerald-700 p-3 rounded-lg w-44  break-words"
                key={index}
              >
                {m}
              </h1>
            ) : (
              <h1
                className=" float-left text-white mb-3 bg-gray-700 p-3 rounded-lg w-44 break-words"
                key={index}
                ref={messagesEndRef}
              >
                {m}
              </h1>
            )
          )}
        </div>
      </div>
      <form onSubmit={sendMsg} className=" text-center w-80 m-auto mt-5">
        <div className=" relative">
          <label for="chatField">
            <div className="text-purple-500 p-2 bg-purple-400/40 w-9 h-9 rounded-full absolute left-7 top-1.5">
              <label for="file-input" className=" cursor-pointer ">
                <ion-icon name="image"></ion-icon>
              </label>
              <input
                className=" hidden w-9"
                type="file"
                name=""
                id="file-input"
              />
            </div>
          </label>
          <input
            className=" bg-gray-100 outline-none w-[280px] py-3 pl-[50px] pr-14 p-10 rounded-3xl"
            type="text"
            name="chatField"
            onChange={(e) => setChat(e.target.value)}
            placeholder="Message..."
            autoComplete="off"
          />
          <button
            type="submit"
            className=" bg-blue-200/50 h-9 w-9 rounded-full p-2 text-blue-500 absolute right-[30px] top-[6px]"
          >
            <ion-icon name="send"></ion-icon>
          </button>
        </div>
      </form>
      {/* <img src={`data:image/jpeg;base64,` + window.btoa(imgChunks)} alt="" /> */}
    </>
  );
}
