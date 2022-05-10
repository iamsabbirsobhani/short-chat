import axios from "axios";
import { useState, useEffect } from "react";
import format from "date-fns/format";
export default function TranscriptChat() {
  const [data, setdata] = useState(null);
  async function getTranscript() {
    const response = await axios.get(
      "https://short-chat-backend.herokuapp.com/chat",
      {
        headers: { code: 1379 },
      }
    );
    const finalRes = await response.data;
    setdata(finalRes);
    console.log(finalRes);
  }

  //   execute only once after mounted
  useEffect(() => {
    getTranscript();
    return () => {
      console.log("transcript unmounted");
    };
  }, []);
  return (
    <>
      <div className=" fixed top-14 bottom-0 break-words p-3 py-3 left-0 w-1/2  backdrop-blur-md overflow-y-scroll">
        {data &&
          data.rows.map((chat) => (
            <div className="  mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800">
              <h1 className=" text-white antialiased tracking-wider">
                {chat.name}
              </h1>
              <div className=" break-words bg-gray-800/20 p-2 rounded-sm">
                <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                  {chat.msg}
                </p>
              </div>
              <div>
                <p className=" text-xs text-gray-600">
                  {format(new Date(chat.createdAt), "PPp")}
                </p>
                <p className=" text-xs text-gray-600">ID: {chat.id}</p>
                <p className=" text-xs text-gray-600">IP: {chat.ip}</p>
                <p className=" text-xs text-gray-600">
                  location: {chat.location}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
