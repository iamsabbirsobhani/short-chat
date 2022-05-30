import Posts from "../components/Posts";
import file from "../assets/woman-6676901_960_720.jpg";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fileUpload } from "../composable/fileUpload";
import {
  socialPaginationIncrement,
  setSocialPagination,
  setPosts,
} from "../features/state/globalState";

const postAPI = "https://short-chat-backend.herokuapp.com/social/";
const postsAPI = "https://short-chat-backend.herokuapp.com/socials/";

export default function Social(props) {
  const name = useSelector((state) => state.global.name);
  const page = useSelector((state) => state.global.socialPagination);
  const posts = useSelector((state) => state.global.posts);
  const token = useSelector((state) => state.global.token);
  const confirmDelete = useSelector((state) => state.global.confirmDelete);
  const dispatch = useDispatch();
  const socialRef = useRef(null);
  const inputText = useRef(null);
  const inputFile = useRef(null);

  // const [posts, setposts] = useState(null);
  const [post, setpost] = useState("");
  const [postLoading, setpostLoading] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [url, seturl] = useState(null);
  const [fetchOnce, setfetchOnce] = useState(false);
  const [bottom, setbottom] = useState("Not in bottom");

  const [isLoading, setisLoading] = useState(false);

  async function getPosts() {
    setisLoading(true);
    const response = await axios.get(postsAPI + page, {
      headers: { code: 1379 },
    });
    const finalRes = await response.data;
    dispatch(setPosts(finalRes));

    // reset the fields
    if (post !== "" || url !== null) {
      setpost("");
      seturl(null);
      if (url) {
        // console.log("value ", url, url !== null);
        inputFile.current.value = "";
      }
      // reset the fields
    }
    setpostLoading(false);
    setisLoading(false);
  }

  //   on scroll bottom
  let i = 0;
  const getRef = () => {
    if (
      socialRef.current.scrollTop + socialRef.current.clientHeight ===
      socialRef.current.scrollHeight
    ) {
      console.log(`Your have reached end ${i + 1}`);
      setbottom(`Your have reached end ${(i = i + 1)}`);
      dispatch(socialPaginationIncrement());
      // console.log(page);
      getPosts();
    }
  };

  const loadMore = () => {
    dispatch(socialPaginationIncrement());
    getPosts();
  };

  const sumbitPost = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // console.log(page);
    const data = {
      postedBy: token.name,
      post: post,
      imgUrl: url,
      userId: token.id,
      uId: token.id,
    };
    try {
      setfetchOnce(true);
      setpostLoading(true);
      if (post !== "" || url !== null) {
        props.socket.emit("social-post", data);
      } else {
        console.log("Not Posted");
        setpostLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e) => {
    // console.log(e.target.files[0]);
    await fileUpload(e.target.files[0], setUploading, seturl);
    // console.log(url);
  };

  useEffect(() => {
    console.log("Social mounted");
    dispatch(socialPaginationIncrement());
    getPosts();
    // console.log(page);
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
        setfetchOnce(false);
      });
    }
  });

  function handlePost(e) {
    setpost(e.target.value);
  }

  function cancelImageUpload() {
    console.log("Image upload canceled");
    inputFile.current.value = "";
    seturl(null);
    // console.log(url);
  }

  return (
    <>
      <div
        ref={socialRef}
        className={`fixed top-14 bottom-0 break-words p-3 py-3 right-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2   overflow-y-scroll ${
          confirmDelete ? "" : "backdrop-blur-md"
        }`}
      >
        <form
          onSubmit={sumbitPost}
          className="postbox flex flex-col  m-auto shadow-md  border-gray-600/50 p-2"
        >
          <input
            className=" p-2 px-4 rounded-sm outline-none bg-gray-800/40 text-white"
            type="text"
            name=""
            id=""
            placeholder="Share random thought..."
            value={post}
            onChange={handlePost}
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
                accept="image/*"
                src=""
                alt=""
                id="social-file"
                ref={inputFile}
                onChange={(e) => handleUpload(e)}
              />
            </div>
            {url && (
              <div className="  w-11 ml-3 relative">
                <div
                  onClick={() => cancelImageUpload()}
                  className=" h-5  absolute -right-2 -top-2 text-white hover:text-red-500 transition duration-200 cursor-pointer shadow-md"
                >
                  <ion-icon name="close-circle-outline"></ion-icon>
                </div>
                <img loading="lazy" className=" rounded-md" src={url} alt="" />
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
          {postLoading ? (
            <button
              disabled
              type="submit"
              className="  uppercase font-semibold tracking-wider text-white   bg-gray-500/60 py-1 px-4 rounded-sm mt-3"
            >
              <div className="border-l-white m-auto animate-spin border-r-white border-b-white border-t-gray-800/50 h-7 w-7  rounded-full border-4"></div>
            </button>
          ) : (
            <button
              type="submit"
              className="  uppercase font-semibold tracking-wider text-white bg-blue-400 py-1 px-4 rounded-sm mt-3"
            >
              Post
            </button>
          )}
        </form>

        <div className="posts mt-10">
          {!posts ? (
            <div className=" text-center text-white mt-5 mb-5">
              <h1>Loading...</h1>
            </div>
          ) : null}
          <Posts
            events="social-post-delete"
            setfetchOnce={setfetchOnce}
            socket={props.socket}
            posts={posts}
            isLoading={isLoading}
          />

          {isLoading ? (
            <div className=" m-auto  animate-spin w-10 h-10 border-t-gray-800 border-4 border-l-gray-800 border-b-gray-800 border-r-white rounded-full"></div>
          ) : (
            <div className=" text-center mb-2">
              <button
                className="text-white bg-gray-800 p-2 font-semibold rounded-sm shadow-md"
                onClick={() => loadMore()}
              >
                Load More...
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
