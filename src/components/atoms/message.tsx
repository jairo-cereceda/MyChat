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
        className="wrap-break-word text-text-color rounded-3xl p-3 font-mc bg-primary flex flex-col gap-1 max-w-[90%] select-none"
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
