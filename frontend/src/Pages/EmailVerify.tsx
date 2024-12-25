import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/context";

export default function EmailVerify() {
  axios.defaults.withCredentials = true;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { backendUrl, getUserData, isLoggedIn, userData } = context;

  const handleInputChange = (
    e: React.FormEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      e.currentTarget.value.length === 0 &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    for (let i = 0; i < paste.length; i++) {
      const input = inputRefs.current[i];
      if (input) input.value = paste[i];
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    try {
      e.preventDefault();
      const otp = inputRefs.current.map((input) => input?.value).join("");

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp }
      );

      if (data.success) {
        getUserData();
        toast.success("Email verified successfully!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error verifying email:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    isLoggedIn && userData?.isVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email verify OTP
        </h1>
        <p className="text-indigo-300 text-center mb-4">
          Please check your email for the verification OTP and enter it below.
        </p>

        <div onPaste={handlePaste} className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                required
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-white text-xl bg-[#333A5C] rounded-md outline-none"
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify email
        </button>
      </form>
    </div>
  );
}
