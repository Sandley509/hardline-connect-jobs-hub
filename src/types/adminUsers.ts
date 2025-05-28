
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_blocked?: boolean;
  blocked_reason?: string;
  order_count?: number;
  total_spent?: number;
  is_admin?: boolean;
}
