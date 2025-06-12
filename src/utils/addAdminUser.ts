
import { supabase } from "@/integrations/supabase/client";

export const addAdminUser = async (email: string) => {
  try {
    // First, get the user ID for the email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return false;
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found with email:', email);
      return false;
    }

    // Add user to admins table
    const { data, error } = await supabase
      .from('admins')
      .insert([
        { user_id: user.id }
      ])
      .select();

    if (error) {
      console.error('Error adding admin:', error);
      return false;
    }

    console.log('Successfully added admin:', data);
    return true;
  } catch (error) {
    console.error('Error in addAdminUser:', error);
    return false;
  }
};
