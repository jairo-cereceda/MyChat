
interface DateBadgeProps{
  timestamp: string
}


const DateBadge: React.FC<DateBadgeProps> = ({ timestamp }) => {
  return (
   <span className="self-center text-xs bg-[var(--mc-detail-color)] text-[var(--mc-text-color)] px-1 rounded">{timestamp}</span>
  );
}

export default DateBadge;