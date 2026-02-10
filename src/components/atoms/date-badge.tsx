interface DateBadgeProps {
  timestamp: string;
}

const DateBadge: React.FC<DateBadgeProps> = ({ timestamp }) => {
  return (
    <span className="self-center text-xs bg-detail text-text-color px-1 rounded select-none">
      {timestamp}
    </span>
  );
};

export default DateBadge;
