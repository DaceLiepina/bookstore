import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user?.isAuthenticated) {
    // Redirect to login page, but save the attempted location
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Additional check for admin routes
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
