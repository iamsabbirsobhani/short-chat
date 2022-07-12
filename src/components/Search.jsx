import { useState, useEffect } from "react";

// date-time picker
import Stack from "@mui/material/Stack";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@mui/material/TextField";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
// date-time picker
import SearchIcon from "@mui/icons-material/Search";
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
  let date = new Date();
  date.setHours(date.getHours() - 6);
  const [from, setfrom] = useState(date);
  const [to, setto] = useState(new Date());
  const [keyword, setkeyword] = useState("Hi");
  const findBetween = useSelector((state) => state.global.findBetweenChat);

  const dispatch = useDispatch();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

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
      <div className=" z-[40] bg-gray-900 text-black fixed w-full h-full top-14 bg-white">
        <ThemeProvider theme={darkTheme}>
          <div>
            <div className=" w-80 m-auto mt-5">
              <div className=" mt-1 mb-2">
                <Typography
                  variant="p"
                  className=" text-white font-semibold"
                  gutterBottom
                  component="div"
                >
                  Get Chats Between Date & Time:
                </Typography>
              </div>
              <LocalizationProvider dateAdapter={DateFnsUtils}>
                <Stack spacing={3}>
                  <MobileDateTimePicker
                    label="From"
                    value={from}
                    onChange={(newValue) => {
                      setfrom(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <MobileDateTimePicker
                    label="To"
                    value={to}
                    onChange={(newValue) => {
                      setto(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Button
                    onClick={(e) => handleSubmit(e)}
                    variant="outlined"
                    startIcon={<KeyboardArrowUpIcon />}
                  >
                    Submit
                  </Button>
                </Stack>
              </LocalizationProvider>
            </div>

            {/* <form onSubmit={handleSubmit} className=" w-[310px] m-auto mt-3 mb-3">
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
          </form> */}
          </div>

          <div>
            <FindBetweenChat />
          </div>

          <div className=" mt-3 mb-3">
            <form onSubmit={handleSearch} className=" w-[310px] m-auto">
              <div className=" flex flex-col">
                <label
                  className=" font-semibold mb-1 text-white"
                  htmlFor="search"
                >
                  Search in chat:
                </label>
                {/* <input
                className=" p-2 px-2 text-lg outline-none border-2"
                type="search"
                name="search"
                id="search"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setkeyword(e.target.value)}
                required
              /> */}
                <TextField
                  id="search"
                  label="Search"
                  type="search"
                  onChange={(e) => setkeyword(e.target.value)}
                  variant="outlined"
                  defaultValue={keyword}
                  required
                  helperText="Example: hi, hello, love or anything you want to find out from chats."
                />
              </div>
              <div className=" text-center mt-3">
                <Button
                  type="submit"
                  startIcon={<SearchIcon />}
                  variant="outlined"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>

          <div>
            <SearchResult />
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
