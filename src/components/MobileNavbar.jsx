import Drawer from './Drawer';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDrawer,
  setToken,
  toggleDrawer,
  setShowVideoPopupLive,
  setShowOfflineTextPopup,
} from '../features/state/globalState';

import Stories from './Stories';
import { useState, useEffect } from 'react';
import { API } from '../../api';

export default function MobileNavbar({ socket }) {
  const drawer = useSelector((state) => state.global.drawer);
  const siteStatus = useSelector((state) => state.global.siteStatus);
  const totalOnline = useSelector((state) => state.global.totalOnline);
  const permit = useSelector((state) => state.global.adminPermissions);
  const connectedUsers = useSelector((state) => state.global.connectedUsers);
  const showOfflineTextPopup = useSelector(
    (state) => state.global.showOfflineTextPopup,
  );
  const token = useSelector((state) => state.global.token);
  const [showStories, setshowStories] = useState(false);
  const [lockscreen, setlockscreen] = useState(false);
  const [lockscreenmsg, setlockscreenmsg] = useState('');
  const dispatch = useDispatch();

  // Check if we're in the main lock screen (from App.jsx state)
  // We'll need to get this from a global state or prop
  const isInLockScreen = !token; // If no token, we're likely in lock screen

  function drawerToggle() {
    console.log('Drawer toggle clicked!'); // Debug log
    dispatch(toggleDrawer());
  }

  function isLockedScreen() {
    setlockscreen(true);
  }

  function unlockScreen(e) {
    e.preventDefault();
    if (e.target[0].value) {
      fetch(API + '/lockscreen/' + `${e.target[0].value}`)
        .then((res) => res.json())
        .then((response) => {
          if (response === false) {
            setlockscreen(response);
          } else {
            setlockscreen(true);
            setlockscreenmsg(response?.msg);
          }
        });
    } else {
      setlockscreenmsg('Empty code buddy! 😁');
    }
    e.target[0].value = null;
  }

  return (
    <>
      {/* Modern Floating Navbar - Only visible after unlock */}
      {!isInLockScreen && (
        <div
          className={`fixed top-4 left-4 pointer-events-auto ${
            drawer ? 'z-[9997]' : 'z-[9998]'
          }`}
        >
          {token ? (
            <button
              onClick={() => {
                console.log('Hamburger clicked!');
                drawerToggle();
              }}
              className="w-12 h-12 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-auto"
              style={{ minWidth: '48px', minHeight: '48px' }}
            >
              <ion-icon name="menu" className="text-xl"></ion-icon>
            </button>
          ) : (
            <div className="w-12 h-12 bg-red-500/20 backdrop-blur-md border-2 border-red-300/30 rounded-xl flex items-center justify-center text-red-300">
              <span className="text-xs">No Token</span>
            </div>
          )}
        </div>
      )}

      {/* Debug Info - Only visible after unlock */}
      {!isInLockScreen && (
        <div
          className={`fixed top-4 right-4 bg-black/50 text-white p-2 rounded text-xs ${
            drawer ? 'z-[9997]' : 'z-[9998]'
          }`}
        >
          <div>Token: {token ? 'Yes' : 'No'}</div>
          <div>Drawer: {drawer ? 'Open' : 'Closed'}</div>
        </div>
      )}

      {/* Lockscreen Modal */}
      {lockscreen ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ion-icon
                  name="lock-closed"
                  className="text-white text-2xl"
                ></ion-icon>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Welcome to Chat
              </h3>
              <p className="text-white/70 text-sm mb-6">
                Enter your access code to continue
              </p>
              <form onSubmit={unlockScreen} className="space-y-4">
                <div className="relative">
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 pl-4 pr-4 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300 text-center text-lg font-mono"
                    type="password"
                    placeholder="Type code..."
                    autoFocus
                    autoComplete="off"
                    maxLength="10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ion-icon
                      name="key"
                      className="text-white/40 text-lg"
                    ></ion-icon>
                  </div>
                </div>
                {lockscreenmsg && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm font-medium">
                      {lockscreenmsg}
                    </p>
                  </div>
                )}
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  type="submit"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ion-icon name="unlock" className="text-lg"></ion-icon>
                    <span>Unlock Chat</span>
                  </div>
                </button>
              </form>

              {/* Help text */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/50 text-xs">
                  Contact admin for access code
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Drawer */}
      {drawer && <Drawer drawerToggle={drawerToggle} socket={socket} />}

      {/* Stories */}
      {showStories && <Stories setshowStories={setshowStories} />}
    </>
  );
}
