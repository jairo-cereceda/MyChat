export interface ModalButton {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface ModalProps {
  text?: string;
  children?: React.ReactNode;
  buttons?: ModalButton[];
  onCancel?: () => void;
}
function Modal({ text, children, buttons, onCancel }: ModalProps) {
  return (
    <div
      popover="auto"
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
              onClick={btn.onClick}
              className={`font-semibold cursor-pointer px-5 py-2 rounded-lg ${
                btn.variant === 'primary'
                  ? 'bg-detail hover:bg-detail-hover active:bg-detail-hover'
                  : 'bg-secondary hover:bg-secondary-hover active:bg-secondary-hover'
              }`}
            >
              {btn.text}
            </button>
          ))}

          {!buttons && onCancel && (
            <button
              onClick={onCancel}
              className="font-semibold cursor-pointer px-5 py-2 rounded-lg bg-detail hover:bg-detail-hover active:bg-detail-hover"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
