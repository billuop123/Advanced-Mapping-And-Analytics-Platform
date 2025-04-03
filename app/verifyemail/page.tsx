"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  const verifyUserEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/v1/verifyEmail", { token });
      setVerified(true);
    } catch (err:any) {
      console.error("Verification failed:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white text-center">Email Verification</h1>
        </div>
        
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 text-lg font-medium">Verifying your email address...</p>
            </div>
          ) : verified ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-green-600 text-xl font-medium text-center">Your email has been verified successfully!</p>
              <p className="text-gray-500 mt-2 text-center">You can now return to the application.</p>
              <a 
                href="/" 
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                Return to Homepage
              </a>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-red-600 text-xl font-medium text-center">Verification Failed</p>
              <p className="text-gray-700 mt-2 text-center">{error}</p>
              <button
                onClick={verifyUserEmail}
                disabled={loading || !token}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Try Again
              </button>
            </div>
          ) : !token ? (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-red-600 text-xl font-medium text-center">Missing Verification Token</p>
              <p className="text-gray-700 mt-2 text-center">
                No verification token was found in the URL. Please check your email and click the verification link again.
              </p>
            </div>
          ) : null}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-gray-500 text-sm text-center">
            If you're experiencing issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}