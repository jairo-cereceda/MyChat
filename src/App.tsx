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

  if (typeof data === 'object' && !Array.isArray(data)) {
    const potentialV2 = data as Record<string, unknown>;
    if (potentialV2.version === 2 && Array.isArray(potentialV2.chats)) {
      return potentialV2.chats as ChatData[];
    }
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return [];

    const firstItem = data[0] as Record<string, unknown>;

    const isOldMessage = 'text' in firstItem && !('messages' in firstItem);

    if (isOldMessage) {
      return [
        {
          id: crypto.randomUUID(),
          name: 'Mensajes Recuperados',
          messages: data as MessageData[],
          timestamp: new Date().toISOString(),
        },
      ];
    }

    const isIntermediateChat =
      'messages' in firstItem && Array.isArray(firstItem.messages);
    if (isIntermediateChat) {
      return data as ChatData[];
    }
  }

  return [];
};

function App() {
  const [chats, setChats] = useState<ChatData[]>(() => {
    try {
      let savedData = localStorage.getItem('chats');
      if (!savedData) {
        savedData = localStorage.getItem('messages');
      }

      if (!savedData) return [];

      const parsedData: unknown = JSON.parse(savedData);
      const migrated = migrateStorage(parsedData);

      return migrated;
    } catch (err) {
      console.error('Error cargando localStorage', err);
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
