import Chat from "./views/Chat";
import CallingTimer from "./components/CallingTimer";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import Login from "./components/Login";
// import { useEffect } from "react";

function App(props) {
  const callTimer = useSelector((state) => state.global.callTimer);
  const pId = useSelector((state) => state.global.peerId);
  const [state, setstate] = useState(true);
  const [isWrong, setIsWrong] = useState(false);
  const [isError, setisError] = useState(null);
  const [isLodaing, setIsLoading] = useState(false);

  async function handleLogin(code) {
    setIsWrong(false);
    setIsLoading(true);
    setisError(null);
    code.preventDefault();
    try {
      const response = await axios.get(
        `https://short-chat-backend.herokuapp.com/${code.target[0].value}`
      );
      const res = await response.data;
      setstate(res);
      setIsWrong(res);
      console.log(res);
      setIsLoading(false);
      if ("error" in res) {
        console.log("sldjfsjdf");
        setisError(res);
        console.log("sldjfsjdf");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  // useEffect(() => {
  //   props.socket.emit("connects");

  //   props.socket.on("total-user", (user) => {
  //     console.log("Total user: ", user);
  //   });
  // }, []);

  return (
    <div className="App">
      <header>
        {callTimer && (
          <CallingTimer peerId={pId} peer={props.peer} socket={props.socket} />
        )}
        {state && (
          <Login
            isError={isError}
            isLodaing={isLodaing}
            isWrong={isWrong}
            state={state}
            handleLogin={handleLogin}
          />
        )}
        <Chat socket={props.socket} peer={props.peer} peerId={props.peerId} />
      </header>
    </div>
  );
}

export default App;
