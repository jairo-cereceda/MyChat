import { useState, useMemo, useRef, useLayoutEffect } from 'react';
import Prompt from './components/molecules/prompt';
import Header from './components/organisms/header/header';
import MessagesContainer from './components/organisms/messages-container';
import Modal from './components/atoms/modal';
import { useAutoFocus } from './hooks/useAutoFocus';
import { useChat } from './context/useChat';
import { exportChats, importChats } from './storage/backup';

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
    refreshChats,
    status,
    setStatus,
    setOpenMenuId,
  } = useChat();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [importExportError, setImportExportError] = useState<string | null>(
    null
  );
  const [idChatToDelete, setIdChatToDelete] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    if (starredMessages || isStarredMessagesOpen) {
      setIsStarredMessagesOpen(!isStarredMessagesOpen);
    } else {
      setStatus('cannotShowStarred');
    }
  };

  const handleOpenDeleteChatModal = (id: string) => {
    setIdChatToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleOpenImportExportModal = () => {
    setIsImportExportModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsImportExportModalOpen(false);
    setIdChatToDelete(null);
    setImportExportError(null);
  };

  const handleConfirmDeleteChat = () => {
    if (idChatToDelete) {
      deleteChat(idChatToDelete);
    }

    closeModal();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importChats(file);
      setImportExportError(null);
      refreshChats();

      setActiveChatId(null);
      closeModal();
    } catch (err) {
      console.error(err);
      setImportExportError('Error al importar el backup');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    exportChats();
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

      {isImportExportModalOpen && (
        <Modal
          text={importExportError ? `${importExportError}` : 'Maneja tus chats'}
          buttons={[
            {
              text: 'Importar',
              onClick: () => fileInputRef.current?.click(),
              variant: 'primary',
            },
            { text: 'Exportar', onClick: handleExport, variant: 'primary' },
            {
              text: '×',
              onClick: closeModal,
              variant: 'secondary',
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
        onImportExport={handleOpenImportExportModal}
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

      <input
        type="file"
        className="hidden"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleImport}
      />
    </div>
  );
}

export default App;
