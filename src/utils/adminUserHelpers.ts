
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
  try {
    // Fetch each data source individually with proper error handling
    const [userStatusResult, userProfilesResult, ordersResult, authUsersResult] = await Promise.allSettled([
      supabase.from('user_status').select('*'),
      supabase.from('user_profiles').select('*'),
      supabase.from('orders').select('user_id, total_amount'),
      supabase.auth.admin.listUsers()
    ]);

    // Handle user statuses
    let userStatuses: any[] = [];
    if (userStatusResult.status === 'fulfilled' && userStatusResult.value.data) {
      userStatuses = userStatusResult.value.data;
    } else if (userStatusResult.status === 'rejected') {
      console.error('Error fetching user statuses:', userStatusResult.reason);
    }

    // Handle user profiles
    let userProfiles: any[] = [];
    if (userProfilesResult.status === 'fulfilled' && userProfilesResult.value.data) {
      userProfiles = userProfilesResult.value.data;
    } else if (userProfilesResult.status === 'rejected') {
      console.error('Error fetching user profiles:', userProfilesResult.reason);
    }

    // Handle orders
    let allOrders: any[] = [];
    if (ordersResult.status === 'fulfilled' && ordersResult.value.data) {
      allOrders = ordersResult.value.data;
    } else if (ordersResult.status === 'rejected') {
      console.error('Error fetching orders:', ordersResult.reason);
    }

    // Handle auth users - this has a different structure
    let authUsers: any[] = [];
    if (authUsersResult.status === 'fulfilled') {
      const authResponse = authUsersResult.value;
      if (authResponse && authResponse.data && Array.isArray(authResponse.data.users)) {
        authUsers = authResponse.data.users;
      }
    } else {
      console.error('Error fetching auth users:', authUsersResult.reason);
    }

    console.log('User statuses found:', userStatuses.length);
    console.log('User profiles found:', userProfiles.length);
    console.log('Orders found:', allOrders.length);
    console.log('Auth users found:', authUsers.length);

    return { userStatuses, userProfiles, allOrders, authUsers };
  } catch (error) {
    console.error('Error in fetchRelatedUserData:', error);
    return { 
      userStatuses: [], 
      userProfiles: [], 
      allOrders: [], 
      authUsers: [] 
    };
  }
};

export const processUserData = (
  allProfiles: any[],
  currentUserId: string | undefined,
  adminUserIds: string[],
  userStatuses: any[],
  userProfiles: any[],
  allOrders: any[],
  authUsers: any[] = []
): UserProfile[] => {
  return allProfiles
    .filter(profile => {
      // Exclude current user (admin viewing the page)
      if (profile.id === currentUserId) {
        console.log('Excluding current user:', profile.id);
        return false;
      }
      
      // Exclude all admin users - we only want to show regular users
      if (adminUserIds.includes(profile.id)) {
        console.log('Excluding admin user:', profile.id);
        return false;
      }
      
      console.log('Including regular user:', profile.id, profile.username);
      return true;
    })
    .map((profile) => {
      try {
        const status = userStatuses.find(s => s.user_id === profile.id);
        const userProfile = userProfiles.find(up => up.user_id === profile.id);
        const userOrders = allOrders.filter(order => order.user_id === profile.id) || [];
        const authUser = authUsers.find(au => au.id === profile.id);
        
        const orderCount = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => {
          const amount = parseFloat(order.total_amount?.toString() || '0');
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        // Use real email from auth user if available, otherwise fallback to generated email
        let email = authUser?.email || `${profile.username || `user${profile.id.slice(0, 8)}`}@example.com`;
        
        const processedUser = {
          id: profile.id,
          username: profile.username || `User_${profile.id.slice(0, 8)}`,
          email,
          created_at: profile.created_at,
          is_blocked: status?.is_blocked || false,
          blocked_reason: status?.blocked_reason || null,
          order_count: orderCount,
          total_spent: totalSpent,
          is_admin: false // These are all regular users now
        };

        console.log('Processed regular user:', processedUser);
        return processedUser;
      } catch (err) {
        console.error('Error processing user:', profile.id, err);
        return {
          id: profile.id,
          username: profile.username || `User_${profile.id.slice(0, 8)}`,
          email: `${profile.username || `user${profile.id.slice(0, 8)}`}@example.com`,
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
