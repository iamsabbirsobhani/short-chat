import Chat from "./views/Chat";
import CallingTimer from "./components/CallingTimer";
import { useSelector } from "react-redux";

function App(props) {
  const callTimer = useSelector((state) => state.global.callTimer);
  const pId = useSelector((state) => state.global.peerId);

  return (
    <div className="App">
      <header>
        {callTimer && (
          <CallingTimer peerId={pId} peer={props.peer} socket={props.socket} />
        )}
        <Chat socket={props.socket} peer={props.peer} peerId={props.peerId} />
      </header>
    </div>
  );
}

export default App;
