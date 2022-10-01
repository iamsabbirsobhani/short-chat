import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../features/state/globalState";

// const API = "https://short-chat-backend.herokuapp.com/signup";
const API = "http://localhost:8083/signup";

async function signUp(data) {
  try {
    // console.log(data);
    const signup = await axios.post(API, qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(signup);
    return signup.data;
  } catch (error) {
    console.log(error);
  }
}

export default function Signup() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [isLoading, setisLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setisLoading(true);
    seterror("");
    const data = {
      email: email,
      name: name,
      password: password,
    };
    // console.log(data);
    const response = await signUp(data);
    // console.log(response);
    if ("error" in response) {
      seterror(response.error);
      setisLoading(false);
    }
    if ("accessToken" in response) {
      setisLoading(false);

      setname("");
      setemail("");
      setpassword("");
      localStorage.setItem("user", JSON.stringify(response));
      dispatch(setToken(response));
      // console.log(JSON.parse(localStorage.getItem("user")));
      navigate("/");
    }
    setisLoading(false);
  }
  return (
    <>
      <div className=" h-[100vh] w-[100vw] flex justify-center items-center">
        <div className="card w-72 m-auto shadow-xl p-3 border-[1px] rounded-sm border-gray-800/60">
          <h1 className="text-white font-bold text-lg">Sign up</h1>
          <form onSubmit={handleSignup} className=" flex flex-col items-center">
            <div>
              <input
                className=" p-3 px-3 mb-3 mt-3 outline-none"
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div>
              <input
                className=" p-3 px-3 mb-3 outline-none"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
            <div>
              <input
                className=" p-3 px-3 mb-3 outline-none"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
            <div>
              {error && (
                <p className="  mt-2 mb-2 font-semibold text-red-500">
                  {error}
                </p>
              )}
            </div>

            <div className=" text-center flex flex-col">
              {isLoading ? (
                <button
                  disabled
                  className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5"
                >
                  <div className="h-7 w-7 m-auto rounded-full border-2 border-t-gray-700/70 animate-spin border-l-white border-r-white border-b-white"></div>
                </button>
              ) : (
                <button className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5">
                  Sign up
                </button>
              )}

              <Link to="/signin">
                <button className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5 mt-3">
                  Login
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
