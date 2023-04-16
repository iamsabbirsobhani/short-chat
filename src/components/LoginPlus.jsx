import { useState } from 'react';
export default function LoginPlus({
  handleSharedPictures,
  isWrong,
  isLodaing,
  imageError,
  openLogin,
}) {
  const [unlock, setunlock] = useState({ handleSharedPictures });

  return (
    <>
      <div className=" fixed w-full h-full left-0 right-0 bottom-0 top-0  backdrop-blur-sm z-[49]"></div>
      <div
        onClick={openLogin}
        className=" z-[70] close-btn absolute top-5 right-5 text-white cursor-pointer rounded-md bg-white/10 w-8 h-8 flex justify-center items-center backdrop-blur-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className=" z-[51] fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center">
        <form
          className=" shadow-lg p-5 w-80 bg-gray-900 flex flex-col rounded-sm"
          onSubmit={(e) => handleSharedPictures(e)}
        >
          <input
            className=" shadow-md rounded-sm p-2 pl-3 text-gray-900 outline-none"
            type="password"
            required
            placeholder="type code..."
          />

          {imageError && (
            <div className=" mt-2 text-red-500 font-semibold tracking-wide">
              <h1>{imageError}</h1>
            </div>
          )}

          <div className=" text-center">
            {isLodaing ? (
              <button className=" shadow-md w-40 text-white rounded-sm bg-sky-500 p-3 transition duration-200 mt-4 uppercase font-semibold hover:bg-sky-600">
                <div className="border-4 flex justify-center items-center   border-t-4 border-t-gray-500 border-white animate-spin  relative m-auto h-6 w-6 bg-sky-500 rounded-full"></div>
              </button>
            ) : (
              <button className=" shadow-md w-40 text-white rounded-sm bg-sky-500 p-3 transition duration-200 mt-4 uppercase font-semibold hover:bg-sky-600">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
