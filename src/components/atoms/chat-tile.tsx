import { IoMdAddCircle } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { type ChatData } from '../../App';

export interface ChatTileProps {
  type?: string;
  chat?: ChatData;
  onClick?: () => void;
  onDeleteChat?: () => void;
  onHide: () => void;
}

function ChatTile({
  type,
  chat,
  onClick,
  onDeleteChat,
  onHide,
}: ChatTileProps) {
  if (type === 'add') {
    return (
      <button
        onClick={() => {
          if (onClick) onClick();
          onHide();
        }}
        className="p-2 flex gap-2 items-center hover:bg-secondary w-full text-text-color text-start font-semibold rounded-md m-1 truncate"
      >
        <IoMdAddCircle /> Añadir chat
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (onClick) onClick();
          onHide();
        }}
        className="p-2 hover:bg-secondary w-full text-text-color text-start font-semibold rounded-md m-1 truncate"
      >
        {chat?.name ? chat?.name : 'Escribe algo...'}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteChat?.();
        }}
        popoverTarget="alert"
        className="absolute z-40 text-text-color right-0 top-[50%] translate-[-50%] p-1 hover:bg-detail-hover rounded-md"
      >
        <MdDelete />
      </button>
    </div>
  );
}

export default ChatTile;
