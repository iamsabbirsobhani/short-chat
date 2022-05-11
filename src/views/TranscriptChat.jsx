import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pageIncrement } from "../features/state/globalState";
import format from "date-fns/format";

export default function TranscriptChat() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.global.page);
  const [data, setdata] = useState(null);

  async function getTranscript() {
    const response = await axios.get(
      `https://short-chat-backend.herokuapp.com/chat/${page}`,
      {
        headers: { code: 1379 },
      }
    );
    const finalRes = await response.data;
    setdata(finalRes);
    // console.log(finalRes);
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
    };
  }, []);

  return (
    <>
      <div className=" fixed top-14 bottom-0 break-words p-3 py-3 left-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2  backdrop-blur-md overflow-y-scroll">
        {data &&
          data.rows.map((chat) => (
            <div
              key={chat.id}
              className="  mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800"
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
              <div>
                <p className=" text-xs text-gray-400">
                  {format(new Date(chat.createdAt), "PPp")}
                </p>
                <p className=" text-xs text-gray-400">ID: {chat.id}</p>
                <p className=" text-xs text-gray-400">IP: {chat.ip}</p>
                <p className=" text-xs text-gray-400">
                  location: {chat.location}
                </p>
              </div>
            </div>
          ))}
        <div className=" text-center">
          {data && data.rows.length < data.count && (
            <button
              onClick={() => showMore()}
              className=" text-white font-semibold uppercase rounded-sm bg-gray-700 px-8 py-2"
            >
              Show more...
            </button>
          )}
        </div>
      </div>
    </>
  );
}
