import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase/config";
import { useState } from "react";
import { format } from "date-fns";
const fileUpload = async (file, setProgress, setUrl) => {
  let storageRef;
  if (file && file.type.includes("video")) {
    storageRef = ref(
      storage,
      "videos/" +
        `${format(new Date(), "PP")}/` +
        `${format(new Date(), "PPPp")} ` +
        file.name
    );
  } else {
    storageRef = ref(
      storage,
      "images/" +
        `${format(new Date(), "PP")}/` +
        `${format(new Date(), "PPPp")} ` +
        file.name
    );
  }
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
      console.log("Upload is" + progress + "% done");
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          console.log("User doesn't have permission to access the object");
          break;
        case "storage/unknown":
          console.log("Unknown error occurred, inspect error.serverResponse");
          break;
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        setUrl(downloadURL);
        storageRef = null;
      });
    }
  );
};

export { fileUpload };
