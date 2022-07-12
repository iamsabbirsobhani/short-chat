import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import {
  setFindData,
  setSearchData,
  closeFindBetween,
} from "../features/state/globalState";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns/esm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FindBetweenChat() {
  const findBetween = useSelector((state) => state.global.findBetweenChat);
  const token = useSelector((state) => state.global.token);

  const find = useSelector((state) => state.global.findData);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeFindBetween());
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Dialog
          fullScreen
          open={findBetween}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Chats
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Done
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <div>
              {find && find.rows && find?.rows.length <= 0 ? (
                <div className=" text-rose-500 text-lg font-bold text-center mt-3 border-2 p-2 ml-2 mr-2 border-red-500 shadow-lg bg-gray-700 uppercase">
                  No chat found!
                </div>
              ) : null}
              <h1 className=" font-semibold ml-2 mt-2">
                Total Match found: {find && find.rows && find?.rows.length}
              </h1>
              {find?.rows?.map((item) =>
                token.id === item.uId ? (
                  <div
                    key={item.id}
                    className=" shadow-lg bg-gray-800 mt-2 mb-2 text-white p-2 w-72 mr-1 ml-auto rounded-sm"
                  >
                    <div>
                      <p className=" text-gray-300 font-semibold">
                        {item.name}
                      </p>
                      <h1 className=" mt-2 mb-2  break-words break-all">
                        {item.msg}
                      </h1>
                      <p className=" text-xs text-gray-400">
                        {format(new Date(item.createdAt), "PPPp")}
                      </p>
                      <p className=" text-xs text-gray-400">ID: {item.id}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className=" bg-emerald-800/60 shadow-lg mt-2 mb-2 text-white p-2 w-72 rounded-sm ml-1"
                  >
                    <div>
                      <p className="text-gray-300 font-semibold">{item.name}</p>
                      <h1 className=" mt-2 mb-2 break-words break-all ">
                        {item.msg}
                      </h1>
                      <p className=" text-xs text-gray-400">
                        {format(new Date(item.createdAt), "PPPp")}
                      </p>
                      <p className=" text-xs text-gray-400">ID: {item.id}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </List>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
