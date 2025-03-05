import { supabase } from "@/integrations/supabase/client";

// Tipos de datos
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  approver_id?: string;
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

// Obtener todas las solicitudes de permiso del equipo (para el calendario compartido)
export const getAllTeamRequests = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      profiles:user_id (name, department)
    `)
    .order('start_date', { ascending: true });
    
  if (error) {
    console.error('Error al obtener solicitudes del equipo:', error);
    return [];
  }
  
  // Formatear los datos para que sean más fáciles de usar
  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    username: item.profiles?.name || 'Usuario desconocido',
    department: item.profiles?.department || null,
    type: item.type,
    start_date: item.start_date,
    end_date: item.end_date,
    days: item.days,
    status: item.status,
    requested_on: item.requested_on,
    approved_by: item.approved_by,
    comments: item.comments,
    approver_id: item.approver_id
  }));
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
export const createLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'user_id' | 'requested_on' | 'status'> & { approver_id?: string }): Promise<LeaveRequest | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Use the provided approver_id if available, otherwise get the default one from the profile
  let approver_id = request.approver_id;
  
  if (!approver_id) {
    // Obtener el ID del aprobador asignado al usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('approver_id')
      .eq('id', user.id)
      .single();
    
    approver_id = profile?.approver_id || null;
  }
  
  const { data, error } = await supabase
    .from('leave_requests')
    .insert([{
      user_id: user.id,
      ...request,
      status: 'pending',
      approver_id: approver_id
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error al crear solicitud:', error);
    return null;
  }
  
  return data as LeaveRequest;
};

// Obtener solicitudes pendientes para un aprobador
export const getPendingRequestsForApprover = async (): Promise<any[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      profiles:user_id (name, email, department)
    `)
    .eq('approver_id', user.id)
    .eq('status', 'pending')
    .order('requested_on', { ascending: false });
    
  if (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
    return [];
  }
  
  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    userName: item.profiles?.name || 'Usuario desconocido',
    userEmail: item.profiles?.email || '',
    department: item.profiles?.department || '',
    type: item.type,
    start_date: item.start_date,
    end_date: item.end_date,
    days: item.days,
    status: item.status,
    requested_on: item.requested_on,
    comments: item.comments,
    approver_id: item.approver_id
  }));
};

// Actualizar el estado de una solicitud
export const updateLeaveRequestStatus = async (id: string, status: 'approved' | 'rejected', comments?: string): Promise<LeaveRequest | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single();
  
  const { data, error } = await supabase
    .from('leave_requests')
    .update({ 
      status,
      comments,
      approved_by: profile?.name || 'Supervisor' // En un sistema real, esto sería el nombre del aprobador
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
