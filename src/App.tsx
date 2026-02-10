import Prompt from './components/molecules/prompt';
import Header from './components/organisms/header/header';
import MessagesContainer from './components/atoms/messages-container';
import { useState, useEffect, useMemo } from 'react';
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
      return [
        {
          id: crypto.randomUUID(),
          name: 'Chat Recuperado',
          messages: data as MessageData[],
          timestamp: new Date().toISOString(),
        },
      ];
    }

    if ('messages' in firstItem) {
      return data as ChatData[];
    }
  }

  return [];
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

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId]
  );

  useEffect(() => {
    const dataToSave = {
      version: 2,
      chats: chats,
    };
    localStorage.setItem('chats', JSON.stringify(dataToSave));
  }, [chats]);

  const addNewChat = (messages: MessageData[] | null = null) => {
    const newChat: ChatData = {
      id: crypto.randomUUID(),
      name: 'prueba',
      messages: messages || [],
      timestamp: new Date().toISOString(),
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  const addNewMessage = (text: string) => {
    const newMessage: MessageData = {
      id: crypto.randomUUID(),
      text,
      timestamp: new Date().toISOString(),
    };

    if (!activeChatId) {
      const newChat: ChatData = {
        id: crypto.randomUUID(),
        messages: [newMessage],
        name: 'prueba',
        timestamp: new Date().toISOString(),
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
    <div className="h-dvh bg-secondary flex flex-col gap-3">
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
        onDeleteChat={onDeleteChat}
        chats={chats}
      />
      <MessagesContainer
        messages={activeChat?.messages || []}
        onDeleteMessage={onDeleteMessage}
        onEditClick={setMessageToEdit}
      />
      <Prompt
        key={messageToEdit?.id || 'new'}
        onSendMessage={addNewMessage}
        editingMessage={messageToEdit}
        onUpdateMessage={updateMessage}
      />
    </div>
  );
}

export default App;
