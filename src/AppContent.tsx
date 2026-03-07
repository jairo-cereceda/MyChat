import { useState, useMemo, useRef, useLayoutEffect } from 'react';
import Prompt from './components/molecules/prompt';
import Header from './components/organisms/header/header';
import MessagesContainer from './components/organisms/messages-container';
import Modal from './components/atoms/modal';
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
    starMessage,
    starredMessages,
    setIsStarredMessagesOpen,
    isStarredMessagesOpen,
    messageToEdit,
    setMessageToEdit,
    openMenuId,
    status,
    setStatus,
    setOpenMenuId,
  } = useChat();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idChatToDelete, setIdChatToDelete] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [promptHeight, setPromptHeight] = useState(0);

  useLayoutEffect(() => {
    if (!inputRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setPromptHeight(entry.contentRect.height);
    });

    observer.observe(inputRef.current);

    return () => observer.disconnect();
  }, []);

  useAutoFocus(inputRef, messageToEdit !== null);

  const selectedMessage = useMemo(
    () => activeChat?.messages.find((msg) => msg.id === openMenuId),
    [activeChat, openMenuId]
  );

  const handleOpenStarredMessages = () => {
    if (starredMessages) {
      setIsStarredMessagesOpen(!isStarredMessagesOpen);
    } else {
      setStatus('cannotShowStarred');
    }
  };

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

  const cancelEditing = () => {
    setMessageToEdit(null);
  };

  return (
    <div className="h-dvh bg-secondary flex flex-col">
      {isDeleteModalOpen && (
        <Modal
          text="¿Deseas Eliminar este chat?"
          buttons={[
            { text: 'Cancelar', onClick: closeModal, variant: 'primary' },
            {
              text: 'Aceptar',
              onClick: handleConfirmDeleteChat,
              variant: 'primary',
            },
          ]}
        />
      )}
      <Header
        onCreateChat={addNewChat}
        onSelectChat={setActiveChatId}
        onDeleteMessage={deleteMessage}
        onEdit={setMessageToEdit}
        onStar={starMessage}
        onDeleteChat={handleOpenDeleteChatModal}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        chats={chats}
        onWatchStarred={handleOpenStarredMessages}
        mode={openMenuId !== '' ? 'editing' : ''}
        selectedMessage={selectedMessage}
        isStarredView={isStarredMessagesOpen}
      />
      <MessagesContainer
        messages={
          isStarredMessagesOpen
            ? starredMessages?.messages || []
            : activeChat?.messages || []
        }
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        messageToEdit={messageToEdit}
        onCancelEditing={cancelEditing}
        status={status}
        promptOffset={promptHeight}
        isStarredView={isStarredMessagesOpen}
      />
      {!isStarredMessagesOpen ? (
        <Prompt
          onSendMessage={addNewMessage}
          editingMessage={messageToEdit}
          onUpdateMessage={updateMessage}
          inputRef={inputRef}
        />
      ) : (
        <div className="p-3 py-5 bg-primary rounded-t-3xl text-text-color text-center font-semibold text-lg">
          Mensajes destacados
        </div>
      )}
    </div>
  );
}

export default App;
