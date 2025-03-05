
import { supabase } from "@/integrations/supabase/client";

// Tipos de datos
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
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
}

// Obtener el perfil del usuario actual
export const getCurrentUserProfile = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error al obtener perfil de usuario:', error);
    return null;
  }
  
  return data as User;
};

// Obtener el balance de días del usuario actual
export const getCurrentUserBalance = async (): Promise<LeaveBalance | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('leave_balances')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (error) {
    console.error('Error al obtener balance de días:', error);
    return null;
  }
  
  return data as LeaveBalance;
};

// Obtener las solicitudes de permiso del usuario actual
export const getUserLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('requested_on', { ascending: false });
    
  if (error) {
    console.error('Error al obtener solicitudes:', error);
    return [];
  }
  
  return (data || []) as LeaveRequest[];
};

// Obtener una solicitud de permiso específica
export const getLeaveRequestById = async (id: string): Promise<LeaveRequest | null> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error al obtener detalles de solicitud:', error);
    return null;
  }
  
  return data as LeaveRequest;
};

// Crear una nueva solicitud de permiso
export const createLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'user_id' | 'requested_on' | 'status'>): Promise<LeaveRequest | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('leave_requests')
    .insert([{
      user_id: user.id,
      ...request,
      status: 'pending',
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error al crear solicitud:', error);
    return null;
  }
  
  return data as LeaveRequest;
};

// Actualizar el estado de una solicitud
export const updateLeaveRequestStatus = async (id: string, status: 'approved' | 'rejected', comments?: string): Promise<LeaveRequest | null> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .update({ 
      status,
      comments,
      approved_by: 'Supervisor' // En un sistema real, esto sería el nombre del aprobador
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error al actualizar solicitud:', error);
    return null;
  }
  
  return data as LeaveRequest;
};

// Autenticación
export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

export const registerWithEmail = async (email: string, password: string, userData: { name: string, department: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData.name,
      }
    }
  });
  
  if (error) throw error;
  
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Escuchar cambios en la sesión de autenticación
export const onAuthStateChange = (callback: (session: any) => void) => {
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session);
  });
};
