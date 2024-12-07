import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

function LandingPage() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-700 flex flex-col items-center justify-center text-white px-6 sm:px-12">
      {/* Logo or Icon */}
      <div className="mb-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold">🌐</h1>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center">
        Welcome to AI-Powered Content Summarizer
      </h2>

      {/* Subtitle */}
      <p className="text-base sm:text-lg mb-8 text-center max-w-lg">
        Paste any website URL and get an instant summary! Streamline your workflow and stay informed effortlessly.
      </p>

      {/* Guest Login Button */}
      <button
        onClick={handleGuestLogin}
        className="flex items-center bg-white text-blue-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:bg-blue-100 hover:text-blue-700 transition duration-300 transform hover:scale-105"
      >
        <FiLogIn className="mr-2" size={20} /> Guest Login
      </button>
    </div>
  );
}

export default LandingPage;



