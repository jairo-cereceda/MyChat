import Prompt from './components/molecules/prompt/prompt';
import MessagesContainer from './components/atoms/messages-container';
import { useState, useEffect } from 'react';

export interface MessageData {
  id: string;
  text: string;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<MessageData[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [messageToEdit, setMessageToEdit] = useState<MessageData | null>(null);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const addNewMessage = (text: string) => {
    const newMessage: MessageData = {
      id: crypto.randomUUID(),
      text: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const updateMessage = (text: string) => {
    if (!messageToEdit) return;

    setMessages((prev) =>
      prev.map((m) => (m.id === messageToEdit.id ? { ...m, text } : m))
    );
    setMessageToEdit(null);
  };

  return (
    <div className="h-[100vh] bg-[var(--mc-secondary-color)] flex flex-col gap-3">
      <MessagesContainer
        messages={messages}
        handleSetMessage={setMessages}
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
