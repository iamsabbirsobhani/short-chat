import Chat from "./views/Chat";

function App(props) {
  return (
    <div className="App">
      <header>
        <Chat socket={props.socket} />
      </header>
    </div>
  );
}

export default App;
