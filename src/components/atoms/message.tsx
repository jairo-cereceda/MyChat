import { useEffect } from 'react';
import MessageMenu from './message-menu';

export interface MessageProps {
  id: string;
  text: string;
  timestamp: string;
  isMenuOpen: string;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const Message: React.FC<MessageProps> = ({
  id,
  text,
  timestamp,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  onDelete,
  onEdit,
}) => {
  useEffect(() => {
    if (isMenuOpen !== '') {
      document.addEventListener('click', onCloseMenu);
      document.addEventListener('contextmenu', onCloseMenu);
    }

    return () => {
      document.removeEventListener('click', onCloseMenu);
      document.removeEventListener('contextmenu', onCloseMenu);
    };
  });

  return (
    <div className="relative flex w-full justify-end">
      <p
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenMenu();
        }}
        className="break-words text-[var(--mc-text-color)] rounded-3xl p-3 font-mc bg-[var(--mc-primary-color)] flex flex-col gap-1 max-w-[90%]"
      >
        {text}
        <span className="text-xs self-end">{timestamp}</span>
      </p>
      {isMenuOpen === id && (
        <MessageMenu id={id} onDelete={onDelete} onEdit={onEdit} />
      )}
    </div>
  );
};

export default Message;
