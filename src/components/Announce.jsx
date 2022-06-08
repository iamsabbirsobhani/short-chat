import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { setHasAnnounce } from "../features/state/globalState";

import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
export default function ResponsiveDialog(props) {
  const hasAnnounce = useSelector((state) => state.global.hasAnnounce);
  const announce = useSelector((state) => state.global.announce);
  const token = useSelector((state) => state.global.token);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAgree = () => {
    const data = {
      agree: true,
      AnnounceId: announce.id,
      UserId: token.id,
    };
    props.socket.emit("create-agree", data);
    dispatch(setHasAnnounce(false));
  };
  const handleDisagree = () => {
    const data = {
      agree: false,
      AnnounceId: announce.id,
      UserId: token.id,
    };
    props.socket.emit("create-agree", data);
    dispatch(setHasAnnounce(false));
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
          fullScreen={fullScreen}
          open={hasAnnounce}
          onClose={handleDisagree}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {announce.head}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{announce.body}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDisagree}>
              Disagree
            </Button>
            <Button onClick={handleAgree} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
