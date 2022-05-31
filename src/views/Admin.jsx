import Posts from "../components/Posts";
import file from "../assets/woman-6676901_960_720.jpg";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fileUpload } from "../composable/fileUpload";
import {
  adminPaginationIncrement,
  setAdminPagination,
} from "../features/state/globalState";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Route, Routes } from "react-router-dom";
import ChatDelete from "../components/ChatDelete";
import Alert from "@mui/material/Alert";

const postAPI = "https://short-chat-backend.herokuapp.com/admin/";
const postsAPI = "https://short-chat-backend.herokuapp.com/admin/";

export default function Admin(props) {
  const name = useSelector((state) => state.global.name);
  const page = useSelector((state) => state.global.adminPagination);
  const blcok = useSelector((state) => state.global.isSiteBlock);
  const token = useSelector((state) => state.global.token);
  const confirmDelete = useSelector((state) => state.global.confirmDelete);
  const dispatch = useDispatch();
  const adminRef = useRef(null);
  const inputText = useRef(null);
  const inputFile = useRef(null);
  let navigate = useNavigate();

  const [posts, setposts] = useState(null);
  const [post, setpost] = useState("");
  const [postLoading, setpostLoading] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [url, seturl] = useState(null);
  const [fetchOnce, setfetchOnce] = useState(false);

  const [isLoading, setisLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };

  async function getPosts() {
    setisLoading(true);
    const response = await axios.get(postsAPI + page, {
      headers: { code: 1379 },
    });
    const finalRes = await response.data;
    setposts(finalRes);

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
  const getRef = () => {
    if (
      adminRef.current.scrollTop + adminRef.current.clientHeight ===
      adminRef.current.scrollHeight
    ) {
      console.log("Your have reached end");
      dispatch(adminPaginationIncrement());
      // console.log(page);
      getPosts();
    }
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
        props.socket.emit("admin-post", data);
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
    console.log("admin mounted");
    dispatch(adminPaginationIncrement());
    getPosts();
    // console.log(page);
    return () => {
      console.log("admin dismounted");
      dispatch(setAdminPagination(8));
    };
  }, []);

  useEffect(() => {
    if (fetchOnce) {
      props.socket.on("admin-post", function () {
        console.log("Execute once");
        getPosts();
        setfetchOnce(false);
      });
    }

    props.socket.on("site-blocked", () => {
      console.log("Site blocked");
    });
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
        onScroll={(e) => getRef(e)}
        ref={adminRef}
        className={`fixed top-14 bottom-0 break-words p-3 py-3 right-0 w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2   overflow-y-scroll ${
          confirmDelete ? "" : "backdrop-blur-md"
        }`}
      >
        <div className=" mt-2 mb-2 menu">
          <div className=" mb-2">
            {!blcok ? (
              <Alert severity="warning">
                Site is beign blocked. — check it out!
              </Alert>
            ) : null}
          </div>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Menu
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate("chat/delete");
                }}
              >
                Chat Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  props.socket.emit("blockd-site", false);
                  setAnchorEl(null);
                }}
              >
                Block Site
              </MenuItem>
              <MenuItem
                onClick={() => {
                  props.socket.emit("blockd-site", true);
                  setAnchorEl(null);
                }}
              >
                Unblock Site
              </MenuItem>
            </Menu>
          </div>
        </div>
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
                htmlFor="admin-file"
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
                id="admin-file"
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
          {!posts && (
            <div className=" text-center text-white mt-5 mb-5">
              <h1>Loading...</h1>
            </div>
          )}
          <Posts
            events="admin-post-delete"
            socket={props.socket}
            posts={posts}
            isLoading={isLoading}
          />
          {isLoading && posts && posts.rows.length < posts.count && (
            <div className=" m-auto text-center font-semibold bg-gray-900/50 w-40 p-3 rounded-md uppercase shadow-md">
              <h1 className=" animate-pulse text-white">Loading more...</h1>
            </div>
          )}
        </div>
      </div>

      <div>
        <Routes>
          <Route
            path="chat/delete"
            element={<ChatDelete socket={props.socket} />}
          />
        </Routes>
      </div>
    </>
  );
}
