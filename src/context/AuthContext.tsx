
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  name?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, department: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay una sesión existente al cargar la aplicación
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      if (authStatus === "true") {
        const email = localStorage.getItem("userEmail") || "";
        const name = localStorage.getItem("userName") || undefined;
        const department = localStorage.getItem("userDepartment") || undefined;
        
        setUser({ email, name, department });
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // En una implementación real, esto verificaría credenciales con un backend
    // Para este ejemplo, solo simulamos el proceso
    
    // Simular un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En producción, verificaríamos las credenciales con un servidor
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      
      setUser({ email });
      setIsAuthenticated(true);
    } else {
      throw new Error("Credenciales inválidas");
    }
  };

  const register = async (name: string, email: string, department: string, password: string) => {
    // En una implementación real, esto registraría al usuario en un backend
    // Para este ejemplo, solo simulamos el proceso
    
    // Simular un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En producción, registraríamos al usuario en un servidor
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    localStorage.setItem("userDepartment", department);
    
    setUser({ email, name, department });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userDepartment");
    
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
