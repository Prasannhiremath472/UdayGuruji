import { Navigate, Outlet } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function CustomerProtectedRoute() {
  const { isAuthenticated } = useCustomerAuth();
  if (!isAuthenticated) {
    return <Navigate to="/account/login" replace />;
  }
  return <Outlet />;
}
