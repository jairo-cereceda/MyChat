import { useState, useEffect, useCallback } from 'react';
import { migrateStorage } from '../storage/migration';
import type { ChatData } from '../types';
import { useDrive } from '../context/DriveContext';

const STORAGE_KEYS = {
  CHATS: 'chats',
  LEGACY_MESSAGES: 'messages',
};

const loadChatsFromLocalStorage = () => {
  try {
    const v1Data = localStorage.getItem(STORAGE_KEYS.LEGACY_MESSAGES);
    if (v1Data) {
      const parsed = JSON.parse(v1Data);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_MESSAGES);
      return migrateStorage(parsed);
    }

    const v2Data = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (v2Data) {
      const parsed = JSON.parse(v2Data);
      return migrateStorage(parsed);
    }

    return [];
  } catch (err) {
    console.error('Failed loading localStorage', err);
    return [];
  }
};

export function useChatPersistence() {
  const [chats, setChats] = useState<ChatData[]>(() =>
    loadChatsFromLocalStorage()
  );

  const { token, syncData } = useDrive();

  const refreshChats = useCallback(() => {
    setChats(loadChatsFromLocalStorage());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));

    if (token) {
      const timeoutId = setTimeout(() => {
        console.log('Iniciando backup automático...');
        syncData(chats);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [chats, token, syncData]);

  return [chats, setChats, refreshChats] as const;
}
