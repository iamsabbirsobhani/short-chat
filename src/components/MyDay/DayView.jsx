import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setImageIndex } from "../../features/state/globalState";
import "../../styles/dayview.scss";
export default function DayView(props) {
  const imageIndex = useSelector((state) => state.global.imageIndex);
  const dispatch = useDispatch();

  const allDay = [
    {
      id: 1,
      userId: 17,
      userName: "Albion",
      imgUrl:
        "https://images.unsplash.com/photo-1495063378081-52411c3eedf1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      like: 0,
      comment: null,
    },
    {
      id: 2,
      userId: 17,
      userName: "Albion",
      imgUrl:
        "https://images.unsplash.com/photo-1565294124524-200bb738cdb7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=573&q=80",
      like: 0,
      comment: null,
    },
    {
      id: 3,
      userId: 17,
      userName: "Albion",
      imgUrl:
        "https://images.unsplash.com/photo-1592399668789-6432393d5761?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      like: 0,
      comment: null,
    },
    {
      id: 4,
      userId: 17,
      userName: "Albion",
      imgUrl:
        "https://images.unsplash.com/photo-1589881787083-0fcfec1db918?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=266&q=80",
      like: 0,
      comment: null,
    },
  ];

  const nextImage = () => {
    if (imageIndex < allDay.length - 1) {
      dispatch(setImageIndex(imageIndex + 1));
      console.log(imageIndex, allDay.length);
      console.log(allDay[imageIndex].imgUrl);
    }
  };
  const prevImage = () => {
    if (imageIndex > 0) {
      dispatch(setImageIndex(imageIndex - 1));
      console.log(imageIndex, allDay.length);
      console.log(allDay[imageIndex].imgUrl);
    }
    console.log();
  };

  useEffect(() => {
    return () => {
      dispatch(setImageIndex(0));
    };
  }, []);
  return (
    <>
      <div className=" w-full fixed h-full backdrop-blur-md top-0 left-0 right-0 bottom-0 z-40"></div>
      <div className="day-viewer text-white z-50 fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center">
        <div className=" absolute right-4 top-4">
          <button
            onClick={() => {
              props.setdayView(false);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-md opacity-70 hover:opacity-100 relative z-[60]"
          >
            Close
          </button>
        </div>
        <div className=" relative">
          <div className=" z-[70] flex w-full justify-between absolute top-[50%]">
            <button
              onClick={() => {
                prevImage();
              }}
              className="rounded-md ml-2 bg-gradient-to-r from-sky-500 opacity-50 hover:opacity-100 to-indigo-500 p-2"
            >
              Prev
            </button>
            <button
              onClick={() => {
                nextImage();
              }}
              className=" rounded-md mr-2 bg-gradient-to-r from-cyan-500 to-blue-500 p-2 opacity-50 hover:opacity-100"
            >
              Next
            </button>
          </div>
          <div className=" fade-in flex justify-center items-center">
            <img
              className=" rounded-md w-full h-full object-contain"
              src={allDay[imageIndex].imgUrl}
              alt=""
            />
          </div>
        </div>
        <form
          className=" absolute bottom-2 flex w-full justify-around items-center "
          action=""
        >
          <input
            className="text-black px-3 p-2 rounded-md outline-none"
            type="text"
            placeholder="Say something"
          />
          <button>
            <ion-icon name="send"></ion-icon>
          </button>
        </form>
      </div>
    </>
  );
}
