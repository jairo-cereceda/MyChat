import { BiSolidSend } from "react-icons/bi";

interface SubmitProps {
  disabled?: boolean;
}

function Submit({ disabled }: SubmitProps) {
  return (
    <button 
      type="submit" 
      disabled={disabled}
      className="flex-grow-0 bg-[var(--mc-detail-color)] block rounded-full font-mc font-semibold p-3 text-[var(--mc-text-color)] hover:bg-[var(--mc-detail-hover)]"
    >
      <BiSolidSend />
    </button>
  );
}

export default Submit;