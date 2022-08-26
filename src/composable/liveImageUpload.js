import { storage, ref, getDownloadURL } from "../firebase/config";
import { uploadString } from "firebase/storage";

import { format } from "date-fns";
const liveImgUpload = async (file, socket) => {
  let storageRef;
  storageRef = ref(
    storage,
    "liveImage/" +
      `${format(new Date(), "PP")}/` +
      `${format(new Date(), "PPPp")} `
  );

  uploadString(storageRef, file, "data_url").then((snapshot) => {
    console.log("Uploaded a data_url string!");
    getDownloadURL(snapshot.ref).then((downloadUrl) => {
      console.log(downloadUrl);

      const data = {
        url: downloadUrl,
        msg: "Uploaded a data_url string!",
      };

      socket.emit("img-taken-data", data);
    });
  });
};

export { liveImgUpload };
