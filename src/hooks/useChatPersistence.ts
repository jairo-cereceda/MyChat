import { useState, useEffect } from 'react';
import { migrateStorage } from '../utils/migration';
import type { ChatData } from '../types';

export function useChatPersistence() {
  const [chats, setChats] = useState<ChatData[]>(() => {
    try {
      const v1Data = localStorage.getItem('messages');
      if (v1Data) {
        const parsed = JSON.parse(v1Data);
        return migrateStorage(parsed);
      }

      const v2Data = localStorage.getItem('chats');
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        return migrateStorage(parsed);
      }

      return [];
    } catch (err) {
      console.error('Failed loading localStorage', err);
      return [];
    }
  });

  useEffect(() => {
    const dataToSave = {
      version: 2,
      chats: chats,
    };
    localStorage.setItem('chats', JSON.stringify(dataToSave));
  }, [chats]);

  return [chats, setChats] as const;
}
