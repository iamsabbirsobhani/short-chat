import TypingIndicator from '../../components/TypingIndicator';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
export default function ChatTypingForm({
  isTypings,
  sendMsg,
  ismenu,
  siteStatus,
  token,
  inputFile,
  setismenu,
  handleChat,
  id,
  handleUpload,
}) {
  const permit = useSelector((state) => state.global.adminPermissions);
  return (
    <>
      {true ? (
        <form
          onSubmit={sendMsg}
          className=" relative  mb-3 text-center 2xl:max-w-[600px] xl:max-w-[600px] lg:max-w-[600px] md:max-w-[600px] max-w-xs m-auto mt-5"
        >
          <div>
            {isTypings && isTypings.isTyping && isTypings.id != id ? (
              <TypingIndicator />
            ) : null}
            {/* <TypingIndicator /> */}
          </div>

          <div className=" relative">
            {true ? (
              <div className=" rounded-full absolute left-3 top-1.5">
                {ismenu ? (
                  <div className="backdrop-blur-md shadow-lg transition-opacity duration-500 flex  justify-between w-24 p-1 rounded-md absolute bottom-11 -left-2 z-50">
                    <div className="cursor-pointer w-10 h-10 rounded-full flex justify-center items-center">
                      <label
                        htmlFor="audio-file"
                        className=" cursor-pointer text-white text-xl"
                      >
                        <ion-icon name="mic-outline"></ion-icon>
                      </label>
                      {(permit && permit.fileInput) ||
                      (token && token.admin) ? (
                        <input
                          className=" hidden"
                          type="file"
                          accept="audio/*"
                          name="audio-file"
                          id="audio-file"
                          onChange={(e) => handleUpload(e)}
                        />
                      ) : (
                        <input
                          className=" hidden"
                          type="file"
                          accept="audio/*"
                          disabled
                          name="audio-file"
                          id="audio-file"
                          onChange={(e) => handleUpload(e)}
                        />
                      )}
                    </div>
                    <label htmlFor="chatField">
                      <div className="text-gray-50 p-2 cursor-pointer   w-10 h-10 rounded-full left-7 top-1.5">
                        <label
                          htmlFor="file-input"
                          className=" cursor-pointer "
                        >
                          <ion-icon name="image"></ion-icon>
                        </label>
                        {(permit && permit.fileInput) ||
                        (token && token.admin) ? (
                          <input
                            className=" hidden w-9 cursor-pointer"
                            type="file"
                            accept="image/*,video/*"
                            name=""
                            id="file-input"
                            ref={inputFile}
                            onChange={(e) => handleUpload(e)}
                          />
                        ) : (
                          <input
                            className=" hidden w-9  cursor-pointer"
                            type="file"
                            accept="image/*,video/*"
                            name=""
                            disabled
                            maxLength={permit.inputMaxLength}
                            id="file-input"
                            ref={inputFile}
                            onChange={(e) => handleUpload(e)}
                          />
                        )}
                      </div>
                    </label>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setismenu(!ismenu);
                  }}
                  className=" w-9 h-9 text-gray-300 hover:text-gray-400"
                >
                  <ion-icon name="document-outline"></ion-icon>
                </button>
              </div>
            ) : (
              <div className=" rounded-full absolute left-7 top-1.5">
                <button
                  type="button"
                  disabled
                  className=" absolute w-9 h-9 rounded-full text-white"
                >
                  <ion-icon name="document-outline"></ion-icon>
                </button>
              </div>
            )}

            {(permit && permit.chatInput) || (token && token.admin) ? (
              <input
                className=" bg-gray-600 text-white outline-none w-full py-3 pl-[60px] pr-12 p-10  rounded-md "
                type="text"
                name="chatField"
                onChange={(e) => handleChat(e)}
                placeholder="Message..."
                autoComplete="off"
              />
            ) : permit && !permit.chatInput && permit.inputMaxLength > 0 ? (
              <input
                className=" bg-gray-600 text-white outline-none w-full py-3 pl-[60px] pr-12 p-10  rounded-md "
                type="text"
                name="chatField"
                maxLength={permit.inputMaxLength}
                onChange={(e) => handleChat(e)}
                placeholder="Message..."
                autoComplete="off"
              />
            ) : (
              <input
                className=" bg-gray-600 text-white outline-none w-full py-3 pl-[60px] pr-12 p-10  rounded-md "
                type="text"
                name="chatField"
                disabled
                onChange={(e) => handleChat(e)}
                placeholder="Message..."
                autoComplete="off"
              />
            )}
            <button
              type="submit"
              className="  h-9 w-9 p-2 text-gray-300 absolute right-[10px] top-[6px] hover:text-gray-400"
            >
              <ion-icon name="send"></ion-icon>
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
}
