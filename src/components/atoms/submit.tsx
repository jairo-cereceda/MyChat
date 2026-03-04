import { BiSolidSend } from 'react-icons/bi';

interface SubmitProps {
  disabled?: boolean;
}

function Submit({ disabled }: SubmitProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`grow-0  block rounded-full font-mc font-semibold p-3 text-text-color  ${disabled ? 'bg-detail-disabled cursor-not-allowed' : 'bg-detail hover:bg-detail-hover active:bg-detail-hover cursor-pointer'}`}
    >
      <BiSolidSend />
    </button>
  );
}

export default Submit;
