import { RxCross2 } from 'react-icons/rx';

export interface StatusMessageProps {
  type: 'editing' | 'edited' | 'deleted' | null;
  onCancelEditing?: () => void;
}

const STATUS_TEXT = {
  editing: 'Editando',
  edited: 'Mensaje editado',
  deleted: 'Mensaje eliminado',
} as const;

function StatusMessage({ type, onCancelEditing }: StatusMessageProps) {
  if (!type) return null;

  return (
    <div
      className={`fixed flex self-center gap-1 items-center ${type === 'editing' ? 'bottom-20 xl:bottom-auto' : 'bottom-auto'}`}
    >
      <p className="text-center py-2 px-4 rounded-2xl bg-primary text-sm text-text-color select-none no-callout">
        {STATUS_TEXT[type]}
      </p>
      {type === 'editing' && (
        <button
          className="rounded-4xl cursor-pointer bg-primary text-sm text-text-color grow-0 block p-2  active:bg-detail-hover hover:bg-detail-hover"
          onClick={onCancelEditing}
        >
          <RxCross2 />
        </button>
      )}
    </div>
  );
}

export default StatusMessage;
