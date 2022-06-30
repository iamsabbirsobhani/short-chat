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
  closeSearchResult,
} from "../features/state/globalState";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns/esm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchResult() {
  const findBetween = useSelector((state) => state.global.searchResult);
  const token = useSelector((state) => state.global.token);

  const find = useSelector((state) => state.global.searchData);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeSearchResult());
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
              Search Result
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <div>
            {find && find[0]?.length <= 0 ? (
              <div className=" text-black">No chat found!</div>
            ) : null}
            <h1>Total Match found: {find[0]?.length}</h1>
            {find &&
              find[0]?.map((item) =>
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
