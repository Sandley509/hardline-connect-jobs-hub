import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'moderator' | 'user';
  created_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isAdmin: boolean;
  isModerator: boolean;
  isModeratorOrAdmin: boolean;
  loading: boolean;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Check user role using the new functions
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('is_admin', { _user_id: authUser.id });

      const { data: moderatorCheck, error: moderatorError } = await supabase
        .rpc('is_moderator', { _user_id: authUser.id });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }
      if (moderatorError) {
        console.error('Error checking moderator status:', moderatorError);
      }

      let userRole: 'admin' | 'moderator' | 'user' = 'user';
      if (adminCheck) {
        userRole = 'admin';
      } else if (moderatorCheck) {
        userRole = 'moderator';
      }

      if (profile) {
        setUser({
          id: profile.id,
          username: profile.username || 'User',
          email: authUser.email || '',
          role: userRole,
          created_at: profile.created_at
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        
        // Re-throw the error with more specific information for email confirmation issues
        if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
          const enhancedError = new Error('Email not confirmed') as Error & { code: string };
          enhancedError.code = 'email_not_confirmed';
          throw enhancedError;
        }
        
        throw error;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw so the component can handle it
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !session) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        return;
      }

      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Change password error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
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
      isAdmin: user?.role === 'admin',
      isModerator: user?.role === 'moderator',
      isModeratorOrAdmin: user?.role === 'admin' || user?.role === 'moderator',
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
