import { useState, useEffect } from "react";

export default function Posts() {
  const [posts, setposts] = useState([
    {
      id: 1,
      post: "somethign sdfs sdfklj",
      postedBy: "Albion",
      posterId: 1,
      createdAt: new Date().toString(),
    },
    {
      id: 2,
      post: "somethign sdfs sdfklj",
      postedBy: "Albion",
      posterId: 1,
      createdAt: new Date().toString(),
    },
    {
      id: 3,
      post: "somethign sdfs sdfklj",
      postedBy: "Albion",
      posterId: 1,
      createdAt: new Date().toString(),
    },
    {
      id: 4,
      post: "somethign sdfs sdfklj",
      postedBy: "Albion",
      posterId: 1,
      createdAt: new Date().toString(),
    },
  ]);

  const getRef = () => {
    console.log(
      postsRef.current.scrollHeight - postsRef.current.scrollTop,
      postsRef.current.clientHeight
    );
  };
  return (
    <>
      <div className="">
        {posts.map((post) => (
          <div
            className=" mb-3 p-3 rounded-sm backdrop-blur-md border-[1px] border-gray-800"
            key={post.id}
          >
            <div>
              <h1 className="text-white antialiased tracking-wider">
                {post.postedBy}
              </h1>
            </div>
            <div>
              <div className="break-words bg-gray-800/20 p-2 rounded-sm">
                <p className=" antialiased text-gray-100 font-semibold mt-3 mb-3">
                  {post.post}
                </p>
              </div>
              <p className="text-xs text-gray-400">{post.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
