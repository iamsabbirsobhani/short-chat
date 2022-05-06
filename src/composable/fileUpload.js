import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase/config";
import { useState } from "react";
const fileUpload = async (file, setProgress, setUrl) => {
  const storageRef = ref(storage, "images/" + file.name);
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
      });
    }
  );
};

export { fileUpload };
