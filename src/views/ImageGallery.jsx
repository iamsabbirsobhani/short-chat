import { useSelector } from "react-redux";
import ImagePreviewer from "../components/ImagePreviewer";
import { img } from "./ArrayOfImages";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoginPlus from "../components/LoginPlus";

export default function ImageGallery() {
  const value = useSelector((state) => state.global.value);
  const [isPreviewOpen, setisPreviewOpen] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [images, setimages] = useState(null);
  const [imageError, setimageError] = useState(null);
  const [url, seturl] = useState(null);
  const noScroll = isPreviewOpen ? "overflow-hidden" : "";

  let API = "https://short-chat-backend.herokuapp.com/images";

  async function fetchImages(code) {
    const response = await axios.get(API, { headers: { code: code } });
    if ("error" in response.data) {
      setimages(null);
      setimageError(response.data.error);
      setisLogin(true);
    } else {
      setimages(response.data);
      setimageError(null);
      console.log(images);
      setisLogin(false);
    }
  }

  const handleSharedPictures = async (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    setisLoading(true);
    await fetchImages(e.target[0].value);
    setisLoading(false);
  };

  const openLogin = () => {
    setisLogin(!isLogin);
  };

  const handleClosePreview = (e) => {
    if (isPreviewOpen) {
      seturl(e.target.src);
      setisPreviewOpen(!isPreviewOpen);
    } else {
      setTimeout(() => {
        seturl(e.target.src);
        setisPreviewOpen(!isPreviewOpen);
      }, 250);
    }
  };

  return (
    <>
      {isPreviewOpen && (
        <ImagePreviewer handleClosePreview={handleClosePreview} url={url} />
      )}
      {isLogin && (
        <LoginPlus
          openLogin={openLogin}
          isLodaing={isLoading}
          imageError={imageError}
          handleSharedPictures={handleSharedPictures}
        />
      )}
      <div className=" text-white flex items-center ml-5">
        <Link to="/">
          <div className=" p-1 rounded-md bg-white/10 text-2xl  w-8 flex justify-center items-center">
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </Link>
        <h1 className=" font-bold text-2xl mt-3 mb-3 ml-5 mr-2">
          Image Gallery
        </h1>

        <button onClick={() => openLogin()}>
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
      <div
        className={`grid   lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 grid-cols-2 gap-4 ${noScroll} m-5`}
      >
        {images
          ? images.rows.map((link) => (
              <img
                onClick={(e) => handleClosePreview(e)}
                className=" cursor-pointer transition duration-200 hover:scale-105 w-full h-full object-cover"
                key={link.id}
                src={link.url}
                alt=""
              />
            ))
          : img.map((link) => (
              <img
                onClick={(e) => handleClosePreview(e)}
                className=" cursor-pointer transition duration-200 hover:scale-105 w-full h-full object-cover"
                key={link.id}
                src={link.url}
                alt=""
              />
            ))}
      </div>
    </>
  );
}
