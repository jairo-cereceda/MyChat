import { useContext } from 'react';
import { ChatContext } from './chatContextProvider';

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
};
