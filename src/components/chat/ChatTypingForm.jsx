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
        <form onSubmit={sendMsg} className="relative">
          {/* Input Container */}
          <div className="relative">
            {/* Attachment Menu */}
            {true ? (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                {ismenu ? (
                  <div className="absolute bottom-12 left-0 bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-2 border border-white/20">
                    <div className="flex space-x-2">
                      {/* Audio Upload */}
                      <div className="group">
                        <label
                          htmlFor="audio-file"
                          className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <ion-icon
                            name="mic-outline"
                            className="text-white text-lg"
                          ></ion-icon>
                        </label>
                        {(permit && permit.fileInput) ||
                        (token && token.admin) ? (
                          <input
                            className="hidden"
                            type="file"
                            accept="audio/*"
                            name="audio-file"
                            id="audio-file"
                            onChange={(e) => handleUpload(e)}
                          />
                        ) : (
                          <input
                            className="hidden"
                            type="file"
                            accept="audio/*"
                            disabled
                            name="audio-file"
                            id="audio-file"
                            onChange={(e) => handleUpload(e)}
                          />
                        )}
                      </div>

                      {/* Image/Video Upload */}
                      <div className="group">
                        <label
                          htmlFor="file-input"
                          className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <ion-icon
                            name="image"
                            className="text-white text-lg"
                          ></ion-icon>
                        </label>
                        {(permit && permit.fileInput) ||
                        (token && token.admin) ? (
                          <input
                            className="hidden"
                            type="file"
                            accept="image/*,video/*"
                            name=""
                            id="file-input"
                            ref={inputFile}
                            onChange={(e) => handleUpload(e)}
                          />
                        ) : (
                          <input
                            className="hidden"
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
                    </div>
                  </div>
                ) : null}

                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() => {
                    setismenu(!ismenu);
                  }}
                  className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                >
                  <ion-icon name="add" className="text-lg"></ion-icon>
                </button>
              </div>
            ) : (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center w-10 h-10 bg-white/5 text-white/50 rounded-full"
                >
                  <ion-icon name="add" className="text-lg"></ion-icon>
                </button>
              </div>
            )}

            {/* Message Input */}
            {(permit && permit.chatInput) || (token && token.admin) ? (
              <input
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 outline-none py-4 pl-16 pr-16 rounded-2xl border border-white/20 focus:border-white/40 transition-all duration-300"
                type="text"
                name="chatField"
                onChange={(e) => handleChat(e)}
                placeholder="Type your message..."
                autoComplete="off"
              />
            ) : permit && !permit.chatInput && permit.inputMaxLength > 0 ? (
              <input
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 outline-none py-4 pl-16 pr-16 rounded-2xl border border-white/20 focus:border-white/40 transition-all duration-300"
                type="text"
                name="chatField"
                maxLength={permit.inputMaxLength}
                onChange={(e) => handleChat(e)}
                placeholder="Type your message..."
                autoComplete="off"
              />
            ) : (
              <input
                className="w-full bg-white/5 backdrop-blur-sm text-white/50 placeholder-white/30 outline-none py-4 pl-16 pr-16 rounded-2xl border border-white/10 cursor-not-allowed"
                type="text"
                name="chatField"
                disabled
                onChange={(e) => handleChat(e)}
                placeholder="Chat disabled..."
                autoComplete="off"
              />
            )}

            {/* Send Button */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <ion-icon name="send" className="text-lg"></ion-icon>
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
}
