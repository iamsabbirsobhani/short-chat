import ImagePreviewer from '../components/ImagePreviewer';
import { img } from './ArrayOfImages';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginPlus from '../components/LoginPlus';
import LoadMore from '../components/image-gallery/LoadMore';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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
  const [id, setid] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [fetchCount, sefetchCount] = useState(0);

  const [currentPage, setcurrentPage] = useState(1);

  // const [code, setcode] = useState(null);

  async function fetchImages(code) {
    setLoading(true);

    if (code) {
      const response = await axios.get(
        API + '/unlockImage/' + code + '/' + 10 + '/' + (currentPage - 1),
      );
      resData(response);
      // console.log({ code: response.data });
    } else if (imageGalleryCode) {
      const response = await axios.get(
        API +
          '/unlockImage/' +
          imageGalleryCode +
          '/' +
          10 +
          '/' +
          (currentPage - 1),
      );
      // console.log({ imageGalleryCode: response.data });
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
        setimages(response?.data?.data?.documents);
        console.log(response?.data?.data?.totalPage);
        setTotalPage(response?.data?.data?.totalPage);
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

  const handleClosePreview = (e, id) => {
    setisPreviewOpen(false);
    seturl(null);
    setid('');
  };

  const handleOpenPreview = (e, id) => {
    setisPreviewOpen(true);
    seturl(e.target.src);
    setid(id);
  };

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const loadMore = () => {
    dispatch(incrLimitGallery());
    sefetchCount(fetchCount + 1);
  };

  const handlePageByDirectInput = (e) => {
    if (e.target.value > 0 && e.target.value <= totalPage) {
      setcurrentPage(parseInt(e.target.value));
    }
  };

  const handlePageChange = (event, value) => {
    setcurrentPage(value);
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage]);

  // Show lock screen if no access
  if (isLogin || !images) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center">
            {/* Lock Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ion-icon
                name="images"
                className="text-white text-3xl"
              ></ion-icon>
            </div>

            {/* Title and Description */}
            <h2 className="text-white text-2xl font-bold mb-2">
              Media Gallery
            </h2>
            <p className="text-white/70 text-sm mb-8">
              Enter your gallery code to view images and videos
            </p>

            {/* Form */}
            <form onSubmit={handleSharedPictures} className="space-y-6">
              {/* Code Input */}
              <div className="relative">
                <input
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pl-4 pr-12 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300 text-center text-lg font-mono tracking-wider"
                  type="password"
                  placeholder="Enter gallery code..."
                  autoFocus
                  autoComplete="off"
                  maxLength="10"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ion-icon
                    name="key"
                    className="text-white/40 text-xl"
                  ></ion-icon>
                </div>
              </div>

              {/* Error Messages */}
              {imageError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-300 text-sm font-medium">
                    {imageError}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Unlocking...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ion-icon name="unlock" className="text-lg"></ion-icon>
                    <span>Unlock Gallery</span>
                  </div>
                )}
              </button>
            </form>

            {/* Back to Chat */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-200"
              >
                <ion-icon name="arrow-back" className="text-lg"></ion-icon>
                <span className="text-sm">Back to Chat</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Gallery View
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${noScroll}`}
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-300"
              >
                <ion-icon name="arrow-back" className="text-xl"></ion-icon>
              </Link>
              <div>
                <h1 className="text-white text-lg font-semibold">
                  Media Gallery
                </h1>
                <p className="text-white/60 text-sm">
                  {images?.length || 0} items • Page {currentPage} of{' '}
                  {totalPage}
                </p>
              </div>
            </div>

            {/* Gallery Code Display */}
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-white/80 text-sm font-mono">
                {imageGalleryCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-white/70">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading images...</p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images && images.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((media, index) => {
              const isVideo =
                media.url &&
                (media.url.includes('mp4') || media.url.includes('video'));
              const isImage =
                media.url &&
                (media.url.includes('images') ||
                  media.url.includes('image') ||
                  !isVideo);

              return (
                <div
                  key={index}
                  className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                  onClick={() => handleOpenLightbox(index)}
                >
                  {/* Video Thumbnail */}
                  {isVideo ? (
                    <div className="w-full h-full relative">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />

                      {/* Video Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ion-icon
                            name="play"
                            className="text-white text-xl"
                          ></ion-icon>
                        </div>
                      </div>

                      {/* Video Duration Badge */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                        <p className="text-white text-xs">VIDEO</p>
                      </div>
                    </div>
                  ) : (
                    /* Image Display */
                    <img
                      src={media.url}
                      alt={`Gallery ${isImage ? 'image' : 'media'} ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ion-icon
                          name={isVideo ? 'play' : 'expand'}
                          className="text-white text-xl"
                        ></ion-icon>
                      </div>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center space-x-2 mb-1">
                      <ion-icon
                        name={isVideo ? 'videocam' : 'image'}
                        className="text-white/80 text-xs"
                      ></ion-icon>
                      <p className="text-white text-xs truncate">
                        {media.name ||
                          `${isVideo ? 'Video' : 'Image'} ${index + 1}`}
                      </p>
                    </div>
                    {media.uploadedAt && (
                      <p className="text-white/60 text-xs">
                        {format(
                          new Timestamp(
                            media.uploadedAt.seconds,
                            media.uploadedAt.nanoseconds,
                          ).toDate(),
                          'MMM dd, yyyy',
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPage > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPage}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'white',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(139, 92, 246, 0.8)',
                          color: 'white',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    }}
                  />
                </Stack>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && (!images || images.length === 0) && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-white/70">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ion-icon
                name="images-outline"
                className="text-white/60 text-2xl"
              ></ion-icon>
            </div>
            <p className="text-lg mb-2">No media found</p>
            <p className="text-sm">This gallery appears to be empty</p>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isPreviewOpen && (
        <ImagePreviewer
          url={url}
          id={id}
          handleClosePreview={handleClosePreview}
        />
      )}

      {/* Lightbox for Images and Videos */}
      {lightboxOpen && images && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((media) => {
            const isVideo =
              media.url &&
              (media.url.includes('mp4') || media.url.includes('video'));
            return {
              src: media.url,
              type: isVideo ? 'video' : 'image',
              title: media.name || `${isVideo ? 'Video' : 'Image'}`,
              description: media.uploadedAt
                ? format(
                    new Timestamp(
                      media.uploadedAt.seconds,
                      media.uploadedAt.nanoseconds,
                    ).toDate(),
                    'MMM dd, yyyy',
                  )
                : undefined,
            };
          })}
          carousel={{
            finite: true,
            preload: 2,
          }}
          animation={{
            fade: 300,
            swipe: 300,
          }}
          thumbnails={{
            width: 120,
            height: 80,
            padding: 4,
            border: 2,
            borderRadius: 4,
            gap: 16,
            imageFit: 'contain',
          }}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: true,
          }}
          render={{
            buttonPrev: images.length <= 1 ? () => null : undefined,
            buttonNext: images.length <= 1 ? () => null : undefined,
            iconPrev: () => (
              <ion-icon name="chevron-back" className="text-2xl"></ion-icon>
            ),
            iconNext: () => (
              <ion-icon name="chevron-forward" className="text-2xl"></ion-icon>
            ),
            iconClose: () => (
              <ion-icon name="close" className="text-2xl"></ion-icon>
            ),
            iconZoomIn: () => (
              <ion-icon name="add" className="text-xl"></ion-icon>
            ),
            iconZoomOut: () => (
              <ion-icon name="remove" className="text-xl"></ion-icon>
            ),
            iconSlideshow: () => (
              <ion-icon name="play" className="text-xl"></ion-icon>
            ),
            iconSlideshowPause: () => (
              <ion-icon name="pause" className="text-xl"></ion-icon>
            ),
            iconThumbnails: () => (
              <ion-icon name="grid" className="text-xl"></ion-icon>
            ),
            iconThumbnailsClose: () => (
              <ion-icon name="close" className="text-xl"></ion-icon>
            ),
          }}
        />
      )}
    </div>
  );
}
