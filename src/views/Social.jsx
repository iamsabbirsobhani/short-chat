import Posts from "../components/Posts";
import file from "../assets/woman-6676901_960_720.jpg";
import { useRef, useEffect } from "react";

export default function Social() {
  const socialRef = useRef(null);

  //   on scroll bottom
  const getRef = () => {
    if (
      socialRef.current.scrollTop + socialRef.current.clientHeight ===
      socialRef.current.scrollHeight
    ) {
      console.log("Your have reached end");
    }
  };

  return (
    <>
      <div
        onScroll={() => getRef()}
        ref={socialRef}
        className=" fixed top-14 bottom-0 break-words p-3 py-3 right-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2  backdrop-blur-md overflow-y-scroll"
      >
        <div className="postbox flex flex-col  m-auto border-[1px] border-gray-600/50 p-2">
          <input
            className=" p-2 px-4 rounded-sm outline-none bg-gray-800/40 text-white"
            type="text"
            name=""
            id=""
            placeholder="Share random thought..."
          />
          <div className=" flex items-center mt-3">
            <div className="input-media-file  w-8 flex justify-center items-center h-8 rounded-md transition duration-300  backdrop-blur-md cursor-pointer border-gray-600 border-[1px]">
              <label
                htmlFor="file-input"
                className=" text-violet-500 cursor-pointer mt-1"
              >
                <ion-icon name="image"></ion-icon>
              </label>
              <input
                className=" hidden"
                type="file"
                accept="image/png"
                src=""
                alt=""
              />
            </div>
            <div className="  w-11 ml-3 relative">
              <div className=" h-5  absolute -right-2 -top-2 text-white hover:text-red-500 transition duration-200 cursor-pointer shadow-md">
                <ion-icon name="close-circle-outline"></ion-icon>
              </div>
              <img className=" rounded-md" src={file} alt="" />
            </div>
          </div>
          <button className="  uppercase font-semibold tracking-wider text-white bg-blue-400 py-1 px-4 rounded-sm mt-3">
            Post
          </button>
        </div>

        <div className="posts mt-5">
          <Posts />
        </div>
      </div>
    </>
  );
}
