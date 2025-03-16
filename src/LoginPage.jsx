import { useState } from "react";
import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { postRequest } from './utils/api';  // Make sure to import the utility function

const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Hook to navigate programmatically

  const handleLogin = async ({ email, password }) => {
    try {
      // Using the utility function for POST request
      const data = await postRequest("/login", { email, password });
      localStorage.setItem('userId', data.user.id); 

      // If the response status is 200, navigate to the dashboard
      console.log("Login successful", data);
      navigate('/dashboard', { state: { email } });  // Pass email via state

    } catch (error) {
      // Handle login failure and show the error message
      setError(error.message || "Login failed");
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <LoginForm onSubmit={handleLogin} title="Login" />
        
        <div className="mt-6 text-center">
          <h2 className="text-sm text-gray-700">Don't have an Account?</h2>
          <Link to="/signup">
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 font-medium mt-3">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
