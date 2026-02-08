import { useRef, useEffect, useState } from 'react';
import Message from './message';
import DateBadge from './date-badge';
import { type MessageData } from '../../App';

interface MessagesContainerProps {
  messages: MessageData[];
  handleSetMessage: React.Dispatch<React.SetStateAction<MessageData[]>>;
  onEditClick: (msg: MessageData) => void;
}

function MessagesContainer({
  messages,
  handleSetMessage,
  onEditClick,
}: MessagesContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState('');

  const deleteMessage = (id: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    handleSetMessage(updatedMessages);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-[100px] p-3 h-full flex gap-2 flex-col items-end overflow-y-auto"
    >
      {messages.map(({ id, text, timestamp }, index) => (
        <div key={id} className="flex gap-2 flex-col items-end w-full">
          {timestamp.substring(0, 10) !==
            messages[index - 1]?.timestamp.substring(0, 10) && (
            <DateBadge timestamp={timestamp.substring(0, 10)} />
          )}
          <Message
            id={id}
            text={text}
            timestamp={timestamp.substring(11, 16)}
            isMenuOpen={openMenuId}
            onOpenMenu={() => setOpenMenuId(id)}
            onCloseMenu={() => setOpenMenuId('')}
            onDelete={deleteMessage}
            onEdit={() => onEditClick({ id, text, timestamp })}
          />
        </div>
      ))}
    </div>
  );
}

export default MessagesContainer;
