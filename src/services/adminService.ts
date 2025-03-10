import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  leave_balance?: LeaveBalance;
  approver?: string;
  approver_id?: string;
  role?: string; // Propiedad para el rol del usuario
}

export interface LeaveBalance {
  id: string;
  user_id: string;
  vacation_days: number;
  sick_days: number;
  personal_days: number;
}

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

// Verificar si el usuario es super administrador
export const isSuperAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !data) {
    console.error('Error al verificar rol:', error);
    return false;
  }
  
  return data.role === 'super_admin';
};

// Establecer el rol de un usuario
export const setUserRole = async (userId: string, role: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
    
  if (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
};

// Obtener todos los usuarios con sus balances
export const getAllUsers = async (): Promise<User[]> => {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');
    
  if (profilesError) {
    console.error('Error al obtener perfiles:', profilesError);
    throw profilesError;
  }
  
  // Obtener balances de días para cada usuario
  const { data: balances, error: balancesError } = await supabase
    .from('leave_balances')
    .select('*');
    
  if (balancesError) {
    console.error('Error al obtener balances:', balancesError);
    throw balancesError;
  }
  
  // Crear un mapa de balances por id de usuario
  const balanceMap: Record<string, LeaveBalance> = {};
  balances.forEach(balance => {
    balanceMap[balance.user_id] = balance;
  });
  
  // Crear un mapa de nombres de usuarios para los aprobadores
  const userNameMap: Record<string, string> = {};
  profiles.forEach(profile => {
    userNameMap[profile.id] = profile.name;
  });
  
  // Combinar perfiles con sus balances y nombres de aprobadores
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

// Actualizar el departamento de un usuario
export const updateUserDepartment = async (userId: string, department: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ department })
    .eq('id', userId);
    
  if (error) {
    console.error('Error al actualizar departamento:', error);
    throw error;
  }
};

// Actualizar el balance de días de un usuario
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
    console.error('Error al actualizar balance:', error);
    throw error;
  }
};

// Asignar un aprobador a un usuario
export const assignApprover = async (userId: string, approverId: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ approver_id: approverId })
    .eq('id', userId);
    
  if (error) {
    console.error('Error al asignar aprobador:', error);
    throw error;
  }
};

// Obtener todas las solicitudes de permiso
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .order('requested_on', { ascending: false });
    
  if (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }
  
  return data as LeaveRequest[];
};

// Actualizar el estado de una solicitud
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
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }
};

// Obtener posibles aprobadores (todos los usuarios excepto el actual)
export const getPossibleApprovers = async (currentUserId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, department')
    .neq('id', currentUserId);
    
  if (error) {
    console.error('Error al obtener aprobadores:', error);
    throw error;
  }
  
  return data as User[];
};
