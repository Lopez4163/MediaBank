import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#242424] text-white p-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-500">
          Welcome to MediaBank!
        </h1>
        <p className="text-lg mb-8 text-gray-300 leading-relaxed">
          Your one-stop solution for organizing and storing your media files securely and efficiently. 
          Create albums, upload images, and keep your memories safe — all in one place.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-all shadow-md"
          >
            Get Started
          </Link>
          <Link
            to="/Login"
            className="px-6 py-3 border-2 border-purple-500 text-purple-400 font-semibold rounded-full hover:bg-purple-500 hover:text-white transition-all shadow-md"
          >
            Login
          </Link>
        </div>
      </div>
      
      {/* Subtle background styling */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-purple-500/10 blur-3xl"></div>
      </div>
    </div>
  );
};

export default HomePage;
