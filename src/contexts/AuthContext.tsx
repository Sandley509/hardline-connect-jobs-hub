
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType, UserProfile } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import {
  loginUser,
  signupUser,
  logoutUser,
  updateUserProfile,
  changeUserPassword
} from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, session, loading, isAdmin, setIsAdmin } = useAuthState();

  const login = async (email: string, password: string): Promise<boolean> => {
    return loginUser(email, password);
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    return signupUser(username, email, password);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !session) return;

    await updateUserProfile(user.id, data);
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return changeUserPassword(newPassword);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      logout,
      signup,
      updateProfile,
      changePassword,
      isAdmin,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
