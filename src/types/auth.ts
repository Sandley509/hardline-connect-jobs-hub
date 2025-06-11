
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isAdmin: boolean;
  loading: boolean;
}
