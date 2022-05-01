import avatar from "../assets/avatar.png";
export default function Navbar() {
  return (
    <div className=" text-white m-auto w-[350px] p-3 bg-gray-800/40">
      <div className=" flex items-center justify-center">
        <img className=" w-9 mr-3" src={avatar} alt="" />
        <h1 className=" font-semibold text-xl">Rehan Wangsaff</h1>
        <div className=" ml-3 border-none w-2  h-2 bg-green-500 rounded-full"></div>
      </div>
    </div>
  );
}
