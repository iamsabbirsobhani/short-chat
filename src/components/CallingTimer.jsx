import { useState, useEffect } from "react";

export default function CallingTimer() {
  const [sec, setSec] = useState(0);
  const [min, setmin] = useState(0);
  const [hour, sethour] = useState(0);

  let secL = 0;
  let minL = 0;
  let hourL = 0;
  useEffect(() => {
    const interval = setInterval(() => {
      setSec(secL);
      secL++;
      if (secL > 60) {
        secL = 1;
        minL++;
        setmin(minL);
      }
      if (minL > 60) {
        minL = 0;
        hourL++;
        sethour(hourL);
      }
      console.log("Hour:", hourL, "Min: ", minL, "Sec: ", secL);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className=" flex justify-between h-[60px] items-center shadow-lg absolute top-0 text-white bg-red-500 w-full p-3 ">
      <div>
        <h1 className=" font-semibold">
          Call<span className=" animate-pulse">...</span>
        </h1>
      </div>
      <div>
        <h1 className=" font-semibold tracking-wider">
          {hour}:{min}:{sec}
        </h1>
      </div>
      <div className=" cursor-pointer bg-white text-red-500 rounded-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}
