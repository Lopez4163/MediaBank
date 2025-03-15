import { useState } from "react";
import { Link } from "react-router-dom";
import SignUpForm from "./SIgnUpForm";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { postRequest } from './utils/api';  // Import the utility function

const SignUpPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Hook to navigate programmatically


  // const handleLogin = async ({ email, password }) => {
  //   try {
  //     const response = await fetch("http://localhost:3000/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //       credentials: "include", // Make sure cookies are included in the request
  //     });
  
  //     const data = await response.json();
      
  //     if (response.status === 200) {
  //       // Login successful, no need to store the token as it's in the HttpOnly cookie
  //       console.log("Login successful", data);
  //       navigate('/dashboard', { state: { email } });  // Pass email via state

  //       // Redirect or handle login success, e.g., navigate to the dashboard
  //     } else {
  //       // Handle login failure
  //       setError(data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     setError("An error occurred during login");
  //     console.error("Error logging in", error);
  //   }
  // };

  // const handleSignUp = async ({ email, password }) => {
  //   setLoading(true);
  //   setError("");  // Reset previous errors

  //   try {
  //     const response = await fetch("http://localhost:3000/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "An error occurred.");
  //     }

  //     const data = await response.json();

  //     // Handle successful sign-up (e.g., storing the token or redirecting)
  //     console.log("Sign-up successful:", data);
  //     await handleLogin({ email, password });

  //     // Redirect to login or home page, or store the token in localStorage, etc.
  //     // e.g., window.localStorage.setItem("token", data.token);

  //   } catch (error) {
  //     setError(error.message);
  //     console.error("Error signing up:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignUpAndLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");  // Reset previous errors
  
    try {
      // First, sign up the user
      const signUpData = await postRequest("/signup", { email, password });
  
      // Handle successful sign-up
      console.log("Sign-up successful:", signUpData);
  
      // After successful sign-up, log the user in
      const loginData = await postRequest("/login", { email, password });
  
      // Handle successful login
      console.log("Login successful:", loginData);
      navigate('/dashboard', { state: { email } });  // Pass email via state
  
    } catch (error) {
      // Handle errors for both sign-up and login
      setError(error.message || "An error occurred during sign-up/login");
      console.error("Error during sign-up/login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up Page</h1>
      <SignUpForm onSubmit={handleSignUpAndLogin} title="Create an Account" />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <div>
        <h2>Already have an Account?</h2>
        <Link to="/"><button>Log in</button></Link>
      </div>
    </div>
  );
};

export default SignUpPage;
