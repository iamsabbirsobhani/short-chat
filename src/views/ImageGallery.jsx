import ImagePreviewer from '../components/ImagePreviewer';
import { img } from './ArrayOfImages';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginPlus from '../components/LoginPlus';
import LoadMore from '../components/image-gallery/LoadMore';
import {
  incrLimitGallery,
  resetLimitGallery,
  setImageGalleryCode,
} from '../features/state/globalState';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { API } from '../../api';
import { Timestamp } from 'firebase/firestore';

export default function ImageGallery() {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.global.value);
  const limit = useSelector((state) => state.global.limitGallery);
  const imageGalleryCode = useSelector(
    (state) => state.global.imageGalleryCode,
  );
  const [isPreviewOpen, setisPreviewOpen] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [images, setimages] = useState(null);
  const [imageError, setimageError] = useState(null);
  const [url, seturl] = useState(null);
  const noScroll = isPreviewOpen ? 'overflow-hidden' : '';
  const [loading, setLoading] = useState(false);

  const [fetchCount, sefetchCount] = useState(0);

  // const [code, setcode] = useState(null);

  async function fetchImages(code) {
    setLoading(true);

    if (code) {
      const response = await axios.get(
        API + '/unlockImage/' + code + '/' + limit,
      );
      resData(response);
    } else if (imageGalleryCode) {
      const response = await axios.get(
        API + '/unlockImage/' + imageGalleryCode + '/' + limit,
      );
      resData(response);
    }
    function resData(response) {
      if (response?.data?.lock === true) {
        setimages(null);
        setimageError("You don't have access to this gallery");
        setLoading(false);
        setisLogin(true);
        // console.log(response.data);
      } else if (response?.data?.lock === false) {
        // console.log(limit);
        // console.log(response.data);
        setimages(response?.data?.data);
        setimageError(null);
        setLoading(false);
        setisLogin(false);
      }
    }
  }

  const handleSharedPictures = async (e) => {
    e.preventDefault();
    setisLoading(true);
    dispatch(setImageGalleryCode(e.target[0].value));
    // setcode(e.target[0].value);
    await fetchImages(e.target[0].value);
    setisLoading(false);
  };

  const openLogin = () => {
    setisLogin(!isLogin);
  };
  const resetGallery = () => {
    // sefetchCount(0);
    setimages(null);
    dispatch(resetLimitGallery());
    dispatch(setImageGalleryCode(null));
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

  // load more implementation
  const loadMore = () => {
    // sefetchCount(10);
    dispatch(incrLimitGallery());
  };

  useEffect(() => {
    fetchImages();
  }, [limit]);
  // load more implementation

  useEffect(() => {
    return () => {
      console.log('Image Gallery Dismounted.');
      // sefetchCount(0);
      dispatch(resetLimitGallery());
      dispatch(setImageGalleryCode(null));
    };
  }, []);

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
        <button className=" ml-3" onClick={() => resetGallery()}>
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
      <div
        className={`grid   lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 grid-cols-2 gap-4 ${noScroll} m-5`}
      >
        {images
          ? images.map((link) =>
              link.url.includes('video') ? (
                <div key={link._id} className=" flex flex-col">
                  <video width="" height="" controls muted>
                    <source src={link.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div>
                    <p className=" text-gray-300 text-xs mt-1">
                      {format(
                        new Timestamp(
                          link.createdAt.seconds,
                          link.createdAt.nanoseconds,
                        ).toDate(),

                        'PPp',
                      )}
                    </p>
                  </div>
                </div>
              ) : link.url.includes('audio') ? (
                <div className=" flex flex-col" key={link._id}>
                  <audio controls className=" w-44">
                    <source src={link.url} type="audio/ogg" />
                  </audio>
                  <div>
                    <p className=" text-gray-300 text-xs mt-1">
                      {format(
                        new Timestamp(
                          link.createdAt.seconds,
                          link.createdAt.nanoseconds,
                        ).toDate(),

                        'PPp',
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className=" flex flex-col">
                  <img
                    onClick={(e) => handleClosePreview(e)}
                    className=" cursor-pointer transition duration-200 hover:scale-105 w-full h-full object-cover"
                    key={link._id}
                    src={link.url}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <p className=" text-gray-300 text-xs mt-1">
                      {format(
                        new Timestamp(
                          link.createdAt.seconds,
                          link.createdAt.nanoseconds,
                        ).toDate(),

                        'PPp',
                      )}
                    </p>
                  </div>
                </div>
              ),
            )
          : img.map((link, index) => (
              <img
                onClick={(e) => handleClosePreview(e)}
                className=" cursor-pointer transition duration-200 hover:scale-105 w-full h-full object-cover"
                key={index}
                src={link.url}
                alt=""
              />
            ))}
      </div>
      {images ? (
        <div className=" text-center mt-3 mb-3">
          <LoadMore loadMore={loadMore} loading={loading} />
        </div>
      ) : null}
    </>
  );
}
