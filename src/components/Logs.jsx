import { useEffect } from 'react';
import { setAllUsers } from '../features/state/globalState';
import { useSelector, useDispatch } from 'react-redux';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export default function Logs(props) {
  const users = useSelector((state) => state.global.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    props.socket.emit('get-all-users');
  }, []);

  useEffect(() => {
    props.socket.on('get-all-users', (users) => {
      dispatch(setAllUsers(users));
    });
  });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

      {/* Main Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ion-icon name="time" className="text-xl"></ion-icon>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Last Seen</h1>
                  <p className="text-sm text-white/80">User activity history</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Total Users</p>
                <p className="text-xl font-bold">{users ? users.length : 0}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {users && users.length > 0 ? (
              <div className="space-y-4">
                {users.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* User Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {item.name
                              ? item.name.charAt(0).toUpperCase()
                              : 'U'}
                          </span>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">
                            {item.name}
                          </h3>
                          <p className="text-white/60 text-xs">
                            {format(
                              new Timestamp(
                                item.updatedAt.seconds,
                                item.updatedAt.nanoseconds,
                              ).toDate(),
                              'MMM dd, yyyy',
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/80 text-xs">
                          {format(
                            new Timestamp(
                              item.updatedAt.seconds,
                              item.updatedAt.nanoseconds,
                            ).toDate(),
                            'HH:mm',
                          )}
                        </p>
                        <p className="text-white/40 text-xs">
                          {format(
                            new Timestamp(
                              item.updatedAt.seconds,
                              item.updatedAt.nanoseconds,
                            ).toDate(),
                            'MMM dd',
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Full Timestamp */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-white/50 text-xs">
                        Last active:{' '}
                        {format(
                          new Timestamp(
                            item.updatedAt.seconds,
                            item.updatedAt.nanoseconds,
                          ).toDate(),
                          'PPPpp',
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ion-icon
                    name="people"
                    className="text-white/60 text-2xl"
                  ></ion-icon>
                </div>
                <p className="text-white/60 text-sm">No users found</p>
                <p className="text-white/40 text-xs mt-1">
                  User activity will appear here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Activity tracking</span>
              <span>Real-time updates</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
