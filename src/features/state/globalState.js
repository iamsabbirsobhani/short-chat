import { createSlice } from "@reduxjs/toolkit";

export const globalState = createSlice({
  name: "global",
  initialState: {
    value: 10,
    openCalling: false,
    receiverUI: false,
    callTimer: false,
    peerId: null,
  },
  reducers: {
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
} = globalState.actions;

export default globalState.reducer;
