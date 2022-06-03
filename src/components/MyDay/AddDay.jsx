import { dayFileUpload } from "../../composable/dayFileUpload";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setdayUploadedImages,
  emptyDayUploadedImages,
} from "../../features/state/globalState";

export default function AddDay(props) {
  const allImages = useSelector((state) => state.global.dayUploadedImages);
  const token = useSelector((state) => state.global.token);
  const dispatch = useDispatch();
  const [uploading, setuploading] = useState();
  const [url, seturl] = useState();
  const dayRef = useRef();

  const handleUpload = async (e) => {
    await dayFileUpload(
      e.target.files[0],
      setuploading,
      dispatch,
      setdayUploadedImages,
      token
    );
    dayRef.current.value = "";
  };

  const addDay = async (e) => {
    e.preventDefault();
    props.setisAddDay(false);
    console.log(allImages);
    props.socket.emit(
      "create-day",
      allImages,
      JSON.parse(localStorage.getItem("user"))?.id
    );
    dispatch(emptyDayUploadedImages());
  };

  return (
    <>
      <div className="  backdrop-blur-md shadow-md shadow-gray-500/50 p-2 w-72 min-h-[150px]">
        <h1>Add Day</h1>

        <form onSubmit={addDay} className="mt-3">
          <div className=" flex items-center mb-3">
            <div className=" mt-3">
              <label
                htmlFor="day-file"
                className=" cursor-pointer w-10 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md text-lg"
              >
                <ion-icon name="images-outline"></ion-icon>
              </label>
              <input
                className="hidden"
                id="day-file"
                type="file"
                name="day-file"
                accept="image/*"
                onChange={(e) => handleUpload(e)}
                ref={dayRef}
              />
            </div>
            {uploading ? (
              <div className=" ml-3">
                <h1 className=" font-bold">{uploading}%</h1>
              </div>
            ) : null}
            <div className=" flex ml-3 flex-wrap">
              {allImages
                ? allImages.map((image, index) => (
                    <img
                      className=" ml-3 mt-3 rounded-md w-10 h-10 object-cover"
                      key={index}
                      src={image.imgUrl}
                      alt=""
                    />
                  ))
                : null}
            </div>
          </div>
          <div className=" text-center">
            <button
              type="submit"
              className=" mr-3 p-2 rounded-md font-semibold  bg-indigo-500 shadow-lg shadow-indigo-500/50 hover:bg-indigo-600"
            >
              Add
            </button>
            <button
              type="click"
              onClick={() => {
                props.setisAddDay(false);
                dispatch(emptyDayUploadedImages());
              }}
              className="p-2 rounded-md font-semibold  bg-red-500 shadow-lg shadow-red-500/50 hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
