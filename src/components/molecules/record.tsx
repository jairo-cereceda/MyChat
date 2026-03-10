import ChatTile from '../atoms/chat-tile';
import { type ChatData } from '../../types';
import { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface RecordProps {
  chats: ChatData[];
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onImportExport: () => void;
  setMenuTriggerRef: (message: HTMLElement | null) => void;
}

function Record({
  chats,
  onDeleteChat,
  onCreateChat,
  onSelectChat,
  onImportExport,
  setMenuTriggerRef,
}: RecordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLUListElement | null>(null);
  const closeRecords = () => {
    popoverRef.current?.hidePopover();
  };

  useEffect(() => {
    const pop = popoverRef.current;
    if (!pop) return;

    const handleToggle = () => {
      setIsOpen(pop.matches(':popover-open'));
    };

    pop.addEventListener('toggle', handleToggle);
    return () => pop.removeEventListener('toggle', handleToggle);
  }, []);

  useFocusTrap(popoverRef);

  return (
    <nav className="p-2 fixed">
      <ul
        ref={popoverRef}
        className="h-full menu-popover w-[90%] md:max-w-100 flex flex-col divide-y bg-primary border-t-2 border-secondary divide-secondary pr-2"
        popover="auto"
        id="record"
        inert={!isOpen ? true : undefined}
      >
        {chats.map((chat) =>
          chat ? (
            <li key={chat.id}>
              <ChatTile
                chat={{
                  id: chat.id,
                  name: chat.messages[0]?.text,
                  timestamp: chat.timestamp,
                  messages: chat.messages,
                }}
                onClick={() => onSelectChat(chat.id)}
                onDeleteChat={() => onDeleteChat(chat.id)}
                onHide={() => closeRecords()}
                setMenuTriggerRef={setMenuTriggerRef}
              />
            </li>
          ) : null
        )}

        <li>
          <ChatTile
            type="add"
            onClick={() => onCreateChat()}
            onHide={() => closeRecords()}
          />
        </li>

        <li className="grow" aria-hidden="true"></li>

        <li>
          <ChatTile
            type="export-import"
            onClick={() => onImportExport()}
            onHide={() => closeRecords()}
            setMenuTriggerRef={setMenuTriggerRef}
          />
        </li>
      </ul>
    </nav>
  );
}

export default Record;
