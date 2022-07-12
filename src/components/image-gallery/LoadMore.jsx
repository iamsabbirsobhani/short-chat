import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function LoadMore({ loadMore, loading }) {
  function handleClick() {
    setLoading(true);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box>
        <LoadingButton
          onClick={loadMore}
          loading={loading}
          loadingIndicator="Loading…"
          variant="outlined"
        >
          Load More
        </LoadingButton>
      </Box>
    </ThemeProvider>
  );
}
