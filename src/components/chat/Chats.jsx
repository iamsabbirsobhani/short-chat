export default function Chats({
  msg,
  handleOlderMessage,
  olderMsgLoading,
  token,
  messagesEndRef,
  handleSelfChatInfo,
}) {
  return (
    <>
      {msg.length ? (
        <div className="grid grid-cols-2 gap-2">
          {!olderMsgLoading ? (
            <div
              onClick={handleOlderMessage}
              className="border-2 col-span-2 border-gray-50 rounded-full w-32 mt-5 mb-5 ml-auto mr-auto p-2 cursor-pointer"
            >
              <h1 className="text-gray-50 text-center text-xs">
                Older Messages
              </h1>
            </div>
          ) : (
            <div>
              <div className=" z-50 fixed w-full h-full left-0 right-0 bottom-0 top-0  ml-auto mr-auto flex justify-center items-center bg-gray-400/50">
                <h1 className="text-gray-50 text-center text-lg font-bold">
                  Loading...
                </h1>
              </div>
            </div>
          )}
          {msg.map((m, index) =>
            token && m.uId == token.id ? (
              <div
                onClick={() => handleSelfChatInfo(m)}
                ref={messagesEndRef}
                className=" cursor-pointer relative col-start-1 col-end-4    text-white bg-emerald-700 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
                key={index}
              >
                {m.url && m.url.includes('mp4') && m.url.includes('video') ? (
                  <video width="320" height="240" muted controls>
                    <source src={m.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : m.url && m.url.includes('audio') ? (
                  <audio controls className=" w-44">
                    <source src={m.url} type="audio/ogg" />
                  </audio>
                ) : (
                  <div className=" rounded-md mt-1 mb-1 ">
                    <img loading="lazy" src={m.url} alt="" />
                  </div>
                )}
                {m.chat &&
                m.chat.includes('mp4') &&
                m.chat.includes('video') ? (
                  <video width="320" height="240" muted controls>
                    <source src={m.chat} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : m.deletedMsg ? (
                  <h1 className=" mt-1 mb-1 font-bold  uppercase">{m.chat}</h1>
                ) : (
                  <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
                )}
              </div>
            ) : (
              <div className="col-start-1 col-end-4 " key={index}>
                <div
                  onClick={() => handleOtherChatInfo(m)}
                  className="cursor-pointer ml-1 relative float-left text-white  bg-gray-800 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-full  break-words shadow-md"
                  ref={messagesEndRef}
                >
                  {m.url && m.url.includes('mp4') && m.url.includes('video') ? (
                    <video width="320" height="240" muted controls>
                      <source src={m.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : m.url && m.url.includes('audio') ? (
                    <audio controls className=" w-44">
                      <source src={m.url} type="audio/ogg" />
                    </audio>
                  ) : (
                    <div className=" rounded-md mt-1 mb-1 ">
                      <img loading="lazy" src={m.url} alt="" />
                    </div>
                  )}

                  {m.chat &&
                  m.chat.includes('mp4') &&
                  m.chat.includes('video') ? (
                    <video width="320" height="240" muted controls>
                      <source src={m.chat} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className=" text-white text-2xl flex h-full w-full  justify-center items-center">
          Loading...
        </div>
      )}
    </>
  );
}
