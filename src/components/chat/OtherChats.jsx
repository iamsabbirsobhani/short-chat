export default function OtherChats({
  handleOtherChatInfo,
  messagesEndRef,
  m,
  index,
}) {
  return (
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

        {m.chat && m.chat.includes('mp4') && m.chat.includes('video') ? (
          <video width="320" height="240" muted controls>
            <source src={m.chat} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
        )}
      </div>
    </div>
  );
}
