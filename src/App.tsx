import Prompt from './components/molecules/prompt';
import Header from './components/organisms/header/header';
import MessagesContainer from './components/organisms/messages-container';
import { useState, useEffect, useMemo, useRef } from 'react';
import Alert from './components/atoms/alert';

export interface MessageData {
  id: string;
  text: string;
  timestamp: string;
}

export interface ChatData {
  id: string;
  name: string;
  messages: MessageData[];
  timestamp: string;
}

//Migration
const migrateStorage = (data: unknown): ChatData[] => {
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

const getLocalTimestamp = () => {
  const now = new Date();

  const offset = now.getTimezoneOffset() * 60000;
  const localIsoTime = new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, -1);
  return localIsoTime;
};

function App() {
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
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return chats.length > 0 ? chats[0].id : null;
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idChatToDelete, setIdChatToDelete] = useState<string | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<MessageData | null>(null);
  const [openMenuId, setOpenMenuId] = useState('');

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId]
  );

  const selectedMessage = useMemo(
    () => activeChat?.messages.find((msg) => msg.id === openMenuId),
    [activeChat, openMenuId]
  );

  useEffect(() => {
    const dataToSave = {
      version: 2,
      chats: chats,
    };
    localStorage.setItem('chats', JSON.stringify(dataToSave));
  }, [chats]);

  useEffect(() => {
    if (messageToEdit) {
      setTimeout(() => {
        const el = inputRef.current;

        if (el) {
          el.focus();

          const length = el.value.length;

          el.setSelectionRange(length, length);
        }
      }, 50);
    }
  }, [messageToEdit]);

  const addNewChat = (messages: MessageData[] | null = null) => {
    const newChat: ChatData = {
      id: crypto.randomUUID(),
      name: 'prueba',
      messages: messages || [],
      timestamp: getLocalTimestamp(),
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  const addNewMessage = (text: string) => {
    const newMessage: MessageData = {
      id: crypto.randomUUID(),
      text,
      timestamp: getLocalTimestamp(),
    };

    if (!activeChatId) {
      const newChat: ChatData = {
        id: crypto.randomUUID(),
        messages: [newMessage],
        name: 'prueba',
        timestamp: getLocalTimestamp(),
      };

      setChats((prev) => [...prev, newChat]);
      setActiveChatId(newChat.id);
    } else {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
    }
  };

  const updateMessage = (text: string) => {
    if (!messageToEdit || !activeChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.map((m) =>
                m.id === messageToEdit.id ? { ...m, text } : m
              ),
            }
          : chat
      )
    );
    setMessageToEdit(null);
  };

  const onDeleteMessage = (id: string) => {
    if (!activeChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.filter((m) => m.id !== id),
            }
          : chat
      )
    );
  };

  const onDeleteChat = (id: string) => {
    setIdChatToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIdChatToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (idChatToDelete) {
      setChats((prevChats) =>
        prevChats.filter((chat) => chat.id !== idChatToDelete)
      );

      if (activeChatId === idChatToDelete) {
        setActiveChatId(null);
      }
    }

    closeModal();
  };

  return (
    <div className="h-dvh bg-secondary flex flex-col">
      {isDeleteModalOpen && (
        <Alert
          text="¿Deseas Eliminar este chat?"
          onConfirm={handleConfirmDelete}
          onCancel={closeModal}
        />
      )}
      <Header
        onCreateChat={addNewChat}
        onSelectChat={setActiveChatId}
        onDeleteMessage={onDeleteMessage}
        onEdit={setMessageToEdit}
        onDeleteChat={onDeleteChat}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        chats={chats}
        mode={openMenuId !== '' ? 'editing' : ''}
        selectedMessage={selectedMessage}
      />
      <MessagesContainer
        messages={activeChat?.messages || []}
        OpenMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
      />
      <Prompt
        key={messageToEdit?.id || 'new'}
        onSendMessage={addNewMessage}
        editingMessage={messageToEdit}
        onUpdateMessage={updateMessage}
        inputRef={inputRef}
      />
    </div>
  );
}

export default App;
