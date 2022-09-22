import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogs, setUserOuts } from "../features/state/globalState";
import format from "date-fns/format";

export default function LogHistory(props) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.global.allUsers);
  const logs = useSelector((state) => state.global.userLogs);
  const out = useSelector((state) => state.global.userOuts);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    props.socket.on("get-single-logs", (userlog) => {
      dispatch(setUserLogs(userlog));
    });
    props.socket.on("get-single-out", (userout) => {
      dispatch(setUserOuts(userout));
    });
    return () => {};
  });
  return (
    <>
      <div className=" fixed w-full h-full  top-14 left-0 right-0 bottom-0 backdrop-blur-md z-40"></div>
      <ThemeProvider theme={darkTheme}>
        <div className=" flex-wrap ml-2 text-white top-14 fixed z-50 text-center flex ">
          {/* <h1 className=" mb-2 font-bold">Log History</h1>
          <div> */}

          {users &&
            users?.rows &&
            users?.rows.map((item) => (
              <div key={item.id} className=" mb-2">
                <Button
                  className=" w-32"
                  onClick={() => {
                    props.socket.emit("userlog-get-single-user-log", item.id);
                    props.socket.emit("userlog-get-single-user-out", item.id);
                  }}
                  variant="outlined"
                >
                  {item.name}
                </Button>
              </div>
            ))}
          {/* </div> */}
        </div>
        <div className="overflow-y-scroll p-2 text-white fixed z-50 top-[30%] border-2 w-72 h-80 py-3">
          <div>
            <h1>Log time</h1>
            {logs &&
              logs?.rows &&
              logs?.rows.map((item) => (
                <div key={item.id}>
                  <h1>{format(new Date(item.logTime), "PPPPpp")}</h1>
                </div>
              ))}
          </div>
          <div className="">
            <h1>Out Time</h1>
            {out &&
              out?.rows &&
              out?.rows.map((item) => (
                <div key={item.id}>
                  <h1>{format(new Date(item.outTime), "PPPPpp")}</h1>
                </div>
              ))}
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
