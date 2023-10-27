import axios from 'axios';
import '../styles/ImagePreviewer.scss';
import { API } from '../../api';
export default function ImagePreviewer({
  handleClosePreview,
  url,
  id,
  imageGalleryCode,
  fetchImages,
}) {
  const handleDelete = () => {
    console.log('delete');
    axios.get(API + `/scmediadel/${id}`).then(async (res) => {
      // console.log(res);
      await fetchImages(imageGalleryCode);
      handleClosePreview();
    });
  };
  return (
    <>
      <div className=" flex z-50 fixed w-full p-2 items-center justify-between">
        <div
          onClick={handleClosePreview}
          className=" z-50 close-btn absolute right-5 text-white cursor-pointer rounded-md bg-white/10 w-8 h-8 flex justify-center items-center backdrop-blur-md"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div>
          <button
            onClick={handleDelete}
            className=" bg-white text-red-500 p-2 rounded-md font-bold"
          >
            Delete
          </button>
        </div>
      </div>
      <div className=" fixed w-full h-full backdrop-blur-md z-40 flex justify-center top-0 right-0 bottom-0 left-0 items-center">
        <img
          className="scale-in-center shadow-md w-full h-full object-contain"
          src={url}
          alt=""
        />
      </div>
    </>
  );
}
