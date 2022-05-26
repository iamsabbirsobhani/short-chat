export default function ChatButton() {
  return (
    <>
      <div className=" z-50 mt-2 absolute bottom-0 right-0">
        <button
          //   onClick={() => {
          //     navigate("/");
          //     drawerToggle();
          //   }}
          className=" text-white bg-blue-500 p-2 rounded-sm shadow-md"
        >
          <div className="  flex justify-center items-center text-2xl">
            {/* <h1 className=" mr-2">Chat</h1> */}
            <ion-icon name="chatbox-ellipses"></ion-icon>
          </div>
        </button>
      </div>
    </>
  );
}
