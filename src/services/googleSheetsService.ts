
// Este es un servicio simple para simular la interacción con Google Sheets
// En un entorno de producción, esto se conectaría con Google Sheets API

// URL del documento de Google Sheets
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PTpL4VOi_j1yyrh1x0bs_XmcEuauKyrP6c3cJuVCGfc/edit";

// Estructura de un usuario
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  vacationDays: number;
  sickDays: number;
  personalDays: number;
}

// Estructura de una solicitud de permiso
export interface LeaveRequest {
  id: string;
  userId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedOn: Date;
  approvedBy?: string;
  comments?: string;
}

// Simular la obtención de usuarios desde Google Sheets
export const getUsers = async (): Promise<User[]> => {
  // En una implementación real, esto haría una llamada a Google Sheets API
  console.log("Simulando obtención de usuarios desde:", GOOGLE_SHEET_URL);
  
  // Datos simulados de usuarios
  return [
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@educo.org",
      department: "Recursos Humanos",
      vacationDays: 20,
      sickDays: 10,
      personalDays: 5,
    },
    {
      id: "2",
      name: "María Rodríguez",
      email: "maria.rodriguez@educo.org",
      department: "Finanzas",
      vacationDays: 18,
      sickDays: 10,
      personalDays: 5,
    },
    {
      id: "3",
      name: "Carlos González",
      email: "carlos.gonzalez@educo.org",
      department: "Tecnología",
      vacationDays: 15,
      sickDays: 8,
      personalDays: 3,
    },
  ];
};

// Simular la obtención de solicitudes de permisos desde Google Sheets
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  // En una implementación real, esto haría una llamada a Google Sheets API
  console.log("Simulando obtención de solicitudes desde:", GOOGLE_SHEET_URL);
  
  // Datos simulados de solicitudes
  return [
    {
      id: "1",
      userId: "1",
      type: "Vacaciones",
      startDate: new Date("2023-12-10"),
      endDate: new Date("2023-12-15"),
      days: 5,
      status: "approved",
      requestedOn: new Date("2023-11-20"),
      approvedBy: "Supervisor",
      comments: "Disfruta tus vacaciones",
    },
    {
      id: "2",
      userId: "1",
      type: "Permiso por Enfermedad",
      startDate: new Date("2024-01-05"),
      endDate: new Date("2024-01-06"),
      days: 2,
      status: "approved",
      requestedOn: new Date("2024-01-04"),
      approvedBy: "Supervisor",
      comments: "Recuperate pronto",
    },
    {
      id: "3",
      userId: "2",
      type: "Permiso Personal",
      startDate: new Date("2024-05-20"),
      endDate: new Date("2024-05-20"),
      days: 1,
      status: "pending",
      requestedOn: new Date("2024-05-14"),
    },
    {
      id: "4",
      userId: "3",
      type: "Permiso por Duelo",
      startDate: new Date("2024-03-10"),
      endDate: new Date("2024-03-13"),
      days: 4,
      status: "rejected",
      requestedOn: new Date("2024-03-08"),
      approvedBy: "Supervisor",
      comments: "Necesitamos documentación adicional",
    },
  ];
};

// Simular el registro de un nuevo usuario
export const registerUser = async (user: Omit<User, 'id'>): Promise<User> => {
  // En una implementación real, esto enviaría datos a Google Sheets
  console.log("Registrando nuevo usuario en:", GOOGLE_SHEET_URL, user);
  
  // Simular un ID generado
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    vacationDays: 20,
    sickDays: 10,
    personalDays: 5,
  };
  
  return newUser;
};

// Simular la creación de una solicitud de permiso
export const createLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'requestedOn' | 'status'>): Promise<LeaveRequest> => {
  // En una implementación real, esto enviaría datos a Google Sheets
  console.log("Registrando nueva solicitud en:", GOOGLE_SHEET_URL, request);
  
  // Simular una solicitud creada
  const newRequest: LeaveRequest = {
    ...request,
    id: Date.now().toString(),
    requestedOn: new Date(),
    status: 'pending',
  };
  
  return newRequest;
};

// Simular la actualización del estado de una solicitud
export const updateLeaveRequestStatus = async (id: string, status: 'approved' | 'rejected', approverNotes?: string): Promise<LeaveRequest> => {
  // En una implementación real, esto actualizaría datos en Google Sheets
  console.log(`Actualizando solicitud ${id} a estado ${status} en:`, GOOGLE_SHEET_URL);
  
  // Simular una respuesta exitosa
  return {
    id,
    userId: "1",
    type: "Vacaciones",
    startDate: new Date(),
    endDate: new Date(),
    days: 1,
    status,
    requestedOn: new Date(),
    approvedBy: "Supervisor",
    comments: approverNotes,
  };
};
