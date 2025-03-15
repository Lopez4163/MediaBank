import { useState } from "react";
import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { postRequest } from './utils/api';  // Make sure to import the utility function



const LoginPage = () => {
  const [error, setError] = useState(null);
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


const handleLogin = async ({ email, password }) => {
  try {
    // Using the utility function for POST request
    const data = await postRequest("/login", { email, password });

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
    <div>
      <h1>Login Page</h1>
      <LoginForm onSubmit={handleLogin} title="Login" />
      
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <h2>Don't have an Account?</h2>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
