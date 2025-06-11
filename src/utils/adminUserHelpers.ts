import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/adminUsers";

export const fetchAllProfiles = async () => {
  const { data: currentUser } = await supabase.auth.getUser();
  const currentUserId = currentUser.user?.id;

  console.log('Current user ID:', currentUserId);

  const { data: allProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Profiles query result:', { allProfiles, profilesError });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  return { allProfiles, currentUserId };
};

export const fetchAdminRoles = async () => {
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('user_id');

  if (adminError) {
    console.error('Error fetching admin roles:', adminError);
    return [];
  }

  return adminData?.map(admin => admin.user_id) || [];
};

export const fetchRelatedUserData = async () => {
  const [statusRes, profilesRes, ordersRes, authUsersRes] = await Promise.all([
    supabase.from('user_status').select('*'),
    supabase.from('user_profiles').select('*'),
    supabase.from('orders').select('*'),
    supabase.auth.admin.listUsers()
  ]);

  return {
    userStatuses: statusRes.data || [],
    userProfiles: profilesRes.data || [],
    allOrders: ordersRes.data || [],
    authUsers: authUsersRes.data?.users || []
  };
};

export const processUserData = (
  allProfiles: any[],
  currentUserId: string | undefined,
  adminUserIds: string[],
  userStatuses: any[],
  userProfiles: any[],
  allOrders: any[],
  authUsers: any[]
): UserProfile[] => {
  const processedUsers = allProfiles.map(profile => {
    const authUser = authUsers.find(u => u.id === profile.id);
    const userStatus = userStatuses.find(status => status.user_id === profile.id);
    const userProfile = userProfiles.find(up => up.user_id === profile.id);
    const userOrders = allOrders.filter(order => order.user_id === profile.id);
    
    const isCurrentUser = profile.id === currentUserId;
    const isAdmin = adminUserIds.includes(profile.id);

    return {
      id: profile.id,
      username: profile.username || 'Unknown',
      email: authUser?.email || 'No email',
      role: isAdmin ? 'admin' : 'user',
      isBlocked: userStatus?.is_blocked || false,
      blockedReason: userStatus?.blocked_reason || null,
      blockedAt: userStatus?.blocked_at || null,
      blockedBy: userStatus?.blocked_by || null,
      lastLoginAt: authUser?.last_sign_in_at || null,
      createdAt: profile.created_at,
      created_at: profile.created_at, // Fix: Add created_at property
      orderCount: userOrders.length,
      isCurrentUser,
      profile: userProfile || null
    };
  });

  console.log('Processed users:', processedUsers);
  return processedUsers;
};
