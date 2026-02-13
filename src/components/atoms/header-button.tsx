import { type IconType } from 'react-icons';

interface HeaderButtonProps {
  icon: IconType;
  onDelete?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
}

function HeaderButton({
  icon: Icon,
  onDelete,
  onEdit,
  onClose,
}: HeaderButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onDelete || onEdit) {
      e.stopPropagation();
    }

    if (onDelete) {
      onDelete();
    } else if (onEdit) {
      onEdit();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <button
      onClick={handleClick}
      popoverTarget="record"
      className="text-text-color p-2 rounded-lg hover:bg-secondary active:bg-secondary"
    >
      <Icon size={30} />
    </button>
  );
}

export default HeaderButton;
