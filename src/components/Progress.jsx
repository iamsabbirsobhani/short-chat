export default function Progress(props) {
  return (
    <>
      {props.uploading ? (
        <div className=" flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 w-72 m-auto z-30 h-56 backdrop-blur-md rounded-md shadow-md p-3">
          <div class="w-full flex bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${props.uploading}%` }}
            >
              {Math.ceil(props.uploading)}%
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
