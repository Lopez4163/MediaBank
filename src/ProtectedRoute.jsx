import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated (e.g., by checking for a token in cookies)
  const isAuthenticated = document.cookie.includes('token');
  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  return children; // Render children if authenticated
};

export default ProtectedRoute;
