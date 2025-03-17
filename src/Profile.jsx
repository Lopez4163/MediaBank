import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRequest, postRequest } from './utils/api';
import { useNavigate } from 'react-router-dom';

const Profile = ({ userId }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const fetchUserById = async () => {
    try {
      const data = await getRequest(`/users/${userId}`);
      setUser(data);
      console.log('User by ID:', data);
    } catch (error) {
      console.error('Fetch user by ID error:', error);
    }
  };

  useEffect(() => {
    fetchUserById();
  }
  , [userId]);


  const handleLogout = async () => {
    try {
      confirm("Are you sure you want to logout?");
      if(confirm) {
        console.log("Logging out...");
        await postRequest("/logout");
        localStorage.removeItem('token');
        alert("Successfully logged out");
        navigate('/');
      } 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
                {/* Profile Card */}
                <div className="text-center">
                    {/* <img 
                        src={ "" || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full mx-auto mb-4" 
                    /> */}
                    <h2 className="text-2xl font-semibold text-gray-800">{user?.name || 'John Doe'}</h2>
                    <p className="text-gray-600 mb-4">{user?.email || 'johndoe@example.com'}</p>
                </div>

                {/* Additional Information */}
                <div className="flex flex-col justify-center items-center mb-6">
                    <h3 className="text-xl font-medium text-gray-800">Bio</h3>
                    <p className="text-gray-600">{user?.bio || 'This user has not updated their bio yet.'}</p>
                </div>

                {/* Buttons */}
                <div className="flex justify-around">
                    {/* <Link
                        to="/edit-profile"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Edit Profile
                    </Link> */}
                    <button
                        onClick={() => handleLogout()}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
