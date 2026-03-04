import Submit from '../atoms/submit';
import Input from '../atoms/input';
import type { MessageData } from '../../types';
import { useState, useEffect, useCallback } from 'react';

interface PromptProps {
  onSendMessage: (text: string) => void;
  editingMessage: MessageData | null;
  onUpdateMessage: (text: string, messageToUpdate: MessageData) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

function Prompt({
  inputRef,
  onSendMessage,
  editingMessage,
  onUpdateMessage,
}: PromptProps) {
  const [inputValue, setInputValue] = useState('');
  const isMobile = window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const id = setTimeout(() => {
      setInputValue(editingMessage?.text || '');
    });
    return () => clearTimeout(id);
  }, [editingMessage]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    if (editingMessage) {
      onUpdateMessage(inputValue, editingMessage);
    } else {
      onSendMessage(inputValue);
    }

    setInputValue('');
  }, [inputValue, editingMessage, onSendMessage, onUpdateMessage]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    textarea.addEventListener('keydown', handleKeyDown);

    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef, isMobile, handleSendMessage]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-end p-3 pt-4 bg-primary rounded-t-3xl"
    >
      <Input inputRef={inputRef} value={inputValue} onChange={setInputValue} />
      <Submit disabled={!inputValue.trim()} />
    </form>
  );
}

export default Prompt;
