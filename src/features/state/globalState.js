import { createSlice } from "@reduxjs/toolkit";

export const globalState = createSlice({
  name: "global",
  initialState: {
    value: 100,
    name: null,
    openCalling: false,
    receiverUI: false,
    callTimer: false,
    peerId: null,
    isMicOn: true,
    myVideoStream: null,
    page: 8,
    socialPagination: 8,
    token: null,
    drawer: false,
    msg: [],
    confirmDelete: false,
    connectedUsers: [],
  },
  reducers: {
    setConnectedUsers: (state, payload) => {
      state.connectedUsers = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    setConfirmDelete: (state, payload) => {
      state.confirmDelete = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    toggleConfirmDelete: (state) => {
      state.confirmDelete = !state.confirmDelete;
    },
    setMsg: (state, payload) => {
      state.msg = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;
      // console.log("Drawer is ", state.drawer ? "open" : "close");
    },
    setDrawer: (state, payload) => {
      state.drawer = payload.payload;
      // console.log("Drawer is ", state.drawer ? "open" : "close");
    },
    setToken: (state, payload) => {
      state.token = payload.payload;
      // console.log("TOken", state.token);
    },
    pageIncrement: (state) => {
      state.page += 8;
    },
    setPage: (state, payload) => {
      state.page = payload.payload;
    },
    socialPaginationIncrement: (state) => {
      state.socialPagination += 8;
      console.log(state.socialPagination);
    },
    setSocialPagination: (state, payload) => {
      state.socialPagination = payload.payload;
    },
    setName: (state, payload) => {
      state.name = payload.payload;
    },
    setMyvideoStream: (state, payload) => {
      state.myVideoStream = payload.payload;
    },
    openCallerScreenOn: (state) => {
      state.openCalling = true;
    },
    openCallerScreenOff: (state) => {
      state.openCalling = false;
    },
    receiverUIFnOn: (state, payload) => {
      state.receiverUI = true;
    },
    receiverUIFnOff: (state) => {
      state.receiverUI = false;
    },
    callTimerOn: (state) => {
      state.callTimer = true;
    },
    callTimerOff: (state) => {
      state.callTimer = false;
    },
    setPeerId: (state, payload) => {
      console.log(payload.payload);
      state.peerId = payload.payload;
    },
    setMicOn: (state) => {
      state.isMicOn = true;
    },
    setMicOff: (state) => {
      state.isMicOn = false;
    },
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  openCallerScreenOn,
  openCallerScreenOff,
  receiverUIFnOn,
  receiverUIFnOff,
  callTimerOn,
  callTimerOff,
  setPeerId,
  setMicOff,
  setMicOn,
  setMyvideoStream,
  setName,
  pageIncrement,
  setPage,
  socialPaginationIncrement,
  setSocialPagination,
  setToken,
  toggleDrawer,
  setDrawer,
  setMsg,
  setConfirmDelete,
  toggleConfirmDelete,
  setConnectedUsers,
} = globalState.actions;

export default globalState.reducer;
