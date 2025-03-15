import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
