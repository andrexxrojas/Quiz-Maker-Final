import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return; // Waiting for loading state
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to home if not authenticated
  }

  return children;
};

export default ProtectedRoute;