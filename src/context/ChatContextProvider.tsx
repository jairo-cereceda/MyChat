import {
  createContext,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';

import { type MessageData, type ChatData } from '../types';
import { getLocalTimestamp } from '../utils/timestamp';
import { useChatPersistence } from '../hooks/useChatPersistence';

interface ChatContextType {
  chats: ChatData[];
  activeChatId: string | null;
  activeChat?: ChatData;
  starredMessages?: ChatData | undefined;

  isStarredMessagesOpen: boolean;
  setIsStarredMessagesOpen: (state: boolean) => void;

  status:
    | 'editing'
    | 'edited'
    | 'deleted'
    | 'starred'
    | 'unstarred'
    | 'cannotShowStarred'
    | null;
  setStatus: (
    status:
      | 'editing'
      | 'edited'
      | 'deleted'
      | 'starred'
      | 'unstarred'
      | 'cannotShowStarred'
      | null
  ) => void;

  setActiveChatId: (id: string | null) => void;

  addNewChat: (messages?: MessageData[] | null) => void;
  deleteChat: (chatId: string) => void;

  addNewMessage: (text: string) => void;
  updateMessage: (text: string, message: MessageData) => void;
  starMessage: (message: MessageData) => void;
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
  const [status, setStatus] = useState<
    | 'editing'
    | 'edited'
    | 'deleted'
    | 'starred'
    | 'unstarred'
    | 'cannotShowStarred'
    | null
  >(null);

  const [isStarredMessagesOpen, setIsStarredMessagesOpen] = useState(false);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId]
  );

  const starredMessages = useMemo(() => {
    const chat = chats.find((c) => c.id === activeChatId);

    if (!chat) return undefined;

    const starred = chat.messages.filter((m) => m.isStarred);

    if (starred.length === 0) return undefined;

    return {
      ...chat,
      messages: starred,
    };
  }, [chats, activeChatId]);

  const changeActiveChat = useCallback((id: string | null) => {
    setMessageToEdit(null);
    setStatus(null);
    setIsStarredMessagesOpen(false);
    setOpenMenuId('');

    setActiveChatId(id);
  }, []);

  useEffect(() => {
    if (!status) return;

    const timer = setTimeout(() => {
      setStatus(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, setStatus]);

  const generateId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 10);

  /**
   * Create Chat
   */
  const addNewChat = useCallback(
    (messages: MessageData[] | null = null) => {
      const newChat: ChatData = {
        id: generateId(),
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
      setActiveChatId(null);
    },
    [setChats]
  );

  /**
   * Crete Message
   */
  const addNewMessage = useCallback(
    (text: string) => {
      const newMessage: MessageData = {
        id: generateId(),
        text,
        isStarred: false,
        timestamp: getLocalTimestamp(),
      };

      if (!activeChatId) {
        const newChatId = generateId();

        const newChat: ChatData = {
          id: newChatId,
          name: 'Nuevo Chat',
          messages: [newMessage],
          timestamp: getLocalTimestamp(),
        };

        setChats((prev) => [...prev, newChat]);
        setActiveChatId(newChatId);

        return;
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
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
      setStatus('edited');
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

      setStatus('deleted');
    },
    [activeChatId, setChats]
  );

  /**
   * Star message
   */

  const starMessage = useCallback(
    (message: MessageData) => {
      if (!activeChatId) return;

      const newIsStarred = !message.isStarred;

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === message.id ? { ...m, isStarred: newIsStarred } : m
                ),
              }
            : chat
        )
      );

      setStatus(newIsStarred ? 'starred' : 'unstarred');
    },
    [activeChatId, setChats]
  );

  const contextValue = useMemo(
    () => ({
      chats,
      activeChatId,
      activeChat,
      setActiveChatId: changeActiveChat,
      addNewChat,
      deleteChat,
      addNewMessage,
      updateMessage,
      deleteMessage,
      messageToEdit,
      setMessageToEdit,
      starMessage,
      starredMessages,
      setIsStarredMessagesOpen,
      isStarredMessagesOpen,
      status,
      setStatus,
      openMenuId,
      setOpenMenuId,
    }),
    [
      chats,
      activeChatId,
      changeActiveChat,
      activeChat,
      addNewChat,
      deleteChat,
      addNewMessage,
      updateMessage,
      deleteMessage,
      starMessage,
      starredMessages,
      setIsStarredMessagesOpen,
      isStarredMessagesOpen,
      messageToEdit,
      status,
      setStatus,
      openMenuId,
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
export { ChatContext };
