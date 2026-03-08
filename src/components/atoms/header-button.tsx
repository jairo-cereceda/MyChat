import React from 'react';
import { type IconType } from 'react-icons';

interface HeaderButtonProps {
  icon: IconType;
  ariaLabel: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  onStar?: () => void;
  onWatchStarred?: () => void;
  isPopoverOpener?: boolean;
}

const HeaderButton = React.forwardRef<HTMLButtonElement, HeaderButtonProps>(
  (
    {
      icon: Icon,
      ariaLabel,
      onDelete,
      onEdit,
      onClose,
      onStar,
      onWatchStarred,
      isPopoverOpener,
    },
    ref
  ) => {
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
        ref={ref}
        onClick={handleClick}
        aria-label={ariaLabel}
        popoverTarget={isPopoverOpener ? 'record' : undefined}
        className="text-text-color p-2 rounded-lg cursor-pointer hover:bg-secondary active:bg-secondary"
      >
        <Icon size={30} />
      </button>
    );
  }
);

export default HeaderButton;
