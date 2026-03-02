import { useRef, useLayoutEffect } from 'react';
import Message from '../atoms/message';
import DateBadge from '../atoms/date-badge';
import { type MessageData } from '../../App';

interface MessagesContainerProps {
  messages: MessageData[];
  OpenMenuId: string;
  setOpenMenuId: (id: string) => void;
}

function MessagesContainer({
  messages,
  OpenMenuId,
  setOpenMenuId,
}: MessagesContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [lastMessageId]);

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
            text={text}
            timestamp={timestamp.substring(11, 16)}
            onOpenMenu={() => setOpenMenuId(id)}
            openMenuId={id === OpenMenuId ? OpenMenuId : ''}
          />
        </div>
      ))}
    </div>
  );
}

export default MessagesContainer;
