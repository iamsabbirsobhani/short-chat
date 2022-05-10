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
      <div className=" fixed top-14 bottom-0 break-words p-3 py-3 left-0 w-1/2 bg-gray-600 backdrop-blur-md overflow-y-scroll">
        {data &&
          data.rows.map((chat) => (
            <div className=" bg-gray-500 mb-3 p-2 rounded-sm">
              <h1 className=" text-white font-semibold">{chat.name}</h1>
              <div className=" break-words">
                <p>{chat.msg}</p>
              </div>
              <div>
                <p className=" text-xs text-gray-700">
                  {format(new Date(chat.createdAt), "PPp")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
