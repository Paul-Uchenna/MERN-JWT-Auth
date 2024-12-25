import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.ts";
import { AppContext } from "../context/context.tsx";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { userData, backendUrl, setUserData, setIsLoggedIn } = context;

  const sendVerificationEOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success("Verification email sent successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const logOut = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/auth/logout`);
      data.success && setIsLoggedIn(false);
      data.success && setUserData(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full absolute top-0 flex justify-between items-center p-4 sm:p-6 sm:px-24">
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none p-2 m-0 bg-gray-100 text-sm">
              {!userData.isVerified && (
                <li
                  onClick={sendVerificationEOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logOut}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login In <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
}