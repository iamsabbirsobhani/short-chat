import AddDay from "./AddDay";
import { useState } from "react";

export default function MyDayPage(props) {
  const [isAddDay, setisAddDay] = useState(false);

  const day = [
    {
      id: 1,
      userId: 17,
      userName: "Albion",
      imgUrl:
        "https://cdn.pixabay.com/photo/2022/01/18/15/40/vietnam-6947335_960_720.jpg",
      like: 0,
      comment: null,
    },
    {
      id: 2,
      userId: 17,
      userName: "Pinti",
      imgUrl:
        "https://cdn.pixabay.com/photo/2018/03/12/12/32/woman-3219507_960_720.jpg",
      like: 0,
      comment: null,
    },
    {
      id: 3,
      userId: 17,
      userName: "Mario",
      imgUrl:
        "https://cdn.pixabay.com/photo/2016/10/01/18/03/sports-1708051_960_720.jpg",
      like: 0,
      comment: null,
    },
  ];

  return (
    <>
      <div className="w-full top-14 left-0 right-0 bottom-0 fixed backdrop-blur-md z-40"></div>
      <div className=" left-4 top-20 fixed z-50 text-white flex flex-wrap justify-center ">
        <div
          onClick={() => {
            setisAddDay(true);
          }}
          className=" mt-2 border-[2px] rounded-md mr-2 text-7xl flex justify-center items-center add-day cursor-pointer w-32 h-40 relative shadow-md"
        >
          <ion-icon name="add-outline"></ion-icon>
        </div>
        {isAddDay ? (
          <div className=" absolute z-[60] top-0 bottom-0 left-0 right-0 flex justify-center items-center">
            <AddDay setisAddDay={setisAddDay} />
          </div>
        ) : null}

        {day
          ? day.map((data) => (
              <div
                key={data.id}
                className="day-card mt-2 w-32 h-40 relative mr-2 cursor-pointer shadow-md shadow-cyan-500/50"
              >
                <div className="absolute w-full h-full backdrop-blur-[2px] flex justify-center items-center">
                  <div className="text-center">
                    <h1>{data.userName}'s' Day</h1>
                    <h1>Tap to see</h1>
                  </div>
                </div>
                <img
                  className=" w-full h-full object-cover rounded-md"
                  src={data.imgUrl}
                  alt=""
                />
              </div>
            ))
          : null}
      </div>
    </>
  );
}
