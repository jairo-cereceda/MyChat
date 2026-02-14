import { useRef } from 'react';

export interface MessageProps {
  text: string;
  timestamp: string;
  onOpenMenu: () => void;
  openMenuId: string;
}

const Message: React.FC<MessageProps> = ({
  text,
  timestamp,
  onOpenMenu,
  openMenuId,
}) => {
  const timerRef = useRef<number | null>(null);

  const startPressTimer = () => {
    timerRef.current = window.setTimeout(() => {
      onOpenMenu();
    }, 500);
  };

  const cancelPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      className={`flex w-full justify-end ${openMenuId !== '' ? 'bg-detail-backdrop shadow-detail-highlight [clip-path:inset(0_-100vw)]' : ''}`}
    >
      <p
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenMenu();
        }}
        onTouchStart={startPressTimer}
        onTouchEnd={cancelPressTimer}
        onTouchMove={cancelPressTimer}
        onTouchCancel={cancelPressTimer}
        className="wrap-break-word text-text-color rounded-3xl p-3 font-mc bg-primary flex flex-col gap-1 max-w-[90%] select-none no-callout"
      >
        {text.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
        <span className="text-xs self-end">{timestamp}</span>
      </p>
    </div>
  );
};

export default Message;
