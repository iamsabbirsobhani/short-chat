import { useState, useEffect } from "react";
import { format } from "date-fns";
import ConfirmDelete from "./ConfirmDelete";
import { useSelector, useDispatch } from "react-redux";
import { toggleConfirmDelete } from "../features/state/globalState";
export default function Posts({
  posts,
  isLoading,
  socket,
  events,
  setfetchOnce,
  socialRef,
}) {
  const [postId, setpostId] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.global.token);
  const confirmDelete = useSelector((state) => state.global.confirmDelete);

  return (
    <>
      <div className=" ">
        {posts &&
          posts.rows.map((post) =>
            post.imgUrl && post.post ? (
              <div
                className=" mb-7 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800 relative shadow-md"
                key={post.id}
              >
                <div className=" flex  justify-between absolute -top-4  bg-gray-800/80 rounded-sm px-3 py-1">
                  <h1 className=" uppercase font-semibold shadow-md text-white antialiased tracking-wider">
                    {post.postedBy}
                  </h1>
                </div>
                {post.UserId === token.id ? (
                  <div className="ml-auto mr-0 w-[30px] text-center">
                    <button
                      onClick={() => {
                        dispatch(toggleConfirmDelete());
                        setpostId(post.id);
                      }}
                      className=" text-white bg-red-500 rounded-sm w-6"
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                  </div>
                ) : null}
                <div>
                  <div className="break-words bg-gray-800/20 p-2 py-3  rounded-sm">
                    <div>
                      <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                        {post.post}
                      </p>
                      <div className=" h-min">
                        <img src={post.imgUrl} alt="" />
                      </div>
                    </div>
                    <div className=" mt-2 flex-row-reverse flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400">
                          {format(new Date(post.createdAt), "PPPp")}
                        </p>
                      </div>
                      <div className=" flex items-center text-white text-xl ">
                        <div
                          onClick={() => {
                            setfetchOnce(true);
                            socket.emit("heart", post.id);
                          }}
                          className=" text-red-500 flex items-center cursor-pointer"
                        >
                          <ion-icon name="heart"></ion-icon>
                          <p className=" text-xs  ml-1 mr-1">{post.heart}</p>
                        </div>
                        <div
                          onClick={() => {
                            setfetchOnce(true);
                            socket.emit("happy", post.id);
                          }}
                          className=" text-yellow-500  flex items-center cursor-pointer"
                        >
                          <ion-icon name="happy"></ion-icon>
                          <p className=" text-xs  ml-1 mr-1">{post.happy}</p>
                        </div>
                        <div
                          onClick={() => {
                            setfetchOnce(true);
                            socket.emit("sad", post.id);
                          }}
                          className=" text-blue-500 flex items-center cursor-pointer"
                        >
                          <ion-icon name="sad"></ion-icon>
                          <p className=" text-xs ml-1 mr-1">{post.sad}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : post.imgUrl ? (
              <div
                className=" mb-7  p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800"
                key={post.id}
              >
                <div className="absolute -top-4  bg-gray-800/80 rounded-sm px-3 py-1">
                  <h1 className=" uppercase font-semibold shadow-md text-white antialiased tracking-wider">
                    {post.postedBy}
                  </h1>
                </div>
                {post.uId === token.id ? (
                  <div className="ml-auto mr-0 w-[30px] text-center">
                    <button
                      onClick={() => {
                        dispatch(toggleConfirmDelete());
                        setpostId(post.id);
                      }}
                      className=" text-white bg-red-500 rounded-sm w-6"
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                  </div>
                ) : null}
                <div>
                  <div className="break-words py-3 bg-gray-800/20 p-2 rounded-sm">
                    <div>
                      <img loading="lazy" src={post.imgUrl} alt="" />
                    </div>
                    <div className=" mt-2 flex-row-reverse flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400">
                          {format(new Date(post.createdAt), "PPPp")}
                        </p>
                      </div>
                      <div className=" flex items-center text-white text-xl ">
                        <div
                          onClick={() => {
                            setfetchOnce(true);
                            socket.emit("heart", post.id);
                          }}
                          className=" text-red-500 flex items-center cursor-pointer"
                        >
                          <ion-icon name="heart"></ion-icon>
                          <p className=" text-xs  ml-1 mr-1">{post.heart}</p>
                        </div>
                        <div
                          onClick={() => {
                            setfetchOnce(true);
                            socket.emit("happy", post.id);
                          }}
                          className=" text-yellow-500  flex items-center cursor-pointer"
                        >
                          <ion-icon name="happy"></ion-icon>
                          <p className=" text-xs  ml-1 mr-1">{post.happy}</p>
                        </div>
                        <div
                          onClick={() => {
                            setfetchOnce(true);
                            socket.emit("sad", post.id);
                          }}
                          className=" text-blue-500 flex items-center cursor-pointer"
                        >
                          <ion-icon name="sad"></ion-icon>
                          <p className=" text-xs ml-1 mr-1">{post.sad}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className=" mb-7  p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800"
                key={post.id}
              >
                <div className="absolute -top-4  bg-gray-800/80 rounded-sm px-3 py-1">
                  <h1 className="uppercase font-semibold shadow-md text-white antialiased tracking-wider">
                    {post.postedBy}
                  </h1>
                </div>
                {post.uId === token.id ? (
                  <div className="ml-auto mr-0 w-[30px] text-center">
                    <button
                      onClick={() => {
                        dispatch(toggleConfirmDelete());
                        setpostId(post.id);
                      }}
                      className=" text-white bg-red-500 rounded-sm w-6"
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                  </div>
                ) : null}
                <div>
                  <div className="break-words bg-gray-800/20 p-2 rounded-sm py-3">
                    <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                      {post.post}
                    </p>
                  </div>
                  <div className=" flex-row-reverse flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400">
                        {format(new Date(post.createdAt), "PPPp")}
                      </p>
                    </div>
                    <div className=" flex items-center text-white text-xl ">
                      <div
                        onClick={() => {
                          setfetchOnce(true);
                          socket.emit("heart", post.id);
                        }}
                        className=" text-red-500 flex items-center cursor-pointer"
                      >
                        <ion-icon name="heart"></ion-icon>
                        <p className=" text-xs  ml-1 mr-1">{post.heart}</p>
                      </div>
                      <div
                        onClick={() => {
                          setfetchOnce(true);
                          socket.emit("happy", post.id);
                        }}
                        className=" text-yellow-500  flex items-center cursor-pointer"
                      >
                        <ion-icon name="happy"></ion-icon>
                        <p className=" text-xs  ml-1 mr-1">{post.happy}</p>
                      </div>
                      <div
                        onClick={() => {
                          setfetchOnce(true);
                          socket.emit("sad", post.id);
                        }}
                        className=" text-blue-500 flex items-center cursor-pointer"
                      >
                        <ion-icon name="sad"></ion-icon>
                        <p className=" text-xs ml-1 mr-1">{post.sad}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
      <div className=" confirm-delete">
        {confirmDelete ? (
          <ConfirmDelete
            events={events}
            dispatch={dispatch}
            toggleConfirmDelete={toggleConfirmDelete}
            postId={postId}
            socket={socket}
          />
        ) : null}
      </div>
    </>
  );
}
