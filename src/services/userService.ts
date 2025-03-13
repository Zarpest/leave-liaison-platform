
import { supabase } from "@/integrations/supabase/client";
import { setUserRole } from "./roleService"; // Add this import to fix the error

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  leave_balance?: LeaveBalance;
  approver?: string;
  approver_id?: string;
  role?: string; // Property for user role
}

export interface LeaveBalance {
  id: string;
  user_id: string;
  vacation_days: number;
  sick_days: number;
  personal_days: number;
}

// Get all users with their balances
export const getAllUsers = async (): Promise<User[]> => {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');
    
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }
  
  // Get leave balances for each user
  const { data: balances, error: balancesError } = await supabase
    .from('leave_balances')
    .select('*');
    
  if (balancesError) {
    console.error('Error fetching balances:', balancesError);
    throw balancesError;
  }
  
  // Create a map of balances by user id
  const balanceMap: Record<string, LeaveBalance> = {};
  balances.forEach(balance => {
    balanceMap[balance.user_id] = balance;
  });
  
  // Create a map of user names for approvers
  const userNameMap: Record<string, string> = {};
  profiles.forEach(profile => {
    userNameMap[profile.id] = profile.name;
  });
  
  // Combine profiles with their balances and approver names
  const users: User[] = profiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    department: profile.department,
    leave_balance: balanceMap[profile.id],
    approver_id: profile.approver_id,
    approver: profile.approver_id ? userNameMap[profile.approver_id] : undefined,
    role: profile.role
  }));
  
  return users;
};

// Update user department
export const updateUserDepartment = async (userId: string, department: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ department })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

// Assign an approver to a user
export const assignApprover = async (userId: string, approverId: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ approver_id: approverId })
    .eq('id', userId);
    
  if (error) {
    console.error('Error assigning approver:', error);
    throw error;
  }
};

// Get possible approvers (all users except the current one)
export const getPossibleApprovers = async (currentUserId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, department')
    .neq('id', currentUserId);
    
  if (error) {
    console.error('Error getting approvers:', error);
    throw error;
  }
  
  return data as User[];
};

// Create a new user in the system
export const createUser = async (
  email: string, 
  password: string, 
  name: string, 
  department?: string,
  role?: string
): Promise<string> => {
  // First create the user in auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, department }
  });
  
  if (authError) {
    console.error('Error creating user in auth:', authError);
    throw authError;
  }
  
  // If a role is specified, assign it
  if (role && authData.user) {
    try {
      await setUserRole(authData.user.id, role);
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  }
  
  return authData.user?.id || '';
};

// Update user password
export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.admin.updateUserById(
    userId,
    { password: newPassword }
  );
  
  if (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
