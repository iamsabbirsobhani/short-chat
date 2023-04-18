import OtherChats from './OtherChats';
import SelfChats from './SelfChats';

export default function Chats({
  msg,
  handleOlderMessage,
  olderMsgLoading,
  token,
  messagesEndRef,
  handleSelfChatInfo,
  handleOtherChatInfo,
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
              <SelfChats
                key={index}
                m={m}
                messagesEndRef={messagesEndRef}
                index={index}
                handleSelfChatInfo={handleSelfChatInfo}
              />
            ) : (
              <OtherChats
                key={index}
                messagesEndRef={messagesEndRef}
                m={m}
                index={index}
                handleOtherChatInfo={handleOtherChatInfo}
              />
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
