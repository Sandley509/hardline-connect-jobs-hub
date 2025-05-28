
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hardline_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Hardcoded credentials for demo
    if (username === 'Sandley' && password === 'Sawendjy1976@') {
      const userData = {
        username: 'Sandley',
        email: 'sandley@hardlineconnect.com'
      };
      setUser(userData);
      localStorage.setItem('hardline_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // For demo purposes, allow any signup
    const userData = {
      username,
      email
    };
    setUser(userData);
    localStorage.setItem('hardline_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hardline_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('hardline_user', JSON.stringify(updatedUser));
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // For demo purposes, just return true
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
