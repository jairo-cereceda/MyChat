// src/components/SyncSettings.tsx
import React from 'react';
import { useDrive } from '../../../context/DriveContext';
import { FaCloud } from 'react-icons/fa';
import { CiCloud } from 'react-icons/ci';

export const SyncSettings: React.FC = () => {
  const { token, login } = useDrive();

  return (
    <div className="sync-container text-text-color">
      {!token ? (
        <button
          onClick={login}
          className="p-3 rounded-xl font-semibold cursor-pointer flex gap-2 items-center"
        >
          <CiCloud /> Vincular con Google Drive
        </button>
      ) : (
        <div className="p-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2">
          <FaCloud /> <span title="Sincronización activa">En la nube</span>
        </div>
      )}
    </div>
  );
};
