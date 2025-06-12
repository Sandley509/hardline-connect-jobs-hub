
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';

export const fetchUserProfile = async (authUser: User): Promise<{ user: UserProfile | null; isAdmin: boolean }> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { user: null, isAdmin: false };
    }

    // Check if user is admin using the new admins table
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('is_admin', { _user_id: authUser.id });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
    }

    const isAdmin = !!adminCheck;

    const user = profile ? {
      id: profile.id,
      username: profile.username || 'User',
      email: authUser.email || '',
      created_at: profile.created_at
    } : null;

    return { user, isAdmin };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { user: null, isAdmin: false };
  }
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
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
    throw error;
  }
};

export const signupUser = async (username: string, email: string, password: string): Promise<boolean> => {
  try {
    console.log('Starting signup process for:', email);
    console.log('Username:', username);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        },
        emailRedirectTo: 'https://hardlineconnect.store'
      }
    });

    console.log('Signup response:', { data, error });

    if (error) {
      console.error('Signup error details:', {
        message: error.message,
        status: error.status,
        code: error.code || 'No code',
        name: error.name || 'No name'
      });
      throw error;
    }

    if (data.user) {
      console.log('User created successfully:', data.user.id);
      
      // If user needs email confirmation, let them know
      if (!data.session) {
        console.log('Email confirmation required');
      } else {
        console.log('User signed up and logged in immediately');
      }
    }

    return !!data.user;
  } catch (error) {
    console.error('Signup error in catch block:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: data.username,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Update profile error:', error);
    }
  } catch (error) {
    console.error('Update profile error:', error);
  }
};

export const changeUserPassword = async (newPassword: string): Promise<boolean> => {
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
