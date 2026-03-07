import { useState, useEffect, useCallback } from 'react';
import { migrateStorage } from '../storage/migration';
import type { ChatData } from '../types';

const loadChatsFromLocalStorage = () => {
  try {
    const v1Data = localStorage.getItem('messages');
    if (v1Data) {
      const parsed = JSON.parse(v1Data);
      localStorage.removeItem('messages');
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
};

export function useChatPersistence() {
  const [chats, setChats] = useState<ChatData[]>(() =>
    loadChatsFromLocalStorage()
  );

  const refreshChats = useCallback(() => {
    setChats(loadChatsFromLocalStorage());
  }, []);

  useEffect(() => {
    localStorage.setItem('chat', JSON.stringify(chats));
  }, [chats]);

  return [chats, setChats, refreshChats] as const;
}
