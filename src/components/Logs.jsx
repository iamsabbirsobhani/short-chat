import { useEffect } from "react";
import { setAllUsers } from "../features/state/globalState";
import { useSelector, useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
export default function Logs(props) {
  const users = useSelector((state) => state.global.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    props.socket.emit("get-all-users");
  }, []);

  useEffect(() => {
    props.socket.on("get-all-users", (users) => {
      dispatch(setAllUsers(users));
    });
  });

  return (
    <>
      <div className=" w-full h-full fixed top-14 right-0 left-0 backdrop-blur-md  z-40"></div>
      <div className=" overflow-y-scroll z-50 text-white fixed top-0 left-0 right-0 bottom-0 w-[280px]  flex justify-center items-center m-auto">
        <div className=" bg-gray-700/90 p-3 rounded-sm shadow-md">
          <h1 className=" font-bold mt-2 mb-2 uppercase tracking-wider text-center text-blue-500">
            Last Seen
          </h1>
          {users &&
            users.map((item) => (
              <div className=" mb-2 break-words" key={item.id}>
                <div>
                  <h1 className=" uppercase font-bold antialiased">
                    {item.name}
                  </h1>
                </div>
                <div>
                  {format(
                    new Timestamp(
                      item.updatedAt.seconds,
                      item.updatedAt.nanoseconds
                    ).toDate(),
                    "PPPpp"
                  )}
                  <p className=""></p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
