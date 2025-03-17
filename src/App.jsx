import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Dashboard from './Dashboard';
import CreateAlbum from './CreateAlbum';
import Navvbar from './Navbar';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import SelectedAlbumView from './SelectedAlbumView';
import Profile from './Profile';
import { useState, useEffect } from 'react';
import { getRequest } from './utils/api';


function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userId, setUserId] = useState({});

  const checkLoginStatus = async () => {
    try {
      const response = await getRequest("/check-login");
      console.log('Response:', response);
      const { loggedIn, user } = response;

      if (loggedIn) {
        setIsLoggedIn(true);
        setUserId(user.userId);
        console.log('User ID:', user.userId);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Check login status error:", error);
      setIsLoggedIn(false); // In case of an error, set logged in status to false
    }
  };
  
  useEffect(() => {
    checkLoginStatus();
  }
  , []);

  console.log('Is logged in:', isLoggedIn);


  return (
    <Router>
      <div className="app">
        <Navvbar isLoggedIn={isLoggedIn} checkLoginStatus={checkLoginStatus}/>
        <Routes>
          <Route path="/" element={<LoginPage checkLoginStatus={checkLoginStatus} />} />
          <Route path="/signup" element={<SignUpPage checkLoginStatus={checkLoginStatus}/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-album" element={<CreateAlbum />} />
          <Route path="/album/:id" element={<SelectedAlbumView />} />
          <Route path="/profile" element={<Profile userId={userId}/>} />
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />         */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
