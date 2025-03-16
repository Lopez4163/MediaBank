import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import { postRequest } from './utils/api';

const SignUpPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUpAndLogin = async ({ email, password }) => {
    setLoading(true);
    setError(""); // Reset previous errors
  
    try {
      // Sign up user
      const signUpData = await postRequest("/signup", { email, password });
      console.log("Sign-up successful:", signUpData);

      // Log in user
      const loginData = await postRequest("/login", { email, password });
      console.log("Login successful:", loginData);

      // Save user ID to local storage
      localStorage.setItem('userId', loginData.user.id);

      // Navigate to dashboard
      navigate('/dashboard', { state: { email } });
  
    } catch (error) {
      setError(error.message || "An error occurred during sign-up/login");
      console.error("Error during sign-up/login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <SignUpForm 
          onSubmit={handleSignUpAndLogin} 
          title="Create an Account" 
          loading={loading}
        />

        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/">
            <button 
              disabled={loading}
              className={`mt-2 bg-gray-500 text-white w-full py-3 rounded-lg hover:bg-gray-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
