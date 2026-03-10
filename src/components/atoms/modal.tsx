import { useCallback, useEffect, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface ModalButton {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  closeOnClick?: boolean;
}

export interface ModalProps {
  text?: string;
  children?: React.ReactNode;
  buttons?: ModalButton[];
  closeModal?: () => void;
  menuTriggerRef: HTMLElement | null;
}
function Modal({
  text,
  children,
  buttons,
  closeModal,
  menuTriggerRef,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseMenu = useCallback(() => {
    closeModal?.();
    menuTriggerRef?.focus();
  }, [closeModal, menuTriggerRef]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        handleCloseMenu();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleCloseMenu]);

  useFocusTrap(modalRef);

  const handleButtonClick = (btn: ModalButton) => {
    btn.onClick?.();

    if (btn.closeOnClick) {
      handleCloseMenu();
    }
  };

  return (
    <div
      popover="auto"
      role="dialog"
      tabIndex={-1}
      ref={modalRef}
      aria-modal="true"
      id="alert"
      className="fixed flex z-100 justify-center items-center w-full h-full bg-backdrop"
    >
      <div className="rounded-2xl bg-primary text-text-color p-4 flex flex-col gap-3">
        {text && <h2 className="font-semibold text-center">{text}</h2>}
        {children}

        <div className="flex justify-between w-full gap-4">
          {buttons?.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleButtonClick(btn)}
              className={`font-semibold cursor-pointer px-5 py-2 rounded-lg ${
                btn.variant === 'primary'
                  ? 'bg-detail hover:bg-detail-hover active:bg-detail-hover'
                  : 'bg-secondary hover:bg-secondary-hover active:bg-secondary-hover'
              }`}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
