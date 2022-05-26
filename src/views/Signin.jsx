import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../features/state/globalState";

const API = "https://short-chat-backend.herokuapp.com/signin";
// const API = "http://localhost:8080/signin";

async function signIn(data) {
  try {
    console.log(data);
    const signin = await axios.post(API, qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(signin);
    return signin.data;
  } catch (error) {
    console.log(error);
  }
}

export default function Signin() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [isLoading, setisLoading] = useState(false);

  async function handleSignin(e) {
    e.preventDefault();
    setisLoading(true);
    seterror("");
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    const response = await signIn(data);
    console.log(response);
    if ("error" in response) {
      seterror(response.error);
      setisLoading(false);
    }
    if ("accessToken" in response) {
      setisLoading(false);

      setemail("");
      setpassword("");

      localStorage.setItem("user", JSON.stringify(response));
      dispatch(setToken(response));
      console.log(JSON.parse(localStorage.getItem("user")));
      navigate("/");
    }
    setisLoading(false);
  }

  return (
    <>
      <div className=" h-[100vh] w-[100vw] flex justify-center items-center">
        <div className="card w-72 m-auto shadow-xl p-3 border-[1px] rounded-sm border-gray-800/60">
          <h1 className="text-white font-bold text-lg">Sign in</h1>
          <form onSubmit={handleSignin} className=" flex flex-col items-center">
            <div>
              <input
                className=" p-3 px-3 mb-3 mt-3 outline-none"
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
              {/* <button className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5">
                Login
              </button> */}

              {isLoading ? (
                <button
                  disabled
                  className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5"
                >
                  <div className="h-7 w-7 m-auto rounded-full border-2 border-t-gray-700/70 animate-spin border-l-white border-r-white border-b-white"></div>
                </button>
              ) : (
                <button className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5">
                  Login
                </button>
              )}
              <Link to="/signup">
                <button className=" uppercase text-white font-semibold bg-slate-700 py-2 px-5 mt-3">
                  Sign up
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
