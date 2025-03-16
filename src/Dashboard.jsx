import React, { useState, useEffect } from 'react';
import Navvbar from './Navbar';  // Import the Navbar component
import { getRequest, postRequest, deleteRequest } from './utils/api';  // Make sure to import the utility function
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardView from './DashboardView';
import CreateAlbum from './CreateAlbum';

const Dashboard = () => {
  const location = useLocation();  // To get the state passed through navigation
  const { email } = location.state || {};  // Destructure the email
  const navigate = useNavigate();  // To handle navigation (e.g., for logout or redirect)
  const [albums, setAlbums] = useState([]);


    // Fetch albums
    const fetchAlbums = async () => {
        try {
            // Make a request to the backend to fetch albums
            const data = await getRequest("/albums");
            console.log("Albums data:", data);
            setAlbums(data.albums);
        } catch (error) {
            console.error("Fetch albums error:", error);
        }
    };

    const deleteAlbums = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this album?");
    
        if (!isConfirmed) return;
    
        try {
            // Make a request to the backend to delete an album
            const data = await deleteRequest(`/albums/${id}/delete`);
            console.log("Album deleted:", data);
            alert("Album deleted successfully!");
            setAlbums(albums.filter((album) => album.id !== id));

        } catch (error) {
            console.error("Delete album error:", error);
        }
    }
    

    useEffect(() => {
        try {
            fetchAlbums();
        } catch (error) {
            console.error("Fetch albums error:", error);
        }
    }, []);

  

  return (
    <div>
      {/* <Navvbar/> */}
      {email && <p>Welcome back, {email}!</p>}
      <DashboardView albums={albums} handleDelete={deleteAlbums} />
    </div>
  );
};

export default Dashboard;
