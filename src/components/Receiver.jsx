import hacker from '../assets/hacker.png';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

function useOutsideAlerter(ref) {
  const [state, setstate] = useState('');
  function shakeControl() {
    setstate('shake-horizontal');
    setTimeout(() => {
      setstate('');
    }, 700);
  }
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        shakeControl();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  return state;
}

export default function Receiver({ callEnd, callReceive }) {
  const wrapperRef = useRef(null);
  //   useOutsideAlerter(wrapperRef);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 cursor-pointer"></div>
      <div className="fixed inset-0 z-40 flex justify-center items-center p-4">
        <div
          ref={wrapperRef}
          className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-sm w-full ${useOutsideAlerter(
            wrapperRef,
          )}`}
        >
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold mb-6">
              <span className="animate-pulse">Incoming Call</span>
            </h1>

            {/* Caller Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  className="w-20 h-20 border-4 border-white/20 rounded-full object-cover animate-bounce"
                  src={hacker}
                  alt="Caller"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Call Actions */}
            <div className="flex justify-center space-x-6">
              {/* Accept Call */}
              <button
                onClick={callReceive}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-16 h-16 rounded-full flex justify-center items-center transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <ion-icon name="call" className="text-2xl"></ion-icon>
              </button>

              {/* Reject Call */}
              <button
                onClick={callEnd}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-16 h-16 rounded-full flex justify-center items-center transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <ion-icon name="call" className="text-2xl rotate-90"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
