import { useState } from "react";
// import {} from "../features/state/globalState";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
export default function CreateAnnounce(props) {
  const token = useSelector((state) => state.global.token);
  const allAnnounce = useSelector((state) => state.global.allAnnounce);
  const [head, sethead] = useState("");
  const [body, setbody] = useState("");

  const publishAnnounce = (e) => {
    e.preventDefault();
    const data = {
      head: head,
      body: body,
      UserId: token?.id,
    };
    console.log(data);
    props.socket.emit("create-announce", data);
  };

  const publish = (id) => {
    const data = {
      published: true,
      id: id,
    };
    props.socket.emit("publish-status", data);
    console.log(data);
  };

  const unPublish = (id) => {
    const data = {
      published: false,
      id: id,
    };
    console.log(data);
    props.socket.emit("publish-status", data);
  };

  useEffect(() => {
    props.socket.on("announce-created", () => {
      console.log("Announce Created");
    });
  });
  return (
    <>
      <div className=" fixed w-full h-full backdrop-blur-md top-14 bottom-0 left-0 right-0 z-40"></div>
      <div className=" text-white  fixed z-50 top-14">
        <form
          onSubmit={publishAnnounce}
          className=" flex flex-col p-2 text-black"
        >
          <label htmlFor="head">Head</label>
          <input
            className=" p-2 mb-2"
            type="text"
            id="head"
            name="head"
            value={head}
            onChange={(e) => sethead(e.target.value)}
            placeholder="Head"
          />
          <label htmlFor="body">Body</label>
          <input
            className=" p-2 mb-2"
            type="text"
            id="body"
            name="body"
            value={body}
            onChange={(e) => setbody(e.target.value)}
            placeholder="Body"
          />
          <button>Publish</button>
        </form>

        <div className="publish-list">
          {allAnnounce &&
            allAnnounce?.rows.map((item) => (
              <div key={item.id}>
                <h1>{item.head}</h1>
                <h1>{item.body}</h1>
                <h1>Status: {item.published ? "Published" : "Unpublished"}</h1>
                <div>
                  <button onClick={() => publish(item.id)}>Publish</button>
                  <button onClick={() => unPublish(item.id)}>Unpublish</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
