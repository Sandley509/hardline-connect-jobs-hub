
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRedirect = () => {
  const { user, isModeratorOrAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isModeratorOrAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isModeratorOrAdmin, loading, navigate]);

  return null;
};

export default AdminRedirect;
