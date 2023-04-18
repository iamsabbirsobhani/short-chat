export default function SelfChats({
  messagesEndRef,
  m,
  index,
  handleSelfChatInfo,
}) {
  return (
    <>
      {m && m.deletedMsg ? (
        m.chat ? (
          <div
            onClick={() => handleSelfChatInfo(m)}
            ref={messagesEndRef}
            className=" cursor-pointer relative col-start-1 col-end-4    text-gray-300 border-gray-300  border-2 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
            key={index}
          >
            <h1 className=" mt-1 mb-1 first-letter:uppercase italic font-medium">
              {m.chat}.
            </h1>
          </div>
        ) : (
          <div
            onClick={() => handleSelfChatInfo(m)}
            ref={messagesEndRef}
            className=" cursor-pointer relative col-start-1 col-end-4    text-gray-300 border-gray-300  border-2 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
            key={index}
          >
            <h1 className=" mt-1 mb-1 first-letter:uppercase italic font-medium">
              Image/Video/Audio has been unsent.
            </h1>
          </div>
        )
      ) : (
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
          {m.chat && m.chat.includes('mp4') && m.chat.includes('video') ? (
            <video width="320" height="240" muted controls>
              <source src={m.chat} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
          )}
        </div>
      )}
    </>
  );
}
