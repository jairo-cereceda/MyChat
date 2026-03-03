import {
  createContext,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from 'react';

import { type MessageData, type ChatData } from '../types';
import { getLocalTimestamp } from '../utils/timestamp';
import { useChatPersistence } from '../hooks/useChatPersistence';

interface ChatContextType {
  chats: ChatData[];
  activeChatId: string | null;
  activeChat?: ChatData;

  setActiveChatId: (id: string | null) => void;

  addNewChat: (messages?: MessageData[] | null) => void;
  deleteChat: (chatId: string) => void;

  addNewMessage: (text: string) => void;
  updateMessage: (text: string, message: MessageData) => void;
  deleteMessage: (messageId: string) => void;

  messageToEdit: MessageData | null;
  setMessageToEdit: (message: MessageData | null) => void;

  openMenuId: string;
  setOpenMenuId: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [chats, setChats] = useChatPersistence();

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return chats.length > 0 ? chats[0].id : null;
  });

  const [messageToEdit, setMessageToEdit] = useState<MessageData | null>(null);

  const [openMenuId, setOpenMenuId] = useState('');

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId]
  );

  /**
   * Create Chat
   */
  const addNewChat = useCallback(
    (messages: MessageData[] | null = null) => {
      const newChat: ChatData = {
        id: crypto.randomUUID(),
        name: 'Nuevo Chat',
        messages: messages ?? [],
        timestamp: getLocalTimestamp(),
      };

      setChats((prev) => [...prev, newChat]);
      setActiveChatId(newChat.id);
    },
    [setChats]
  );

  /**
   * Delete Chat
   */
  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    },
    [setChats]
  );

  /**
   * Crete Message
   */
  const addNewMessage = useCallback(
    (text: string) => {
      const newMessage: MessageData = {
        id: crypto.randomUUID(),
        text,
        timestamp: getLocalTimestamp(),
      };

      setChats((prevChats) => {
        if (!activeChatId) {
          const newChat: ChatData = {
            id: crypto.randomUUID(),
            name: 'Nuevo Chat',
            messages: [newMessage],
            timestamp: getLocalTimestamp(),
          };

          setActiveChatId(newChat.id);
          return [...prevChats, newChat];
        }

        return prevChats.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        );
      });
    },
    [activeChatId, setChats]
  );

  /**
   * Update Message
   */
  const updateMessage = useCallback(
    (text: string, message: MessageData) => {
      if (!activeChatId) return;

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === message.id ? { ...m, text } : m
                ),
              }
            : chat
        )
      );

      setMessageToEdit(null);
    },
    [activeChatId, setChats]
  );

  /**
   * Delete Message
   */
  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!activeChatId) return;

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: chat.messages.filter((m) => m.id !== messageId),
              }
            : chat
        )
      );
    },
    [activeChatId, setChats]
  );

  const contextValue = useMemo(
    () => ({
      chats,
      activeChatId,
      activeChat,
      setActiveChatId,
      addNewChat,
      deleteChat,
      addNewMessage,
      updateMessage,
      deleteMessage,
      messageToEdit,
      setMessageToEdit,
      openMenuId,
      setOpenMenuId,
    }),
    [
      chats,
      activeChatId,
      activeChat,
      addNewChat,
      deleteChat,
      addNewMessage,
      updateMessage,
      deleteMessage,
      messageToEdit,
      openMenuId,
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
export { ChatContext };
