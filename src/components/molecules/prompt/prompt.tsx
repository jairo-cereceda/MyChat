import { useState } from 'react';
import Submit from '../../atoms/submit';
import Input from '../../atoms/input';
import type { MessageData } from '../../../App';

interface PromptProps {
  onSendMessage: (text: string) => void;
  editingMessage: MessageData | null;
  onUpdateMessage: (text: string) => void;
}

function Prompt({
  onSendMessage,
  editingMessage,
  onUpdateMessage,
}: PromptProps) {
  const [inputValue, setInputValue] = useState(editingMessage?.text || '');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (editingMessage) {
      onUpdateMessage(inputValue);
    } else {
      onSendMessage(inputValue);
    }

    setInputValue('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-end p-3 pt-4 bg-[var(--mc-primary-color)] rounded-t-3xl"
    >
      <Input value={inputValue} onChange={setInputValue} />
      <Submit disabled={!inputValue.trim()} />
    </form>
  );
}

export default Prompt;
