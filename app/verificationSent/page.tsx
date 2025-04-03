"use client"
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmailSent() {
const router=useRouter() 
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1474&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Email Sent</h1>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        
        <div className="border-t border-gray-200 pt-6 mt-2">
          <p className="text-sm text-gray-500 mb-4">
            Didn't receive an email?
          </p>
          
          <button onClick={()=>{router.push("/sendEmailVerification")}} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
            Resend Email
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          Please check your spam folder if you don't see the email in your inbox
        </p>
      </div>
    </div>
  );
}