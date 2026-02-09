import { useRef, useEffect, useState } from 'react';
import Message from './message';
import DateBadge from './date-badge';
import { type MessageData } from '../../App';

interface MessagesContainerProps {
  messages: MessageData[];
  onDeleteMessage: (id: string) => void;
  onEditClick: (msg: MessageData) => void;
}

function MessagesContainer({
  messages,
  onDeleteMessage,
  onEditClick,
}: MessagesContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState('');

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-25 p-3 h-full flex gap-2 flex-col items-end overflow-y-auto"
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
            onCloseMenu={() => setOpenMenuId(id)}
            onDelete={() => onDeleteMessage(id)}
            onEdit={() => onEditClick({ id, text, timestamp })}
          />
        </div>
      ))}
    </div>
  );
}

export default MessagesContainer;
