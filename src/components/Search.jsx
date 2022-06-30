import { useState, useEffect } from "react";
import FindBetweenChat from "./FindBetweenChat";
import SearchResult from "./SearchResult";
import {
  setFindData,
  setSearchData,
  openFindBetween,
  openSearchResult,
  closeFindBetween,
} from "../features/state/globalState";
import { useSelector, useDispatch } from "react-redux";

export default function Search(props) {
  const [from, setfrom] = useState(new Date());
  const [to, setto] = useState(new Date());
  const [keyword, setkeyword] = useState("");
  const findBetween = useSelector((state) => state.global.findBetweenChat);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(from, to);
    let data = {
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    };
    // console.log(data);
    props.socket.emit("chats-interval", data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let data = {
      keyword: keyword,
    };
    // console.log(data);
    props.socket.emit("search-result", data);
  };

  useEffect(() => {
    props.socket.on("chats-interval", (data) => {
      if (data) {
        // console.log("Get data, ", data);
        dispatch(setFindData(data));
        dispatch(openFindBetween());
      }
    });

    props.socket.on("search-result", (data) => {
      if (data) {
        // console.log("Get search data, ", data);
        dispatch(setSearchData(data));
        dispatch(openSearchResult());
        dispatch(closeFindBetween());
      }
    });
  });

  return (
    <>
      <div className=" z-[60] text-black fixed w-full h-full top-14 bg-white">
        <div>
          <form onSubmit={handleSubmit} className=" w-[310px] m-auto mt-3 mb-3">
            <div className=" flex flex-col mb-2">
              <label htmlFor="from" className=" mb-1 font-semibold">
                From:
              </label>
              <input
                className=" p-2 px-2 text-lg outline-none border-2"
                type="datetime-local"
                name="from"
                id="from"
                onChange={(e) => {
                  //   console.log(e.target.value);
                  setfrom(e.target.value);
                }}
                required
              />
            </div>
            <div className=" flex flex-col">
              <label htmlFor="to" className=" mb-1 font-semibold">
                To:
              </label>
              <input
                className=" p-2 px-2 text-lg outline-none border-2"
                type="datetime-local"
                name="to"
                id="to"
                onChange={(e) => {
                  //   console.log(e.target.value);
                  setto(e.target.value);
                }}
                required
              />
            </div>
            <div className=" text-center">
              <button className=" mt-3 p-2 px-3 border-2 font-semibold uppercase">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div>
          <FindBetweenChat />
        </div>

        <div className=" mt-3 mb-3">
          <form onSubmit={handleSearch} className=" w-[310px] m-auto">
            <div className=" flex flex-col">
              <label className=" font-semibold mb-1" htmlFor="search">
                Search in chat:
              </label>
              <input
                className=" p-2 px-2 text-lg outline-none border-2"
                type="search"
                name="search"
                id="search"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setkeyword(e.target.value)}
                required
              />
            </div>
            <div className=" text-center">
              <button className=" mt-3 p-2 px-3 border-2 font-semibold uppercase">
                Search
              </button>
            </div>
          </form>
        </div>

        <div>
          <SearchResult />
        </div>
      </div>
    </>
  );
}
