// date-fns
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DateFnsUtils from "@date-io/date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect } from "react";

// delete notification
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
// delete notification
export default function ChatDelete(props) {
  const [from, setfrom] = useState(new Date("2014-08-18T21:11:54"));
  const [to, setto] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const deleteChat = () => {
    const data = {
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    };
    console.log(data);
    props.socket.emit("delete-chat-between-date", data);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    props.socket.emit("get-first-chat");
    return () => {
      console.log("Chat delete page unmounted");
    };
  }, []);

  useEffect(() => {
    props.socket.on("send-first-chat", (chat) => {
      if (chat && chat.rows) {
        setfrom(chat.rows[0].createdAt);
      }
    });
    props.socket.on("deleted-chat-between-date", () => {
      setOpen(true);
      console.log("Chat successfully deleted");
    });
  });

  return (
    <>
      <div className=" w-full h-full flex bg-gray-900/90 top-14 left-0 right-0 bottom-0 z-[40] fixed"></div>
      <div className=" chat-delete text-white z-[50] fixed top-14 flex justify-center items-center bottom-0 left-0 right-0 flex-col">
        <div className="">
          <Box sx={{ width: "100%" }}>
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Successfully Deleted!
              </Alert>
            </Collapse>
          </Box>
        </div>
        <div className=" font-bold uppercase mb-4">
          <h1>Chat Delete</h1>
        </div>
        <div className="">
          <ThemeProvider theme={darkTheme}>
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
                  onClick={() => deleteChat()}
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Stack>
            </LocalizationProvider>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
}
