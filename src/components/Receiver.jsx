import hacker from "../assets/hacker.png";
import { useState } from "react";
import { useRef, useEffect } from "react";

function useOutsideAlerter(ref) {
  const [state, setstate] = useState("");
  function shakeControl() {
    setstate("shake-horizontal");
    setTimeout(() => {
      setstate("");
    }, 700);
  }
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        shakeControl();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return state;
}
export default function Receiver({ callEnd }) {
  const wrapperRef = useRef(null);
  //   useOutsideAlerter(wrapperRef);
  return (
    <>
      <div className=" cursor-pointer fixed h-full z-30 text-white left-0 top-0 right-0 bottom-0 bg backdrop-blur-sm"></div>
      <div className="slide-in-top bg-none  shadow-xl absolute z-40  top-0 right-0 left-0 bottom-0  text-white  flex justify-center items-center ">
        <div
          ref={wrapperRef}
          className={`w-80  rounded-xl p-7 bg-indigo-900 relative
            ${useOutsideAlerter(wrapperRef)}`}
        >
          <h1 className=" text-lg font-semibold text-center">
            <span className=" animate-pulse"> Incoming Call</span>
          </h1>
          <div className="text-center flex justify-center mt-9 mb-20 animate-bounce">
            <img className=" w-16 border-4 rounded-full" src={hacker} alt="" />
          </div>
          <div className=" absolute right-0 left-0 bottom-3 flex  justify-around">
            {/* receive call */}
            <div className=" cursor-pointer text-white-600 bg-green-600 w-14 h-14 ml-5 rounded-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            {/* reject call */}
            <div
              onClick={callEnd}
              className=" cursor-pointer text-white-600 bg-red-600 w-14 h-14 rounded-full mr-5 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
