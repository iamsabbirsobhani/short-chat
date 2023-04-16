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
    console.log(token);
    dispatch(setOpenChatInfo(false));
    dispatch(setChatInfo(null));
  };

  const handleDelete = () => {
    console.log({ chatInfo });
    dispatch(setDelLoading(true));
    props.socket.emit('deleteMongoChat', chatInfo?._id, chatInfo);
  };
  return (
    <>
      <div className=" font-mono bg-gray-700 p-2 text-gray-50 2xl:max-w-2xl xl:max-w-2xl  lg:max-w-2xl md:max-w-xs sm:max-w-xs max-w-xs  rounded-sm shadow-md break-words ">
        <div className=" text-right">
          <button onClick={handleClose} className=" text-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        <p>Sender UID: {chatInfo?.uId}</p>
        <h1>Sender: {chatInfo?.name}</h1>
        <p>Packet UID: {chatInfo?._id}</p>
        {chatInfo?.email ? <p>Email: {chatInfo?.email}</p> : null}
        {chatInfo?.chat ? (
          <div>
            <p>Msg:</p>
            <div className=" bg-stone-900 p-2 rounded-sm break-words shadow-md">
              {chatInfo?.chat}
            </div>
          </div>
        ) : null}
        {chatInfo?.url ? (
          <div>
            <p>URL:</p>
            <div className=" bg-stone-900 p-2 rounded-sm break-words shadow-md">
              {chatInfo?.url}
            </div>
          </div>
        ) : null}

        {token.id === 32 && chatInfo?.deletedMsg ? (
          <div>
            <p>Deleted Msg:</p>
            <div className=" bg-rose-600 p-2 rounded-sm shadow-md">
              <h1 className="">{chatInfo?.deletedMsg}</h1>
            </div>
          </div>
        ) : null}
        <p className="">
          Received: {format(new Date(chatInfo?.createdAt), 'PPPPpp')}
        </p>

        <div className="mt-5">
          {(token.id === chatInfo?.uId) &
          (chatInfo?.deletedMsg?.length <= 0) ? (
            !delLoading ? (
              <button
                onClick={handleDelete}
                className="flex items-center text-red-500 bg-gray-50 font-bold p-2 rounded-sm shadow-md"
              >
                <h1>Delete!</h1>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=" w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="flex items-center text-red-500 bg-gray-50 font-bold p-2 rounded-sm shadow-md"
                disabled
              >
                <h1>Deleting...</h1>
                <div className="animate-spin">
                  <ion-icon name="reload"></ion-icon>
                </div>
              </button>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
