import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
export default function Stories() {
  const [data, setdata] = useState(null);
  const [story, setstory] = useState(null);
  fetch("http://localhost:8083/api/puppet")
    .then((res) => res.text())
    .then((response) => {
      setdata(response);
    });

  function fetchStory(url) {
    fetch("http://localhost:8083/api/puppet/post", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.text())
      .then((response) => setstory(response))
      .catch((error) => console.log(error));

    console.log("fetchStory: ", url);
    // axios
    //   .post(
    //     `http://localhost:8083/api/puppet/post`,
    //     { url: "sfd" },
    //     {
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    //       },
    //     }
    //   )
    //   .then((res) => console.log(res))
    //   .catch((error) => console.log(error));
  }

  useEffect(() => {
    console.log(story);
  }, [story]);

  useEffect(() => {
    const an = document.getElementsByTagName("a");
    if (an) {
      Array.from(an).forEach((item) => {
        item.style.color = "red";
        // item.href = "";
        item.addEventListener("mouseenter", () => {
          fetchStory(item.href.split("story")[1]);
          console.log("Mouse over: ", item.href.split("story")[1]);
        });
        item.addEventListener("touchstart", () => {
          fetchStory(item.href.split("story")[1]);
          console.log("Mouse over: ", item.href.split("story")[1]);
        });
      });
    }
  });

  return (
    <>
      {story && (
        <div className="pb-8 overflow-x-scroll z-[60] w-[80%] h-full bg-white fixed top-14 bottom-0 left-0 right-0 p-2 m-auto">
          <div>
            <button
              className=" bg-red-500 p-2 px-3 "
              onClick={() => {
                setstory(null);
              }}
            >
              Close
            </button>
          </div>
          <div
            className=" text-black"
            dangerouslySetInnerHTML={{ __html: story }}
          />
        </div>
      )}
      <div className=" pb-8 overflow-x-scroll z-50 w-full h-full bg-white fixed top-14 bottom-0 left-0 right-0 p-2 list-none">
        <h1> Hello Stories </h1>
        {data ? (
          <div
            className=" text-black"
            dangerouslySetInnerHTML={{ __html: data }}
          />
        ) : (
          <div>
            <h1 className="text-black">Loading...</h1>
          </div>
        )}
        {/* <div className=" text-black">{data}</div> */}
      </div>
    </>
  );
}
