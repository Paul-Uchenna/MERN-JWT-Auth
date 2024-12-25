import { useContext } from "react";
import { assets } from "../assets/assets.ts";
import { AppContext } from "../context/context.tsx";

export default function Header() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { userData } = context;
  return (
    <div className="flex flex-col items-center mt-15 text-center text-gray-800 p-4">
      <img
        src={assets.header_img}
        alt="header"
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 select-none">
        Hey{userData ? `, ${userData.name}` : " Developer"}!
        <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
      </h1>

      <h2 className="text-5xl sm:tetx-7xl font-semibold mb-4">
        Welcome to our App
      </h2>
      <p className="mb-8 max-w-md">
        Master the MERN Stack by building a complete authentication system!
        Learn to implement login, registration, password reset, and email
        verification with JWT and OTP—all in React.
      </p>
      <button className="border border-gray-500 rounded-full px-8 py-3 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
}
