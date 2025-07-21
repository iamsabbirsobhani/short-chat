import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
  setChatInfo,
  setDelLoading,
  setOpenChatInfo,
} from '../../features/state/globalState';

export default function ChatInfo({ props }) {
  const chatInfo = useSelector((state) => state.global.chatInfo);
  const token = useSelector((state) => state.global.token);
  const delLoading = useSelector((state) => state.global.delLoading);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setOpenChatInfo(false));
    dispatch(setChatInfo(null));
  };

  const handleDelete = () => {
    dispatch(setDelLoading(true));
    props.socket.emit('deleteMongoChat', chatInfo?._id, chatInfo);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-white text-lg sm:text-xl font-semibold">
          Message Info
        </h2>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors duration-200 p-1"
        >
          <ion-icon name="close" className="text-xl sm:text-2xl"></ion-icon>
        </button>
      </div>

      {/* Message Details */}
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
          <p className="text-white/60 text-xs sm:text-sm">Sender UID</p>
          <p className="text-white font-medium text-sm sm:text-base break-all">
            {chatInfo?.uId}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
          <p className="text-white/60 text-xs sm:text-sm">Sender Name</p>
          <p className="text-white font-medium text-sm sm:text-base">
            {chatInfo?.name}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
          <p className="text-white/60 text-xs sm:text-sm">Packet UID</p>
          <p className="text-white font-medium text-xs sm:text-sm break-all">
            {chatInfo?._id}
          </p>
        </div>

        {chatInfo?.email && (
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm">Email</p>
            <p className="text-white font-medium text-sm sm:text-base break-all">
              {chatInfo?.email}
            </p>
          </div>
        )}

        {chatInfo?.chat && (
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-2">Message</p>
            <div className="bg-white/10 rounded-lg p-2 sm:p-3">
              <p className="text-white break-words text-sm sm:text-base">
                {chatInfo?.chat}
              </p>
            </div>
          </div>
        )}

        {chatInfo?.url && (
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-2">Media URL</p>
            <div className="bg-white/10 rounded-lg p-2 sm:p-3">
              <p className="text-white break-all text-xs sm:text-sm">
                {chatInfo?.url}
              </p>
            </div>
          </div>
        )}

        {token.id === 301 && chatInfo?.deletedMsg && (
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-2">
              Deleted Message
            </p>
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 sm:p-3">
              <p className="text-red-300 text-sm sm:text-base break-words overflow-hidden">
                {chatInfo?.deletedMsg}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-2 sm:p-3">
          <p className="text-white/60 text-xs sm:text-sm">Timestamp</p>
          <p className="text-white font-medium text-xs sm:text-sm">
            {format(new Date(chatInfo?.createdAt), 'PPPPpp')}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 sm:mt-6">
        {token.id === chatInfo?.uId && chatInfo?.deletedMsg?.length <= 0 ? (
          !delLoading ? (
            <button
              onClick={handleDelete}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <ion-icon
                name="trash"
                className="text-base sm:text-lg"
              ></ion-icon>
              <span>Unsend Message</span>
            </button>
          ) : (
            <div className="w-full bg-gray-500/50 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Deleting...</span>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
