import { useSelector, useDispatch } from 'react-redux';
import { setIsOnlineStatusPopupOpen } from '../../features/state/globalState';

export default function OnlineStatusPopup({ name }) {
  const isOnlineStatusPopupOpen = useSelector(
    (state) => state.global.isOnlineStatusPopupOpen,
  );
  const dispatch = useDispatch();
  console.log(name);
  return (
    <>
      <div
        className={`w-full h-full  fixed z-50 left-0 right-0 top-0 bottom-0 ${
          name ? 'bg-gray-50' : 'bg-red-500'
        }`}
      ></div>
      <div
        onClick={() => dispatch(setIsOnlineStatusPopupOpen(false))}
        className={`z-50 left-0 right-0 top-0 bottom-0 fixed  w-[50vw] m-auto flex justify-center h-[50vh] items-center rounded-md ${
          name ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      >
        <p className="z-50 text-gray-800 font-bold text-xl">Online</p>
      </div>
    </>
  );
}
