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
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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

  const [post, setpost] = useState("");
  const [postLoading, setpostLoading] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [url, seturl] = useState(null);
  const [fetchOnce, setfetchOnce] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [alignment, setAlignment] = useState("normal");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

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
        inputFile.current.value = "";
      }
    }
    setpostLoading(false);
    setisLoading(false);
  }

  //   on scroll bottom
  const getRef = () => {
    if (
      socialRef.current.scrollTop + socialRef.current.clientHeight ===
      socialRef.current.scrollHeight
    ) {
      dispatch(socialPaginationIncrement());
    }
  };

  const loadMore = () => {
    dispatch(socialPaginationIncrement());
  };

  const sumbitPost = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const data = {
      postedBy: token.name,
      post: post,
      imgUrl: url,
      userId: token.id,
      uId: token.id,
      sensitive: alignment === "normal" || alignment === null ? false : true,
    };
    try {
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
    await fileUpload(e.target.files[0], setUploading, seturl);
  };

  useEffect(() => {
    console.log("Social mounted");
    return () => {
      console.log("Social dismounted");
      dispatch(setSocialPagination(8));
    };
  }, []);

  function handlePost(e) {
    setpost(e.target.value);
  }

  function cancelImageUpload() {
    console.log("Image upload canceled");
    inputFile.current.value = "";
    seturl(null);
  }

  // watcher/watching for page to update and fetch posts once page updated
  useEffect(() => {
    getPosts();
  }, [page]);

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
          <div className=" flex items-center mt-3 mb-3">
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
            <ToggleButtonGroup
              className=" ml-3"
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="sensitive">Sensitive</ToggleButton>
            </ToggleButtonGroup>
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
            // <button
            //   type="submit"
            //   className="  uppercase font-semibold tracking-wider text-white bg-blue-400 py-1 px-4 rounded-sm mt-3"
            // >
            //   Post
            // </button>

            <Button type="submit" variant="contained">
              Post
            </Button>
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
          {posts && posts.rows.length < posts.count ? (
            isLoading ? (
              <div className=" m-auto  animate-spin w-10 h-10 border-t-gray-800 border-4 border-l-gray-800 border-b-gray-800 border-r-white rounded-full"></div>
            ) : (
              <div className=" text-center mb-2">
                <button
                  className="text-white uppercase px-3 bg-rose-700 p-2 font-bold rounded-md shadow-lg transition-all duration-150 hover:bg-rose-800"
                  onClick={() => loadMore()}
                >
                  Load More
                </button>
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
