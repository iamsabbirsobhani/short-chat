import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pageIncrement, setPage } from "../features/state/globalState";
import format from "date-fns/format";
import { Timestamp } from "firebase/firestore";

export default function TranscriptChat(props) {
  const onBottom = useRef(null);
  const dispatch = useDispatch();
  const page = useSelector((state) => state.global.page);
  const token = useSelector((state) => state.global.token);

  const [data, setdata] = useState([]);
  const [pageLimit, setpageLimit] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isAutoScroll, setisAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  async function getTranscript() {
    setisLoading(true);
    props.socket.emit("get-offline-texts", page);
    // onBottom.current.scrollTop = 100;
    // onBottom.current.scrollTop = onBottom.current.scrollHeight;
    // console.log(finalRes);
  }

  const showMore = () => {
    dispatch(pageIncrement());
    getTranscript();
  };

  //   execute only once after mounted
  useEffect(() => {
    return () => {
      console.log("transcript unmounted");
      // after leaving the transcript default pagination
      // will be 8

      dispatch(setPage(8));
      setisAutoScroll(true);
    };
  }, []);

  useEffect(() => {
    props.socket.on("get-offline-texts", (data) => {
      console.log(data);
      setdata(data);
      setisLoading(false);
    });

    props.socket.on("get-offline-texts-totalDocs", (data) => {
      console.log(data);
      setpageLimit(data);
    });
    return () => {};
  });

  useEffect(() => {
    console.log("active");
    // console.log(props.socket);
    if (isAutoScroll) {
      // scrollToBottom();
    }
  });

  // const fnBottom = () => {
  //   console.log(onBottom.current.scrollTop === onBottom.current.scroll);
  //   console.log(onBottom.current.scrollTop, onBottom.current.scrollHeight);
  //   setisAutoScroll(false);
  //   if (onBottom.current.scrollTop === onBottom.current.offsetHeight) {
  //     console.log("You have reached top");
  //     dispatch(pageIncrement());
  //   }
  // };

  function loadMore() {
    setisAutoScroll(false);
    dispatch(pageIncrement());
  }

  // watching page when it gets updated
  useEffect(() => {
    getTranscript();
  }, [page]);

  return (
    <>
      <div className=" fixed top-[40vh] left-0 right-0 text-center mt-3 mb-3 z-30">
        {isLoading && (
          <div className=" m-auto   animate-spin w-10 h-10 border-t-gray-800 border-4 border-l-gray-800 border-b-gray-800 border-r-white rounded-full"></div>
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
      <div
        // onScroll={() => fnBottom()}
        ref={onBottom}
        className=" fixed top-14 bottom-0 break-words p-3 py-3 left-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2 z-20  backdrop-blur-md overflow-y-scroll"
      >
        {data &&
          data.length &&
          data.map((chat, index) =>
            chat &&
            token &&
            chat.name.toLowerCase() === token.name.toLowerCase() ? (
              <div
                key={chat.docId}
                ref={messagesEndRef}
                className="  mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800 w-2/3 flex flex-col ml-auto mr-0"
              >
                <h1 className=" uppercase text-white antialiased tracking-wider">
                  {chat.name}
                </h1>

                <div className=" break-words bg-gray-800/20 p-2 rounded-sm">
                  {chat.text.includes("mp4") ? (
                    <video width="320" height="240" muted controls>
                      <source src={chat.text} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : chat.text.includes("audio") ? (
                    <audio controls className=" w-44">
                      <source src={chat.text} type="audio/ogg" />
                    </audio>
                  ) : chat.text.includes("image") ? (
                    <img src={chat.text} />
                  ) : (
                    <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                      {chat.text}
                    </p>
                  )}
                </div>
                <div className=" flex items-center justify-between mt-1">
                  <p className=" text-xs text-right text-gray-400">
                    {format(
                      new Timestamp(
                        chat.createdAt.seconds,
                        chat.createdAt.nanoseconds
                      ).toDate(),
                      "PPp"
                    )}
                  </p>
                  <p className=" text-xs text-gray-400">
                    ID: {chat.docId.slice(0, 7)}...
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={chat.docId}
                ref={messagesEndRef}
                className=" mr-auto ml-0 w-2/3  mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800"
              >
                <h1 className="uppercase text-white antialiased tracking-wider">
                  {chat.name}
                </h1>

                <div className=" break-words bg-gray-800/20 p-2 rounded-sm">
                  {chat.text.includes("mp4") ? (
                    <video width="320" height="240" muted controls>
                      <source src={chat.text} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : chat.text && chat.text.includes("audio") ? (
                    <audio controls className=" w-44">
                      <source src={chat.text} type="audio/ogg" />
                    </audio>
                  ) : chat.text.includes("image") ? (
                    <img src={chat.text} />
                  ) : (
                    <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                      {chat.text}
                    </p>
                  )}
                </div>
                <div className=" flex items-center justify-between mt-1">
                  <p className=" text-left text-xs text-gray-400">
                    {format(
                      new Timestamp(
                        chat.createdAt.seconds,
                        chat.createdAt.nanoseconds
                      ).toDate(),
                      "PPp"
                    )}
                  </p>
                  <p className=" text-xs text-gray-400">
                    ID: {chat.docId.slice(0, 7)}...
                  </p>
                </div>
              </div>
            )
          )}

        {data && data.length <= 0 ? (
          <div>
            <h1 className=" text-white text-center mt-3 mb-3 font-semibold">
              No Data found
            </h1>
          </div>
        ) : null}
        {isLoading ? (
          <div className=" text-center">
            <button
              className="text-white mt-3 mb-3 uppercase bg-rose-900 px-3 p-2 font-bold rounded-md shadow-lg transition-all duration-150"
              disabled
            >
              Load More...
            </button>
          </div>
        ) : (
          <div className=" text-center">
            <button
              className="text-white mt-3 mb-3 uppercase px-3 bg-rose-700 p-2 font-bold rounded-md shadow-lg transition-all duration-150 "
              onClick={() => {
                loadMore();
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
