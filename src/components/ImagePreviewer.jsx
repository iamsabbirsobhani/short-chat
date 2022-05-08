import "../styles/ImagePreviewer.scss";
export default function ImagePreviewer({ handleClosePreview, url }) {
  return (
    <>
      <div className=" fixed w-full h-full backdrop-blur-md z-50 flex justify-center top-0 right-0 bottom-0 left-0 items-center">
        <div
          onClick={handleClosePreview}
          className=" z-50 close-btn absolute top-5 right-5 text-white cursor-pointer rounded-md bg-white/10 w-8 h-8 flex justify-center items-center backdrop-blur-md"
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
        <img
          className="scale-in-center shadow-md w-full h-full object-contain"
          src={url}
          alt=""
        />
      </div>
    </>
  );
}
