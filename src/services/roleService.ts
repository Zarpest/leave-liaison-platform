
import { supabase } from "@/integrations/supabase/client";

// Check if user is a super admin
export const isSuperAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .maybeSingle();
    
  if (error) {
    console.error('Error checking role:', error);
    return false;
  }
  
  return !!data;
};

// Get user roles
export const getUserRoles = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
  
  return data.map(r => r.role);
};

// Set user role
export const setUserRole = async (userId: string, role: string): Promise<void> => {
  // Validate role
  const validRoles = ['user', 'admin', 'super_admin'];
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }
  
  // First check if the role exists
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .eq('role', role as any)
    .maybeSingle();
    
  // If it doesn't exist, insert it (cast to any to bypass type checking)
  if (!existingRole) {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: role as any });
      
    if (error) {
      console.error('Error setting role:', error);
      throw error;
    }
  }
};

// Promote user to super admin
export const promoteToSuperAdmin = async (userId: string): Promise<void> => {
  await setUserRole(userId, 'super_admin');
};

// Check if any super admin exists
export const checkSuperAdminExists = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('id')
    .eq('role', 'super_admin')
    .limit(1);
    
  if (error) {
    console.error('Error checking super admin:', error);
    return false;
  }
  
  return data && data.length > 0;
};
