import { BiSolidSend } from 'react-icons/bi';

interface SubmitProps {
  disabled?: boolean;
}

function Submit({ disabled }: SubmitProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="grow-0 bg-detail block rounded-full font-mc font-semibold p-3 text-text-color hover:bg-detail-hover"
    >
      <BiSolidSend />
    </button>
  );
}

export default Submit;
