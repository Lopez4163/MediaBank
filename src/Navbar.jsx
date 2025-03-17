import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postRequest, getRequest } from './utils/api';

const Navbar = ({ isLoggedIn, checkLoginStatus }) => {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userId, setUserId] = useState(null);

  // const checkLoginStatus = async () => {
  //   try {
  //     const response = await getRequest("/check-login");
  //     const { loggedIn, user } = response;

  //     if (loggedIn) {
  //       setIsLoggedIn(true);
  //       setUserId(user.userId);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   } catch (error) {
  //     setIsLoggedIn(false);
  //   }
  // };

  // useEffect(() => {
  //   checkLoginStatus();
  // }, []);

    const handleLogout = async () => {
      try {
        confirm("Are you sure you want to logout?");
        if(confirm) {
          console.log("Logging out...");
          await postRequest("/logout");
          localStorage.removeItem('token');
          alert("Successfully logged out");
          await checkLoginStatus();
          navigate('/');
        } 
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
  
  return (
    <nav className="bg-white shadow-md w-full fixed z-10">
      <div className="p-2">
        <ul className="flex justify-around items-center h-16">
          {/* Logo */}
          <li>
            <Link
              onClick={() => navigate('/dashboard')}  
              className="text-2xl font-semibold text-gray-800"
            >
              MediaBank
            </Link>
          </li>

          {/* Links and Buttons */}

          {/* Conditionally render links/buttons if user is logged in */}
          {isLoggedIn && (
            <>
                <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 font-bold hover:text-purple-500 transition duration-300"
                >
                  Albums{/* ##WILL BE LATER DASHBOARD  */}
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-album" 
                  className="text-gray-600 font-bold hover:text-purple-500 transition duration-300"
                >
                  Create Album
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-600 font-bold hover:text-purple-500 transition duration-300"
                >
                  Profile
                </Link>
              </li>
              {/* <li>
                <Link 
                  to="/albums" 
                  className="text-gray-600 font-bold hover:text-purple-500 transition duration-300"
                >
                  Albums
                </Link>
              </li> */}
              {/* <li>
                <button 
                  className="bg-blue-500 text-white p-1.5 rounded-lg  hover:bg-blue-600 transition duration-300 hover:cursor-pointer"
                >
                  Upload Image
                </button>
              </li> */}
              <li>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white font-bold p-2 rounded-lg hover:bg-red-700 transition duration-300 hover:cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Show Login/Signup link if not logged in */}
          {/* {!isLoggedIn && (
            <li>
              <Link
                to="/login"
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 hover:cursor-pointer"
              >
                Login
              </Link>
            </li>
          )} */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
