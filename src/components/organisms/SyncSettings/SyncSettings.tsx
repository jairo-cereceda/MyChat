// src/components/SyncSettings.tsx
import React from 'react';
import { useDrive } from '../../../context/DriveContext';

export const SyncSettings: React.FC = () => {
  const { token, login } = useDrive();

  return (
    <div className="sync-container absolute mt-2 w-full flex justify-center">
      {!token ? (
        <button
          onClick={login}
          className="px-4 py-2 bg-primary text-white rounded-xl font-semibold cursor-pointer"
        >
          Vincular con Google Drive
        </button>
      ) : (
        <div className="px-4 py-2 bg-primary text-white rounded-xl font-semibold cursor-pointer flex items-center gap-2">
          <span title="Sincronización activa">☁️ En la nube</span>
        </div>
      )}
    </div>
  );
};
