import React, { useState, useEffect } from 'react';
import { postRequest } from './utils/api';  // Make sure to import the utility function

import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();  // To get the state passed through navigation
  const { email } = location.state || {};  // Destructure the email
  const navigate = useNavigate();  // To handle navigation (e.g., for logout or redirect)
  const [albums, setAlbums] = useState([]);


//   const fetchAlbums = async () => {
//     try {
//       // Fetch albums from the server
//         const data = await postRequest("/albums", { email, password });
//     }
//     catch (error) {
//         console.error('Error fetching albums:', error);
//         throw error;
//         }
//   };

//     useEffect(() => {
//     fetchAlbums();
//     }, []);

  // Handle create album
  const handleCreateAlbum = () => {
    console.log('Creating a new album...');
    // You can add the logic to create a new album here, e.g., open a modal or redirect
  };

  // Handle adding image to album
  const handleAddImageToAlbum = () => {
    console.log('Adding image to album...');
    // You can add the logic for selecting and uploading an image to an album here
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Make a request to the backend to clear the cookie
      await postRequest("/logout");
      // Remove any local storage or session data if necessary
      localStorage.removeItem('token'); // If you store anything in local storage
      alert("Successfully logged out"); // Optional feedback for user
      // Redirect the user to the login page
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <div>
      <h1>Dashboard</h1>
      {email && <p>Welcome back, {email}!</p>}
      
      {/* Buttons */}
      <div>
        <button onClick={handleCreateAlbum}>Create Album</button>
        <button onClick={handleAddImageToAlbum}>Add Image to Album</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
