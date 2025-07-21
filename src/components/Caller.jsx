import '../styles/Caller.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
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
      console.log('Calling unmounted');
    };
  }, [ref]);
  return state;
}

export default function Caller({ closeCall }) {
  const count = useSelector((state) => state.global.value);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <>
      <div
        onClick={() => shakeControl()}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 cursor-pointer"
      ></div>
      <div className="fixed inset-0 z-40 flex justify-center items-center p-4">
        <div
          ref={wrapperRef}
          className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-sm w-full ${useOutsideAlerter(
            wrapperRef,
          )}`}
        >
          <div className="text-center">
            {/* Calling Animation */}
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ion-icon name="call" className="text-white text-3xl"></ion-icon>
            </div>

            <h1 className="text-white text-2xl font-bold mb-2">
              Calling<span className="animate-pulse">...</span>
            </h1>

            <p className="text-white/70 text-lg mb-8">
              Make sure the person is
              <span className="text-green-400 font-semibold"> online</span>
            </p>

            {/* Reject Button */}
            <button
              onClick={closeCall}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-16 h-16 rounded-full flex justify-center items-center transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <ion-icon name="call" className="text-2xl rotate-90"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
