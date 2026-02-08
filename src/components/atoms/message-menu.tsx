import { MdDelete } from 'react-icons/md';
import { BiSolidPencil } from 'react-icons/bi';

export interface ContextMenuProps {
  id: string;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const MessageMenu: React.FC<ContextMenuProps> = ({ id, onDelete, onEdit }) => {
  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="absolute right-0 z-10 flex text-[var(--mc-text-color)] flex-col rounded-2xl bg-[var(--mc-detail-color)]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="px-4 py-2 hover:bg-[var(--mc-detail-hover)] rounded-t-2xl"
      >
        <BiSolidPencil />
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 hover:bg-[var(--mc-detail-hover)] rounded-b-2xl"
      >
        <MdDelete />
      </button>
    </div>
  );
};

export default MessageMenu;
