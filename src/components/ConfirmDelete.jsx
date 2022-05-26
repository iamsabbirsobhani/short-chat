import { useEffect } from "react";
export default function ConfirmDelete({
  toggleConfirmDelete,
  dispatch,
  postId,
  socket,
}) {
  //   useEffect(() => {
  //     console.log(postId);
  //   }, [postId]);

  function deletePost() {
    console.log(postId);
    socket.emit("social-post-delete", postId);
    dispatch(toggleConfirmDelete());
  }

  return (
    <>
      <div className="  fixed  w-full h-full backdrop-blur-md z-40  left-0 right-0 top-0 bottom-0"></div>
      <div className="card fixed flex justify-center items-center z-50 w-[280]   top-0 left-0 right-0 bottom-0 ">
        <div className="flex w-60 flex-col bg-red-500 text-white p-2 rounded-sm shadow-md">
          <h1 className="  text-lg">Are you sure want to delete?</h1>
          <div className=" flex justify-between mt-3">
            <button
              className=" bg-gray-100/50 rounded-sm p-2 shadow-md font-semibold"
              onClick={() => deletePost()}
            >
              Yes
            </button>
            <button
              className="bg-green-500/80 rounded-sm p-2 shadow-md font-semibold"
              onClick={() => {
                dispatch(toggleConfirmDelete());
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
