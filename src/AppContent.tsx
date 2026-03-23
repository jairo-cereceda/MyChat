import { useState, useMemo, useRef, useLayoutEffect } from 'react';
import Prompt from './components/molecules/prompt/prompt';
import Header from './components/organisms/header/header';
import MessagesContainer from './components/organisms/messages-container/messages-container';
import Modal from './components/atoms/modal/modal';
import { useAutoFocus } from './hooks/useAutoFocus';
import { useChat } from './context/useChat';
import { exportChats, importChats } from './storage/backup';
import StatusMessage from './components/atoms/status-message/status-message';

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
  const [menuTriggerRef, setMenuTriggerRef] = useState<HTMLElement | null>(
    null
  );
  const [promptHeight, setPromptHeight] = useState(0);

  const isPromptDisabled = isStarredMessagesOpen && !messageToEdit;

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      setStatus('imported');

      setTimeout(() => {
        setStatus(null);
      }, 1000);
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

    setStatus('exported');

    setTimeout(() => {
      setStatus(null);
    }, 1000);
  };

  const cancelEditing = () => {
    setMessageToEdit(null);
  };

  return (
    <div className="h-dvh bg-secondary flex flex-col">
      {(status === 'imported' || status === 'exported') && (
        <StatusMessage type={status} />
      )}

      {isDeleteModalOpen && (
        <Modal
          text="¿Deseas eliminar este chat?"
          buttons={[
            { text: 'Cancelar', closeOnClick: true, variant: 'primary' },
            {
              text: 'Aceptar',
              onClick: handleConfirmDeleteChat,
              variant: 'primary',
            },
          ]}
          closeModal={closeModal}
          menuTriggerRef={menuTriggerRef}
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
              closeOnClick: true,
              variant: 'secondary',
            },
          ]}
          menuTriggerRef={menuTriggerRef}
          closeModal={closeModal}
        />
      )}
      <h1 className="sr-only">
        {activeChat ? activeChat.messages[0]?.text : 'Comienza tu chat'}
      </h1>
      <Header
        onCreateChat={addNewChat}
        onSelectChat={setActiveChatId}
        onDeleteMessage={deleteMessage}
        onEdit={setMessageToEdit}
        onStar={starMessage}
        chatName={
          activeChat ? activeChat.messages[0]?.text : 'Comienza tu chat'
        }
        onDeleteChat={handleOpenDeleteChatModal}
        onImportExport={handleOpenImportExportModal}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        chats={chats}
        onWatchStarred={handleOpenStarredMessages}
        mode={openMenuId !== '' ? 'editing' : ''}
        selectedMessage={selectedMessage}
        menuTriggerRef={menuTriggerRef}
        setMenuTriggerRef={setMenuTriggerRef}
        isStarredView={isStarredMessagesOpen}
      />
      <main className="contents">
        <MessagesContainer
          messages={
            isStarredMessagesOpen
              ? starredMessages?.messages || []
              : activeChat?.messages || []
          }
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          messageToEdit={messageToEdit}
          setMessageToEdit={setMessageToEdit}
          onCancelEditing={cancelEditing}
          status={status}
          setMenuTriggerRef={setMenuTriggerRef}
          promptOffset={promptHeight}
          isStarredView={isStarredMessagesOpen}
        />

        <Prompt
          onSendMessage={addNewMessage}
          editingMessage={messageToEdit}
          onUpdateMessage={updateMessage}
          inputRef={inputRef}
          isDisabled={isPromptDisabled}
        />
      </main>

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
