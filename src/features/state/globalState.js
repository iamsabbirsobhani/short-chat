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
    adminPagination: 8,
    token: null,
    drawer: false,
    msg: [],
    confirmDelete: false,
    connectedUsers: [],
    allUsers: null,
    posts: null,
    sensitiveContent: true,
    isSiteBlock: true,
    dayUploadedImages: [],
    siteStatus: null,
    imageIndex: 0,
    // MyDay
    day: [],
    individualDay: [],
    // MyDay
    user: [],
    userLogs: [],
    userOuts: [],
    hasAnnounce: false,
    announce: [],
    allAnnounce: [],
    // search
    searchResult: false,
    findBetweenChat: false,
    findData: [],
    searchData: [],
    // imageGallery
    limitGallery: 5,
    // SOcial post delete
    socialPostDeleted: false,
    // if video permission
    videoPermission: true,
    // show video
    showVideoPopup: false,
    // show video
    showVideoPopupLive: false,
  },
  reducers: {
    // show video
    setShowVideoPopup: (state, payload) => {
      state.showVideoPopup = payload.payload;
    },
    // show video
    setShowVideoPopupLive: (state, payload) => {
      state.showVideoPopupLive = payload.payload;
    },
    // if video permission
    setVideoPermission: (state, payload) => {
      state.videoPermission = payload.payload;
    },
    // SOcial post delete
    setSocialPostDelete: (state) => {
      state.socialPostDeleted = true;
    },
    setSocialPostReset: (state) => {
      state.socialPostDeleted = false;
    },
    // imageGallery
    incrLimitGallery: (state) => {
      state.limitGallery += 5;
    },
    resetLimitGallery: (state) => {
      state.limitGallery = 5;
    },
    // search
    openSearchResult: (state, payload) => {
      state.searchResult = true;
    },
    closeSearchResult: (state, payload) => {
      state.searchResult = false;
    },
    openFindBetween: (state, payload) => {
      state.findBetweenChat = true;
    },
    closeFindBetween: (state, payload) => {
      state.findBetweenChat = false;
    },
    setSearchData: (state, payload) => {
      state.searchData = payload.payload;
    },
    setFindData: (state, payload) => {
      state.findData = payload.payload;
    },
    // announce
    setAllAnnounce: (state, payload) => {
      state.allAnnounce = payload.payload;
    },
    setAnnounce: (state, payload) => {
      state.announce = payload.payload;
    },
    setHasAnnounce: (state, payload) => {
      state.hasAnnounce = payload.payload;
    },
    // LogHistory
    setUserLogs: (state, payload) => {
      state.userLogs = payload.payload;
    },
    setUserOuts: (state, payload) => {
      state.userOuts = payload.payload;
    },
    // LogHistory

    setLoggedUser: (state, payload) => {
      state.user = payload.payload; //get the current logged user
    },
    // MyDay
    setIndividualDay: (state, payload) => {
      state.individualDay = payload.payload; //DayView Component
    },
    setDay: (state, payload) => {
      state.day = payload.payload; //DayView Component
    },
    setImageIndex: (state, payload) => {
      state.imageIndex = payload.payload; //DayView Component
    },
    // MyDay
    setSiteStatus: (state, payload) => {
      state.siteStatus = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    setdayUploadedImages: (state, payload) => {
      state.dayUploadedImages.push(payload.payload);
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    emptyDayUploadedImages: (state) => {
      state.dayUploadedImages = [];
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    setSiteBlock: (state, payload) => {
      state.isSiteBlock = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    setPosts: (state, payload) => {
      state.posts = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    setSensitiveContent: (state, payload) => {
      state.sensitiveContent = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
    setAllUsers: (state, payload) => {
      state.allUsers = payload.payload;
      // console.log("Msg is ", state.msg ? state.msg : "Empty");
    },
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
    adminPaginationIncrement: (state) => {
      state.adminPagination += 8;
      console.log(state.adminPagination);
    },
    setAdminPagination: (state, payload) => {
      state.adminPagination = payload.payload;
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
  setAllUsers,
  adminPaginationIncrement,
  setAdminPagination,
  setPosts,
  setSensitiveContent,
  setSiteBlock,
  setdayUploadedImages,
  emptyDayUploadedImages,
  setSiteStatus,
  setImageIndex,
  setIndividualDay,
  setDay,
  setLoggedUser,
  setUserLogs,
  setUserOuts,
  setHasAnnounce,
  setAnnounce,
  setAllAnnounce,
  openSearchResult,
  closeSearchResult,
  openFindBetween,
  closeFindBetween,
  setFindData,
  setSearchData,
  incrLimitGallery,
  resetLimitGallery,
  setSocialPostReset,
  setSocialPostDelete,
  setVideoPermission,
  setShowVideoPopup,
  setShowVideoPopupLive,
} = globalState.actions;

export default globalState.reducer;
