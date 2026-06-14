// src/context/DriveContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { initTokenClient, uploadToDrive } from '../services/googleDriveService';

interface DriveContextType {
  token: string | null;
  login: () => void;
  syncData: (data: unknown) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

interface DriveProviderProps {
  children: ReactNode;
}

export const DriveProvider: React.FC<DriveProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [client, setClient] =
    useState<google.accounts.oauth2.TokenClient | null>(null);

  useEffect(() => {
    const checkGoogleLib = setInterval(() => {
      if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
        const tokenClient = initTokenClient((t: string) => setToken(t));
        setClient(tokenClient);
        clearInterval(checkGoogleLib);
      }
    }, 500);
    return () => clearInterval(checkGoogleLib);
  }, []);

  const login = () => {
    if (client) {
      client.requestAccessToken();
    } else {
      console.error('Google Client no inicializado');
    }
  };

  const syncData = async (data: unknown) => {
    if (!token) return;
    try {
      const response = await uploadToDrive(token, data);
      if (!response.ok) throw new Error('Error en la subida');
    } catch (error) {
      console.error('Sync Error:', error);
    }
  };

  return (
    <DriveContext.Provider value={{ token, login, syncData }}>
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = (): DriveContextType => {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error('useDrive debe usarse dentro de un DriveProvider');
  }
  return context;
};
