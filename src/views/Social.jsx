import Posts from "../components/Posts";
import file from "../assets/woman-6676901_960_720.jpg";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fileUpload } from "../composable/fileUpload";
import {
  socialPaginationIncrement,
  setSocialPagination,
} from "../features/state/globalState";

const postAPI = "https://short-chat-backend.herokuapp.com/social/";
const postsAPI = "https://short-chat-backend.herokuapp.com/socials/";

export default function Social(props) {
  const name = useSelector((state) => state.global.name);
  const page = useSelector((state) => state.global.socialPagination);
  const dispatch = useDispatch();
  const socialRef = useRef(null);
  const inputText = useRef(null);
  const inputFile = useRef(null);

  const [posts, setposts] = useState(null);
  const [post, setpost] = useState(null);
  const [imgUrl, setimgUrl] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [url, setUrl] = useState(null);
  const [fetchOnce, setfetchOnce] = useState(false);

  const [isLoading, setisLoading] = useState(false);

  async function getPosts() {
    setisLoading(true);
    const response = await axios.get(postsAPI + page, {
      headers: { code: 1379 },
    });
    const finalRes = await response.data;
    setposts(finalRes);

    setisLoading(false);
    // console.log(finalRes);
  }

  //   on scroll bottom
  const getRef = () => {
    if (
      socialRef.current.scrollTop + socialRef.current.clientHeight ===
      socialRef.current.scrollHeight
    ) {
      console.log("Your have reached end");
      dispatch(socialPaginationIncrement());
      console.log(page);
      getPosts();
    }
  };

  const sumbitPost = async () => {
    console.log(page);
    const data = {
      postedBy: name,
      post: post,
      imgUrl: url,
    };
    try {
      setfetchOnce(true);
      props.socket.emit("social-post", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e) => {
    console.log(e.target.files[0], "sdf");
    await fileUpload(e.target.files[0], setUploading, setUrl);
    console.log(url);
  };

  useEffect(() => {
    console.log("Social mounted");
    dispatch(socialPaginationIncrement());
    getPosts();
    console.log(page);
    return () => {
      console.log("Social dismounted");
      dispatch(setSocialPagination(8));
    };
  }, []);

  useEffect(() => {
    if (fetchOnce) {
      props.socket.on("social-post", function () {
        console.log("Execute once");
        getPosts();
        if (inputText) {
          inputText.current.value = null;
        }
        if (inputFile) {
          inputFile.current.value = null;
        }
        setpost(null);
        setUrl(null);
        setfetchOnce(false);
      });
    }
  });

  return (
    <>
      <div
        onScroll={() => getRef()}
        ref={socialRef}
        className=" fixed top-14 bottom-0 break-words p-3 py-3 right-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2  backdrop-blur-md overflow-y-scroll"
      >
        <div className="postbox flex flex-col  m-auto shadow-md  border-gray-600/50 p-2">
          <input
            className=" p-2 px-4 rounded-sm outline-none bg-gray-800/40 text-white"
            type="text"
            name=""
            id=""
            placeholder="Share random thought..."
            onChange={(e) => setpost(e.target.value)}
            ref={inputText}
          />
          <div className=" flex items-center mt-3">
            <div className="input-media-file  w-8 flex justify-center items-center h-8 rounded-md transition duration-300  backdrop-blur-md cursor-pointer border-gray-600 border-[1px]">
              <label
                htmlFor="social-file"
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
                id="social-file"
                ref={inputFile}
                onChange={(e) => handleUpload(e)}
              />
            </div>
            {url && (
              <div className="  w-11 ml-3 relative">
                <div className=" h-5  absolute -right-2 -top-2 text-white hover:text-red-500 transition duration-200 cursor-pointer shadow-md">
                  <ion-icon name="close-circle-outline"></ion-icon>
                </div>
                <img className=" rounded-md" src={url} alt="" />
              </div>
            )}
            {uploading > 0 && uploading !== 100 && (
              <div className=" loading flex ml-1 items-center">
                <div className=" w-1 h-5 bg-white ml-1 animate-pulse"></div>
                <div className=" w-1 h-6 bg-white ml-1 animate-pulse delay-75"></div>
                <div className=" w-1 h-5 bg-white ml-1 animate-pulse delay-100"></div>
              </div>
            )}
          </div>
          <button
            onClick={() => sumbitPost()}
            className="  uppercase font-semibold tracking-wider text-white bg-blue-400 py-1 px-4 rounded-sm mt-3"
          >
            Post
          </button>
        </div>

        <div className="posts mt-10">
          {!posts && (
            <div className=" text-center text-white mt-5 mb-5">
              <h1>Loading...</h1>
            </div>
          )}
          <Posts posts={posts} isLoading={isLoading} />
          {isLoading && posts && posts.rows.length < posts.count && (
            <div className=" m-auto text-center font-semibold bg-gray-900/50 w-40 p-3 rounded-md uppercase shadow-md">
              <h1 className=" animate-pulse text-white">Loading more...</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
