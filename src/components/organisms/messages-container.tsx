import { useRef, useLayoutEffect, useCallback } from 'react';
import Message from '../atoms/message';
import DateBadge from '../atoms/date-badge';
import { type MessageData } from '../../types';
import StatusMessage from '../atoms/StatusMessage';

interface MessagesContainerProps {
  messages: MessageData[];
  openMenuId: string;
  setOpenMenuId: (id: string) => void;
  setMenuTriggerRef: (message: HTMLElement | null) => void;
  messageToEdit: MessageData | null;
  onCancelEditing?: () => void;
  status:
    | 'editing'
    | 'edited'
    | 'starred'
    | 'unstarred'
    | 'imported'
    | 'exported'
    | 'cannotShowStarred'
    | 'deleted'
    | null;
  promptOffset: number;
  isStarredView?: boolean;
}

function MessagesContainer({
  messages,
  openMenuId,
  setOpenMenuId,
  messageToEdit,
  onCancelEditing,
  status,
  promptOffset,
  isStarredView,
  setMenuTriggerRef,
}: MessagesContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [lastMessageId, isStarredView]);

  const currentStatus = messageToEdit ? 'editing' : status;

  const handleOpenMenu = useCallback(
    (id: string, ref: HTMLParagraphElement | null) => {
      setOpenMenuId(id);
      setMenuTriggerRef(ref);
    },
    [setOpenMenuId, setMenuTriggerRef]
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-25 p-3 h-full flex gap-2 flex-col items-end overflow-y-auto scrollbar-custom"
    >
      {currentStatus && (
        <StatusMessage
          type={currentStatus}
          onCancelEditing={onCancelEditing}
          promptOffset={promptOffset}
        />
      )}

      {messages.map(({ id, text, isStarred, timestamp }, index) => (
        <div key={id} className="flex gap-2 flex-col items-end w-full">
          {timestamp.substring(0, 10) !==
            messages[index - 1]?.timestamp.substring(0, 10) && (
            <DateBadge timestamp={timestamp.substring(0, 10)} />
          )}
          <Message
            text={text}
            timestamp={timestamp.substring(11, 16)}
            isStarred={isStarred}
            onOpenMenu={(e) => {
              handleOpenMenu(id, e.target as HTMLParagraphElement);
            }}
            openMenuId={id === openMenuId ? openMenuId : ''}
          />
        </div>
      ))}
    </div>
  );
}

export default MessagesContainer;
