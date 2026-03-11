import Submit from '../../atoms/submit/submit';
import Input from '../../atoms/input/input';
import type { MessageData } from '../../../types';
import { useState, useEffect, useCallback } from 'react';

interface PromptProps {
  onSendMessage: (text: string) => void;
  editingMessage: MessageData | null;
  onUpdateMessage: (text: string, messageToUpdate: MessageData) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  isDisabled?: boolean;
}

function Prompt({
  inputRef,
  onSendMessage,
  editingMessage,
  onUpdateMessage,
  isDisabled = false,
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
      className={`relative flex gap-2 items-end p-3 pt-4 bg-primary rounded-t-3xl`}
    >
      {isDisabled && (
        <p className="absolute inset-0 flex items-center justify-center text-text-color text-center font-semibold text-lg bg-primary rounded-t-3xl z-10">
          Mensajes destacados
        </p>
      )}
      <div
        className={`flex gap-2 items-end w-full ${isDisabled ? 'opacity-0' : ''}`}
      >
        <Input
          inputRef={inputRef}
          value={inputValue}
          isDisabled={isDisabled}
          onChange={setInputValue}
        />
        <Submit disabled={isDisabled || !inputValue.trim()} />
      </div>
    </form>
  );
}

export default Prompt;
