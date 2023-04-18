import { useEffect, useState } from 'react';

export default function SelfChats({
  messagesEndRef,
  m,
  index,
  handleSelfChatInfo,
}) {
  const [isBlur, setisBlur] = useState(true);
  const handleImgOnLoad = () => {
    console.log('Image Loaded!');
  };

  const handleBlurImage = () => {
    setisBlur(!isBlur);
  };

  // after 30 seconds, the image will be blurred
  useEffect(() => {
    const timer = setTimeout(() => {
      setisBlur(true);
    }, 10000);
    return () => clearTimeout(timer);
  });

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
      ) : m && m.url ? (
        <div
          ref={messagesEndRef}
          className=" flex flex-row-reverse items-center col-start-1 col-end-4"
          key={index}
        >
          <div className="cursor-pointer relative     text-white bg-emerald-700 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1">
            {m.url && m.url.includes('mp4') && m.url.includes('video') ? (
              <video width="320" height="240" muted controls>
                <source src={m.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : m.url && m.url.includes('audio') ? (
              <audio controls className=" w-44">
                <source src={m.url} type="audio/ogg" />
              </audio>
            ) : m.url && m.url.includes('images') ? (
              <div className=" rounded-md mt-1 mb-1 relative">
                <img
                  className=""
                  loading="lazy"
                  src={m.url}
                  alt=""
                  style={{
                    filter: isBlur ? 'blur(20px)' : 'blur(0px)',
                    transition: 'all 0.24s',
                  }}
                  onLoad={handleImgOnLoad}
                />
                <div
                  style={{ visibility: isBlur ? 'visible' : 'hidden' }}
                  className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
                >
                  <button
                    onClick={handleBlurImage}
                    className=" border-2 rounded-full text-yellow-500 p-2 border-yellow-500 italic hover:text-yellow-600 hover:border-yellow-600 duration-300 shadow-md backdrop-blur-lg font-bold"
                  >
                    Tap to see clear
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div
            onClick={() => handleSelfChatInfo(m)}
            className=" cursor-pointer text-gray-50 mr-4"
          >
            <ion-icon name="ellipsis-horizontal"></ion-icon>
          </div>
        </div>
      ) : m && m.chat ? (
        <div
          onClick={() => handleSelfChatInfo(m)}
          ref={messagesEndRef}
          className=" cursor-pointer relative col-start-1 col-end-4    text-white bg-emerald-700 p-3 rounded-lg xl:max-w-full lg:max-w-full max-w-[300px]  break-words shadow-md ml-auto mr-1"
          key={index}
        >
          {m.chat && m.chat.includes('mp4') && m.chat.includes('video') ? (
            <video width="320" height="240" muted controls>
              <source src={m.chat} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <h1 className=" mt-1 mb-1 ">{m.chat}</h1>
          )}
        </div>
      ) : null}
    </>
  );
}
