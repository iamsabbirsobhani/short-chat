import { liveImgUpload } from "./liveImageUpload";

const liveImg = async (video, canvas, socket) => {
  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: "user" },
    })
    .then((stream) => {
      video.srcObject = stream;
    });

  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL("image/jpeg");

  // data url of the image
  //   console.log(image_data_url);

  liveImgUpload(image_data_url, socket);

  function videoEnable(stream) {
    stream.getTracks().forEach((track) => (track.enabled = true));
  }
  function videoDisable(stream) {
    stream.getTracks().forEach((track) => (track.enabled = false));
  }
};

export { liveImg };
