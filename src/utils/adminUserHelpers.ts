
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/adminUsers";

export const fetchAllProfiles = async () => {
  console.log('Fetching all users for admin...');
  
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  console.log('Current admin user ID:', currentUser?.id);

  const { data: allProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  console.log('Total profiles found:', allProfiles?.length || 0);
  return { allProfiles: allProfiles || [], currentUserId: currentUser?.id };
};

export const fetchAdminRoles = async () => {
  try {
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.error('Error fetching admin roles:', rolesError);
      return [];
    }

    console.log('Admin roles found:', adminRoles?.length || 0);
    const adminUserIds = adminRoles?.map(role => role.user_id) || [];
    console.log('Admin user IDs:', adminUserIds);
    return adminUserIds;
  } catch (err) {
    console.error('Failed to fetch admin roles:', err);
    return [];
  }
};

export const fetchRelatedUserData = async () => {
  const promises = [
    supabase.from('user_status').select('*'),
    supabase.from('user_profiles').select('*'),
    supabase.from('orders').select('user_id, total_amount')
  ];

  const results = await Promise.allSettled(promises);
  
  const userStatuses = results[0].status === 'fulfilled' ? results[0].value.data || [] : [];
  const userProfiles = results[1].status === 'fulfilled' ? results[1].value.data || [] : [];
  const allOrders = results[2].status === 'fulfilled' ? results[2].value.data || [] : [];

  if (results[0].status === 'rejected') {
    console.error('Error fetching user statuses:', results[0].reason);
  }
  if (results[1].status === 'rejected') {
    console.error('Error fetching user profiles:', results[1].reason);
  }
  if (results[2].status === 'rejected') {
    console.error('Error fetching orders:', results[2].reason);
  }

  console.log('User statuses found:', userStatuses.length);
  console.log('User profiles found:', userProfiles.length);
  console.log('Orders found:', allOrders.length);

  return { userStatuses, userProfiles, allOrders };
};

export const processUserData = (
  allProfiles: any[],
  currentUserId: string | undefined,
  adminUserIds: string[],
  userStatuses: any[],
  userProfiles: any[],
  allOrders: any[]
): UserProfile[] => {
  return allProfiles
    .filter(profile => {
      if (profile.id === currentUserId) {
        console.log('Excluding current user:', profile.id);
        return false;
      }
      
      if (adminUserIds.includes(profile.id)) {
        console.log('Excluding confirmed admin user:', profile.id);
        return false;
      }
      
      console.log('Including user:', profile.id, profile.username);
      return true;
    })
    .map((profile) => {
      try {
        const status = userStatuses.find(s => s.user_id === profile.id);
        const userProfile = userProfiles.find(up => up.user_id === profile.id);
        const userOrders = allOrders.filter(order => order.user_id === profile.id) || [];
        
        const orderCount = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => {
          const amount = parseFloat(order.total_amount?.toString() || '0');
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        let email = profile.username ? `${profile.username}@example.com` : `user${profile.id.slice(0, 8)}@example.com`;
        if (userProfile?.first_name && userProfile?.last_name) {
          email = `${userProfile.first_name.toLowerCase()}.${userProfile.last_name.toLowerCase()}@example.com`;
        }

        const processedUser = {
          id: profile.id,
          username: profile.username || `User_${profile.id.slice(0, 8)}`,
          email,
          created_at: profile.created_at,
          is_blocked: status?.is_blocked || false,
          blocked_reason: status?.blocked_reason || null,
          order_count: orderCount,
          total_spent: totalSpent,
          is_admin: false
        };

        console.log('Processed user:', processedUser);
        return processedUser;
      } catch (err) {
        console.error('Error processing user:', profile.id, err);
        return {
          id: profile.id,
          username: profile.username || `User_${profile.id.slice(0, 8)}`,
          email: profile.username ? `${profile.username}@example.com` : `user${profile.id.slice(0, 8)}@example.com`,
          created_at: profile.created_at,
          is_blocked: false,
          blocked_reason: null,
          order_count: 0,
          total_spent: 0,
          is_admin: false
        };
      }
    });
};
