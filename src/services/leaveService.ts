
import { supabase } from "@/integrations/supabase/client";
import { LeaveBalance } from "./userService";

export interface LeaveRequest {
  id: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  requested_on: string;
  approved_by?: string;
  comments?: string;
  approver_id?: string;
}

// Update user leave balance
export const updateUserLeaveBalance = async (
  userId: string, 
  balance: { 
    vacation_days: number; 
    sick_days: number; 
    personal_days: number; 
  }
): Promise<void> => {
  const { error } = await supabase
    .from('leave_balances')
    .update(balance)
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error updating balance:', error);
    throw error;
  }
};

// Get all leave requests
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .order('requested_on', { ascending: false });
    
  if (error) {
    console.error('Error getting leave requests:', error);
    throw error;
  }
  
  return data as LeaveRequest[];
};

// Update leave request status
export const updateLeaveRequestStatus = async (
  id: string, 
  status: 'approved' | 'rejected', 
  comments?: string,
  approvedBy?: string
): Promise<void> => {
  const { error } = await supabase
    .from('leave_requests')
    .update({ 
      status, 
      comments,
      approved_by: approvedBy
    })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating leave request:', error);
    throw error;
  }
};
