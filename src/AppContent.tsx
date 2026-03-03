import { useState, useMemo, useRef } from 'react';
import Prompt from './components/molecules/prompt';
import Header from './components/organisms/header/header';
import MessagesContainer from './components/organisms/messages-container';
import Alert from './components/atoms/alert';
import { useAutoFocus } from './hooks/useAutoFocus';
import { useChat } from './context/useChat';

function App() {
  const {
    chats,
    activeChat,
    addNewChat,
    setActiveChatId,
    addNewMessage,
    updateMessage,
    deleteMessage,
    deleteChat,
    messageToEdit,
    setMessageToEdit,
    openMenuId,
    setOpenMenuId,
  } = useChat();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idChatToDelete, setIdChatToDelete] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoFocus(inputRef, messageToEdit !== null);

  const selectedMessage = useMemo(
    () => activeChat?.messages.find((msg) => msg.id === openMenuId),
    [activeChat, openMenuId]
  );

  const handleOpenDeleteChatModal = (id: string) => {
    setIdChatToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIdChatToDelete(null);
  };

  const handleConfirmDeleteChat = () => {
    if (idChatToDelete) {
      deleteChat(idChatToDelete);
    }

    closeModal();
  };

  return (
    <div className="h-dvh bg-secondary flex flex-col">
      {isDeleteModalOpen && (
        <Alert
          text="¿Deseas Eliminar este chat?"
          onConfirm={handleConfirmDeleteChat}
          onCancel={closeModal}
        />
      )}
      <Header
        onCreateChat={addNewChat}
        onSelectChat={setActiveChatId}
        onDeleteMessage={deleteMessage}
        onEdit={setMessageToEdit}
        onDeleteChat={handleOpenDeleteChatModal}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        chats={chats}
        mode={openMenuId !== '' ? 'editing' : ''}
        selectedMessage={selectedMessage}
      />
      <MessagesContainer
        messages={activeChat?.messages || []}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
      />
      <Prompt
        onSendMessage={addNewMessage}
        editingMessage={messageToEdit}
        onUpdateMessage={updateMessage}
        inputRef={inputRef}
      />
    </div>
  );
}

export default App;
