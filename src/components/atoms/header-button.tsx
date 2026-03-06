import { type IconType } from 'react-icons';

interface HeaderButtonProps {
  icon: IconType;
  onDelete?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  onStar?: () => void;
  onWatchStarred?: () => void;
  isPopoverOpener?: boolean;
}

function HeaderButton({
  icon: Icon,
  onDelete,
  onEdit,
  onClose,
  onStar,
  onWatchStarred,
  isPopoverOpener,
}: HeaderButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onDelete || onEdit || onStar || onWatchStarred || onClose) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (onDelete) {
      onDelete();
    } else if (onEdit) {
      onEdit();
    } else if (onStar) {
      onStar();
    } else if (onWatchStarred) {
      onWatchStarred();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <button
      onClick={handleClick}
      popoverTarget={isPopoverOpener ? 'record' : undefined}
      className="text-text-color p-2 rounded-lg cursor-pointer hover:bg-secondary active:bg-secondary"
    >
      <Icon size={30} />
    </button>
  );
}

export default HeaderButton;
