import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setPage } from '../features/state/globalState';
import { useEffect, useState } from 'react';

export default function Drawer({ drawerToggle, socket }) {
  const token = useSelector((state) => state.global.token);
  const permit = useSelector((state) => state.global.adminPermissions);
  const [ischangePasswordOpen, setischangePasswordOpen] = useState(false);
  const [ischangePasswordMsg, setischangePasswordMsg] = useState('');
  const [isinputMsgMaxLengthOpen, setisinputMsgMaxLengthOpen] = useState(false);
  const [isinputMsgMaxLengthMsg, setisinputMsgMaxLengthMsg] = useState('');

  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('change-startup-password', (data) => {
      if (data && data.status === true) {
        setischangePasswordMsg('Password Changed!');
      } else {
        setischangePasswordOpen(true);
        setischangePasswordMsg('Try Again!');
      }
    });

    socket.on('get-admin-permissions', (data) => {
      // This event is handled in App.jsx and stored in Redux
      // We don't need to handle it here as we get the data from Redux state
      console.log('Admin permissions updated:', data);
    });

    // Cleanup event listeners
    return () => {
      socket.off('change-startup-password');
      socket.off('get-admin-permissions');
    };
  }, [socket]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={drawerToggle}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        style={{ pointerEvents: 'auto' }}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl z-[9999] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <ion-icon
                  name="person"
                  className="text-white text-xl"
                ></ion-icon>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {token.name}
                </h2>
                <p className="text-white/60 text-sm">User</p>
              </div>
            </div>
            <button
              onClick={drawerToggle}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              <ion-icon name="close" className="text-lg"></ion-icon>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {/* Chat Button */}
          <button
            onClick={() => {
              dispatch(setPage(8));
              navigate('/');
              drawerToggle();
            }}
            className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-white/20 rounded-xl p-4 text-left transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ion-icon
                  name="chatbox-ellipses"
                  className="text-white text-lg"
                ></ion-icon>
              </div>
              <div>
                <p className="text-white font-medium">Chat</p>
                <p className="text-white/60 text-sm">Live messaging</p>
              </div>
            </div>
          </button>

          {/* User Logs */}
          <button
            onClick={() => {
              navigate('logs');
              drawerToggle();
            }}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ion-icon
                  name="document-text"
                  className="text-white text-lg"
                ></ion-icon>
              </div>
              <div>
                <p className="text-white font-medium">User Logs</p>
                <p className="text-white/60 text-sm">Activity history</p>
              </div>
            </div>
          </button>

          {/* Admin Section */}
          {token && token.admin === true && (
            <div className="space-y-2">
              <div className="px-4 py-2">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                  Admin Controls
                </p>
              </div>

              {/* Debug Info - Remove in production */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-4">
                <p className="text-yellow-300 text-xs font-medium mb-2">
                  Debug Info:
                </p>
                <div className="text-yellow-200 text-xs space-y-1">
                  <div>File Input: {permit?.fileInput ? '✅' : '❌'}</div>
                  <div>Online Status: {permit?.online ? '✅' : '❌'}</div>
                  <div>Chat Input: {permit?.chatInput ? '✅' : '❌'}</div>
                  <div>
                    Input Max Length: {permit?.inputMaxLength || 'Not set'}
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <button
                onClick={() => {
                  navigate('images');
                  drawerToggle();
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ion-icon
                      name="images"
                      className="text-white text-lg"
                    ></ion-icon>
                  </div>
                  <div>
                    <p className="text-white font-medium">Image Gallery</p>
                    <p className="text-white/60 text-sm">Manage media</p>
                  </div>
                </div>
              </button>

              {/* File Input Toggle */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <ion-icon
                        name="folder"
                        className="text-white text-sm"
                      ></ion-icon>
                    </div>
                    <p className="text-white font-medium">File Upload</p>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      permit && permit.fileInput
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${
                        permit && permit.fileInput
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      } translate-y-0.5`}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log(
                      'File Input Toggle clicked. Current state:',
                      permit?.fileInput,
                    );
                    socket.emit(
                      'set-admin-permissions',
                      'fileInput',
                      !(permit && permit.fileInput),
                    );
                  }}
                  className="text-white/60 text-sm hover:text-white transition-colors duration-200"
                >
                  {permit && permit.fileInput ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Online Status Toggle */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <ion-icon
                        name="wifi"
                        className="text-white text-sm"
                      ></ion-icon>
                    </div>
                    <p className="text-white font-medium">Online Status</p>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      permit && permit.online ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${
                        permit && permit.online
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      } translate-y-0.5`}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log(
                      'Online Status Toggle clicked. Current state:',
                      permit?.online,
                    );
                    socket.emit(
                      'set-admin-permissions',
                      'online',
                      !(permit && permit.online),
                    );
                  }}
                  className="text-white/60 text-sm hover:text-white transition-colors duration-200"
                >
                  {permit && permit.online ? 'Visible' : 'Hidden'}
                </button>
              </div>

              {/* Chat Input Toggle */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <ion-icon
                        name="chatbubble"
                        className="text-white text-sm"
                      ></ion-icon>
                    </div>
                    <p className="text-white font-medium">Chat Input</p>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      permit && permit.chatInput
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${
                        permit && permit.chatInput
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      } translate-y-0.5`}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log(
                      'Chat Input Toggle clicked. Current state:',
                      permit?.chatInput,
                    );
                    socket.emit(
                      'set-admin-permissions',
                      'chatInput',
                      !(permit && permit.chatInput),
                    );
                  }}
                  className="text-white/60 text-sm hover:text-white transition-colors duration-200"
                >
                  {permit && permit.chatInput ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Change Password */}
              <button
                onClick={() => {
                  setischangePasswordOpen(true);
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ion-icon
                      name="key"
                      className="text-white text-lg"
                    ></ion-icon>
                  </div>
                  <div>
                    <p className="text-white font-medium">Change Password</p>
                    <p className="text-white/60 text-sm">Update security</p>
                  </div>
                </div>
              </button>

              {/* Change Message Max Length */}
              <button
                onClick={() => {
                  setisinputMsgMaxLengthOpen(true);
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ion-icon
                      name="settings"
                      className="text-white text-lg"
                    ></ion-icon>
                  </div>
                  <div>
                    <p className="text-white font-medium">Message Length</p>
                    <p className="text-white/60 text-sm">Set character limit</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Password Change Modal */}
          {ischangePasswordOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    Change Password
                  </h3>
                  <button
                    onClick={() => setischangePasswordOpen(false)}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <ion-icon name="close" className="text-lg"></ion-icon>
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setischangePasswordMsg('Changing...');
                    socket.emit('change-startup-password', e.target[0].value);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="New Password"
                    required
                  />
                  {ischangePasswordMsg && (
                    <p className="text-green-400 text-sm">
                      {ischangePasswordMsg}
                    </p>
                  )}
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    type="submit"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Message Length Modal */}
          {isinputMsgMaxLengthOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    Message Length Limit
                  </h3>
                  <button
                    onClick={() => setisinputMsgMaxLengthOpen(false)}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <ion-icon name="close" className="text-lg"></ion-icon>
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setisinputMsgMaxLengthMsg('Changing...');
                    socket.emit(
                      'set-admin-permissions',
                      'inputMaxLength',
                      e.target[0].value,
                    );
                  }}
                  className="space-y-4"
                >
                  <input
                    type="number"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="Max character limit"
                    required
                  />
                  {isinputMsgMaxLengthMsg && (
                    <p className="text-green-400 text-sm">
                      {isinputMsgMaxLengthMsg}
                    </p>
                  )}
                  <button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    type="submit"
                  >
                    Update Limit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              dispatch(setPage(8));
              drawerToggle();
              dispatch(setToken(null));
              localStorage.setItem('user', JSON.stringify(null));
              navigate('signin');
            }}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <ion-icon name="log-out" className="text-lg"></ion-icon>
            <span>Logout</span>
          </button>

          <div className="text-center mt-6 text-white/40 text-sm">
            <p>&copy; {new Date().getFullYear()} Chat App</p>
          </div>
        </div>
      </div>
    </>
  );
}
