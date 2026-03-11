import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

export interface StatusMessageProps {
  type:
    | 'editing'
    | 'edited'
    | 'deleted'
    | 'starred'
    | 'unstarred'
    | 'imported'
    | 'exported'
    | 'cannotShowStarred'
    | null;
  promptOffset?: number;
  onCancelEditing?: () => void;
}

export const STATUS_TEXT = {
  editing: 'Editando',
  edited: 'Mensaje editado',
  deleted: 'Mensaje eliminado',
  starred: 'Mensaje destacado',
  unstarred: 'Mensaje destacado eliminado',
  imported: 'Chats importados',
  exported: 'Chats exportados',
  cannotShowStarred: 'No hay destacados',
} as const;

function StatusMessage({
  type,
  onCancelEditing,
  promptOffset,
}: StatusMessageProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 1023px)').matches
      : true
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);

  if (!type) return null;

  return (
    <div
      className={`fixed flex self-center gap-1 items-center`}
      style={{
        bottom:
          promptOffset && isMobile && type === 'editing'
            ? promptOffset + 52
            : undefined,
      }}
    >
      <p className="text-center py-2 px-4 rounded-2xl bg-primary text-sm text-text-color select-none no-callout shadow-white">
        {STATUS_TEXT[type]}
      </p>
      {type === 'editing' && (
        <button
          className="rounded-4xl cursor-pointer shadow-white bg-primary text-sm text-text-color grow-0 block p-2  active:bg-detail-hover hover:bg-detail-hover"
          onClick={onCancelEditing}
        >
          <RxCross2 />
        </button>
      )}
    </div>
  );
}

export default StatusMessage;
