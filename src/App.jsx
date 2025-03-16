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
const [user, setUser] = useState({});

  const checkLoginStatus = async () => {
    try {
      const response = await getRequest("/check-login");
      console.log('Response:', response);
      const { loggedIn } = response;
      console.log('logged in:', loggedIn);
    if(response.loggedIn) {
        setIsLoggedIn(true);
        setUser(response.user);
      }
    } catch (error) {
      console.error("Check login status error:", error);
      if(error.message === "Unauthorized") {
        setIsLoggedIn(false);
    }
    }
  };
  
  useEffect(() => {
    checkLoginStatus();
  }
  , [isLoggedIn]);

  console.log('Is logged in:', isLoggedIn);


  return (
    <Router>
      <div className="App">
      <Navvbar isLoggedIn={isLoggedIn}/>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-album" element={<CreateAlbum />} />
          <Route path="/album/:id" element={<SelectedAlbumView />} />
          <Route path="/profile" element={<Profile user={user}/>} />
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
