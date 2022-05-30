import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pageIncrement, setPage } from "../features/state/globalState";
import format from "date-fns/format";

export default function TranscriptChat() {
  const onBottom = useRef(null);
  const dispatch = useDispatch();
  const page = useSelector((state) => state.global.page);
  const token = useSelector((state) => state.global.token);
  const [data, setdata] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [isAutoScroll, setisAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function getTranscript() {
    setisLoading(true);
    const response = await axios.get(
      `https://short-chat-backend.herokuapp.com/chat/${page}`,
      {
        headers: { code: 1379 },
      }
    );
    // console.log(response);
    const finalRes = await response.data;
    setdata(finalRes);
    setisLoading(false);
    onBottom.current.scrollTop = 100;
  }

  const showMore = () => {
    dispatch(pageIncrement());
    getTranscript();
  };

  //   execute only once after mounted
  useEffect(() => {
    dispatch(pageIncrement());
    getTranscript();
    return () => {
      console.log("transcript unmounted");
      // after leaving the transcript default pagination
      // will be 8
      dispatch(setPage(8));
      setisAutoScroll(true);
    };
  }, []);

  useEffect(() => {
    console.log("active");
    if (isAutoScroll) {
      scrollToBottom();
    }
  });

  const fnBottom = () => {
    setisAutoScroll(false);
    if (onBottom.current.scrollTop === 0) {
      console.log("You have reached top");
      dispatch(pageIncrement());
      getTranscript();
    }
  };

  return (
    <>
      <div
        onScroll={() => fnBottom()}
        ref={onBottom}
        className=" fixed top-14 bottom-0 break-words p-3 py-3 left-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2  backdrop-blur-md overflow-y-scroll"
      >
        <div className=" text-center mt-3 mb-3">
          {isLoading && (
            <div className=" m-auto  animate-spin w-10 h-10 border-t-gray-800 border-4 border-l-gray-800 border-b-gray-800 border-r-white rounded-full"></div>
          )}
          {/* {data && data.rows.length < data.count && (
            <button
              onClick={() => showMore()}
              className=" text-white font-semibold uppercase rounded-sm bg-gray-700 px-8 py-2"
            >
              Show more...
            </button>
          )} */}
        </div>
        {data &&
          data.rows.map((chat) =>
            chat.name.toLowerCase() == token.name.toLowerCase() ? (
              <div
                key={chat.id}
                ref={messagesEndRef}
                className="  mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800 w-2/3 flex flex-col ml-auto mr-0"
              >
                <h1 className=" text-white antialiased tracking-wider">
                  {chat.name}
                </h1>

                <div className=" break-words bg-gray-800/20 p-2 rounded-sm">
                  {chat.msg.includes("firebase") ? (
                    <img src={chat.msg} />
                  ) : chat.msg.includes("mp4") ? (
                    <video width="320" height="240" muted controls>
                      <source src={chat.msg} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                      {chat.msg}
                    </p>
                  )}
                </div>
                <div className=" flex items-center justify-between mt-1">
                  <p className=" text-xs text-right text-gray-400">
                    {format(new Date(chat.createdAt), "PPp")}
                  </p>
                  <p className=" text-xs text-gray-400">ID: {chat.id}</p>
                </div>
              </div>
            ) : (
              <div
                key={chat.id}
                className=" mr-auto ml-0 w-2/3  mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800"
              >
                <h1 className=" text-white antialiased tracking-wider">
                  {chat.name}
                </h1>

                <div className=" break-words bg-gray-800/20 p-2 rounded-sm">
                  {chat.msg.includes("firebase") ? (
                    <img src={chat.msg} />
                  ) : chat.msg.includes("mp4") ? (
                    <video width="320" height="240" muted controls>
                      <source src={chat.msg} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                      {chat.msg}
                    </p>
                  )}
                </div>
                <div className=" flex items-center justify-between mt-1">
                  <p className=" text-left text-xs text-gray-400">
                    {format(new Date(chat.createdAt), "PPp")}
                  </p>
                  <p className=" text-xs text-gray-400">ID: {chat.id}</p>
                </div>
              </div>
            )
          )}
      </div>
    </>
  );
}
