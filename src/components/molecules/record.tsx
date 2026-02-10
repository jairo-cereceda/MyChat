import ChatTile from '../atoms/chat-tile';
import { type ChatData } from '../../App';
import { useRef } from 'react';

interface RecordProps {
  chats: ChatData[];
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

function Record({
  chats,
  onDeleteChat,
  onCreateChat,
  onSelectChat,
}: RecordProps) {
  const popoverRef = useRef<HTMLUListElement | null>(null);
  const closeRecords = () => {
    popoverRef.current?.hidePopover();
  };

  return (
    <nav className="p-2 fixed">
      <ul
        ref={popoverRef}
        className="menu-popover w-[90%] md:max-w-100 flex flex-col divide-y bg-primary border-t-2 border-secondary divide-secondary pr-2"
        popover="auto"
        id="record"
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
      </ul>
    </nav>
  );
}

export default Record;
