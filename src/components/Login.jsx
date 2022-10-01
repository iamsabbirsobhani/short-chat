export default function Login({
  handleLogin,
  isError,
  state,
  isWrong,
  isLodaing,
}) {
  return (
    <>
      {/* <div className=" fixed w-full h-full left-0 right-0 bottom-0 top-0  backdrop-blur-xl z-50"></div>

      <div className=" z-[60] absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center">
        <form
          className=" shadow-lg p-5 w-80 bg-gray-900 flex flex-col rounded-sm"
          onSubmit={handleLogin}
        >
          <input
            className=" shadow-md rounded-sm p-2 pl-3 text-gray-900 outline-none"
            type="password"
            required
            placeholder="type code..."
          />

          {isError ? (
            <div className=" mt-2 text-red-500 font-semibold tracking-wide">
              <h1>{isError.error}</h1>
            </div>
          ) : isWrong ? (
            <div className=" mt-2 text-red-500 font-semibold tracking-wide">
              <h1>Wrong Code</h1>
            </div>
          ) : null}

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
      </div> */}
    </>
  );
}
