import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const { verifyEmail, loading } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!verificationCode.trim()) {
      setError("Verification code is required");
      return;
    }

    try {
      const response = await verifyEmail(verificationCode);
      if (response) {
        navigate("/personal-details/" + response._id);
      }
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    }
  };

  // Handle code input, restrict to numbers only and format with spaces
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    setVerificationCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-600">Eat</span>
            <span className="text-green-600">iT</span>
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">Verify your email</h2>
          <p className="mt-1 text-sm text-gray-500">
            Please enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="mt-1">
              <input
                id="code"
                name="code"
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="Enter your verification code"
                className={`px-4 py-2 w-full border text-center text-lg tracking-wider rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={6}
              />
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
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;