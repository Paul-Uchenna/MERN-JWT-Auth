import axios from "axios";
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/context";

export default function Login() {
  const [state, setState] = useState<"Sign Up" | "Login">("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }

  const { backendUrl, setIsLoggedIn, getUserData } = context;
  const navigate = useNavigate();

  const toggleState = () => {
    setState((prevState) => (prevState === "Sign Up" ? "Login" : "Sign Up"));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    const dataToSend =
      state === "Sign Up"
        ? { ...formData }
        : { email: formData.email, password: formData.password };

    try {
      const endpoint = state === "Sign Up" ? "register" : "login";
      const { data } = await axios.post(
        `${backendUrl}/api/auth/${endpoint}`,
        dataToSend
      );

      console.log("Response from backend:", data);

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        if (state === "Sign Up") toast.success(`Account created successfully!`);
        else toast.success("Login successful!");

        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Error during request:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong! Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-10">
          {state === "Sign Up" ? "Create Account" : "Log in"}
        </h2>

        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="flex items-center gap-3 w-full px-5 py-3 mb-4 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="Person Icon" />
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                placeholder="Full name"
                required
                className="bg-transparent outline-none"
                aria-label="Full Name"
              />
            </div>
          )}

          <div className="flex items-center gap-3 w-full px-5 py-3 mb-4 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              placeholder="Email"
              required
              className="bg-transparent outline-none"
              aria-label="Email"
            />
          </div>

          <div className="flex items-center gap-3 w-full px-5 py-3 mb-4 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              placeholder="Enter your password"
              required
              className="bg-transparent outline-none"
              aria-label="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold"
          >
            {state === "Sign Up" ? "Sign Up" : "Log in"}
          </button>
        </form>
        <div className="text-indigo-500 text-center my-4 cursor-pointer">
          {state === "Sign Up" ? (
            <p>
              By signing up, you agree to our{" "}
              <span className="text-blue-400 cursor-pointer underline">
                Terms
              </span>{" "}
              &{" "}
              <span className="text-blue-400 cursor-pointer underline">
                Conditions
              </span>
            </p>
          ) : (
            <p onClick={() => navigate("/reset-password")}>
              Forgot your password?
            </p>
          )}
        </div>

        <p className="text-center text-sm text-gray-400">
          {state === "Sign Up" ? (
            <>
              Already have an account{" "}
              <span
                className="text-blue-400 cursor-pointer underline"
                onClick={toggleState}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account{" "}
              <span
                className="text-blue-400 cursor-pointer underline"
                onClick={toggleState}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
