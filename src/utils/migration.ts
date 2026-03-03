import { type ChatData, type MessageData } from '../types';
import { getLocalTimestamp } from './timestamp';

export const migrateStorage = (data: unknown): ChatData[] => {
  if (!data) return [];

  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    const obj = data as Record<string, unknown>;
    if (obj.version === 2 && Array.isArray(obj.chats)) {
      return obj.chats as ChatData[];
    }
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return [];

    const firstItem = data[0] as Record<string, unknown>;

    if ('text' in firstItem && !('messages' in firstItem)) {
      localStorage.removeItem('messages');
      return [
        {
          id: crypto.randomUUID(),
          name: 'Chat Recuperado',
          messages: data as MessageData[],
          timestamp: getLocalTimestamp(),
        },
      ];
    }

    if ('messages' in firstItem) {
      return data as ChatData[];
    }
  }

  return [];
};
