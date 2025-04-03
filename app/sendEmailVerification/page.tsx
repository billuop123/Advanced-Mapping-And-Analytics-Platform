"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";

export default function SendEmailVerification() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    const { name, id, email } = session.user;
    setName(name);
    setId(id);
    setEmail(email);
    
    const storedLastSent = localStorage.getItem(`email_verification_${id}`);
    if (storedLastSent) {
      const lastSent = parseInt(storedLastSent, 10);
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastSent) / 1000);
      
      if (elapsedSeconds < 60) {
        setLastSentTime(lastSent);
        setCountdown(60 - elapsedSeconds);
      }
    }
  }, [session]);

  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleClick() {
    try {
      const now = Date.now();
      if (lastSentTime && now - lastSentTime < 60000) {
        const remainingSeconds = Math.ceil((60000 - (now - lastSentTime)) / 1000);
        setError(`Please wait ${remainingSeconds} seconds before sending another email.`);
        return;
      }

      setLoading(true);
      setError("");
      setSuccess(false);
      
      await axios.post("/api/v1/sendEmail", {
        userId: id, 
        email
      });
      
      const currentTime = Date.now();
      setLastSentTime(currentTime);
      localStorage.setItem(`email_verification_${id}`, currentTime.toString());
      setCountdown(60);
      setSuccess(true);
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || !id || !email || countdown > 0;

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1474&auto=format&fit=crop')" }}>
      <div className="max-w-md mx-auto p-6 bg-white bg-opacity-90 rounded-lg shadow-md backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Email Verification</h2>
          <p className="text-gray-600 mt-2">
            {email ? `We'll send a verification link to ${email}` : "Please sign in to continue"}
          </p>
        </div>

        <div className="space-y-4">
          {session?.user ? (
            <>
              <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  isDisabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <MdEmail className="h-5 w-5" />
                )}
                {loading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Verification Email"}
              </button>

              {success && (
                <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded">
                  Verification email sent successfully!
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-gray-100 rounded-md text-center text-gray-700">
              Please sign in to verify your email
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
