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

  return (
    <div>
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
            {find?.rows?.map((item) =>
              token.id === item.uId ? (
                <div
                  key={item.id}
                  className=" bg-blue-500 mt-3 mb-3 text-white p-2"
                >
                  <div>
                    <p>{item.name}</p>
                    <h1 className=" mt-2 mb-2 ">{item.msg}</h1>
                    <p className=" text-xs">
                      {format(new Date(item.createdAt), "PPPp")}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className=" bg-red-500 mt-3 mb-3 text-white p-2"
                >
                  <div>
                    <p>{item.name}</p>
                    <h1 className=" mt-2 mb-2 ">{item.msg}</h1>
                    <p className=" text-xs">
                      {format(new Date(item.createdAt), "PPPp")}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </List>
      </Dialog>
    </div>
  );
}
