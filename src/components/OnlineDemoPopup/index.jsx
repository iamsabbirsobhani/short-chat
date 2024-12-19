import { useSelector, useDispatch } from 'react-redux';
import { setIsOnlineStatusPopupOpen } from '../../features/state/globalState';
export default function OnlineDemoPopup() {
  const isOnlineStatusPopupOpen = useSelector(
    (state) => state.global.isOnlineStatusPopupOpen,
  );
  const dispatch = useDispatch();
  return (
    <div>
      <div className="w-full h-full fixed z-50 left-0 right-0 top-0 bottom-0 bg-gray-50"></div>
      <div
        onClick={() => dispatch(setIsOnlineStatusPopupOpen(false))}
        className="z-50 left-0 right-0 top-0 bottom-0 fixed w-[50vw] m-auto flex justify-center h-[50vh] items-center rounded-md bg-red-500 cursor-pointer"
      >
        <p className="z-50 text-gray-800 font-bold text-xl">Offline</p>
      </div>
    </div>
  );
}
