import { useRef, forwardRef } from 'react';
import { RiStarFill } from 'react-icons/ri';

export interface MessageProps {
  text: string;
  timestamp: string;
  isStarred?: boolean;
  onOpenMenu: (
    e:
      | React.MouseEvent<HTMLParagraphElement>
      | React.TouchEvent<HTMLParagraphElement>
      | React.KeyboardEvent<HTMLParagraphElement>
  ) => void;
  openMenuId: string;
}

const Message = forwardRef<HTMLParagraphElement, MessageProps>(
  ({ text, timestamp, isStarred, onOpenMenu, openMenuId }, ref) => {
    const timerRef = useRef<number | null>(null);

    const startPressTimer = () => {
      timerRef.current = window.setTimeout(
        (e: React.TouchEvent<HTMLParagraphElement>) => {
          onOpenMenu(e);
        },
        500
      );
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
          tabIndex={0}
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ContextMenu') {
              e.preventDefault();
              e.stopPropagation();
              onOpenMenu(e);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenMenu(e);
          }}
          onTouchStart={startPressTimer}
          onTouchEnd={cancelPressTimer}
          onTouchMove={cancelPressTimer}
          onTouchCancel={cancelPressTimer}
          className="wrap-break-word text-text-color rounded-3xl p-3 font-mc bg-primary flex flex-col gap-1 max-w-[90%] select-none no-callout"
        >
          {text
            .trim()
            .split('\n')
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          <span className="text-xs self-end flex items-center gap-1">
            {isStarred ? <RiStarFill /> : null}
            {timestamp}
          </span>
        </p>
      </div>
    );
  }
);

export default Message;
