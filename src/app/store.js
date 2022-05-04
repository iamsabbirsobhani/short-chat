import { configureStore } from "@reduxjs/toolkit";
import globalState from "../features/state/globalState";
export default configureStore({
  reducer: {
    global: globalState,
  },
});
