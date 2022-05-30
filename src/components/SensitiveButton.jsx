import { setSensitiveContent } from "../features/state/globalState";
import { useSelector, useDispatch } from "react-redux";

export default function SensitiveButton({ sensitiveHandle, id }) {
  const sensitiveContent = useSelector(
    (state) => state.global.sensitiveContent
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className=" mt-2 mb-2">
        {sensitiveContent ? (
          <div
            onClick={() => {
              dispatch(setSensitiveContent(false));
              sensitiveHandle(id);
            }}
            className=" cursor-pointer bg-gray-700 w-full flex justify-between p-3 items-center text-xl rounded-sm shadow-md text-gray-400"
          >
            <p>Content Explicit</p>
            <ion-icon name="eye-off-outline"></ion-icon>
          </div>
        ) : (
          <div
            onClick={() => {
              dispatch(setSensitiveContent(true));
              sensitiveHandle(id);
            }}
            className=" cursor-pointer bg-gray-700 w-full flex justify-between p-3 items-center text-xl rounded-sm shadow-md text-gray-400"
          >
            <p>Hide Content</p>
            <ion-icon name="eye-outline"></ion-icon>
          </div>
        )}
      </div>
    </>
  );
}
