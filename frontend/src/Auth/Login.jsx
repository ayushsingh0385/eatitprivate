import { useUserStore } from "../store/useUserStore.js";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { loading, login } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await login(input);
      if (result) navigate("/");
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-600">Eat</span>
            <span className="text-green-600">iT</span>
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Sign in to your nutrition assistant</p>
        </div>

        <form onSubmit={loginSubmitHandler} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                value={input.email}
                onChange={changeEventHandler}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="mt-1 relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={input.password}
                onChange={changeEventHandler}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <LockKeyhole className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors duration-300`}
          >
            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <div className="mx-4 text-gray-500 text-sm">or</div>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;