export default function BlockNotice() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 w-72   flex justify-center items-center m-auto">
        <div className="bg-yellow-500 bg-center rounded-sm shadow-md h-80 text-gray-900 bg-cover bg-no-repeat bg-img-maintenance">
          <div className=" break-words antialiased bg-gray-900/50 text-center mt-52 text-yellow-500 font-bold">
            <div className=" text-center text-xl">Will Be Right Back!</div>
            <p className=" mt-3">
              Sorry, this site is down for maintenance but will be back in no
              time!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
