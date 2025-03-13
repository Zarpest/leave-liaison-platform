
import { supabase } from "@/integrations/supabase/client";

// Check if user is a super admin
export const isSuperAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !data) {
    console.error('Error checking role:', error);
    return false;
  }
  
  return data.role === 'super_admin';
};

// Set user role
export const setUserRole = async (userId: string, role: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Promote user to super admin
export const promoteToSuperAdmin = async (userId: string): Promise<void> => {
  await setUserRole(userId, 'super_admin');
};

// Check if any super admin exists
export const checkSuperAdminExists = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'super_admin')
    .limit(1);
    
  if (error) {
    console.error('Error checking super admin:', error);
    return false;
  }
  
  return data && data.length > 0;
};
