import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { loading, forgotPassword } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to process your request. Please try again.");
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
          <h2 className="mt-2 text-xl font-semibold text-gray-800">Reset your password</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you reset instructions"}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
              {loading ? "Sending..." : "Send reset instructions"}
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700">
            <p className="text-sm">
              We've sent password reset instructions to your email. Please check your inbox.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;