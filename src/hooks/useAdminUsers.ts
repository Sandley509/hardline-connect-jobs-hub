
import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/types/adminUsers";
import { useAdminUserMutations } from "./useAdminUserMutations";
import { 
  fetchAllProfiles, 
  fetchAdminRoles, 
  fetchRelatedUserData, 
  processUserData 
} from "@/utils/adminUserHelpers";

export const useAdminUsers = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<UserProfile[]> => {
      try {
        const { allProfiles, currentUserId } = await fetchAllProfiles();
        
        if (!allProfiles || allProfiles.length === 0) {
          console.log('No profiles found in database');
          return [];
        }

        const adminUserIds = await fetchAdminRoles();
        const { userStatuses, userProfiles, allOrders, authUsers } = await fetchRelatedUserData();

        const processedUsers = processUserData(
          allProfiles,
          currentUserId,
          adminUserIds,
          userStatuses,
          userProfiles,
          allOrders,
          authUsers
        );

        console.log('Final processed users count:', processedUsers.length);
        console.log('Final processed users:', processedUsers);
        return processedUsers;
      } catch (error) {
        console.error('Critical error in useAdminUsers:', error);
        throw error;
      }
    }
  });

  const mutations = useAdminUserMutations();

  return {
    users,
    isLoading,
    error,
    ...mutations
  };
};
