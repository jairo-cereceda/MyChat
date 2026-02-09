import TextareaAutosize from 'react-textarea-autosize';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

function Input({ value, onChange }: InputProps) {
  return (
    <TextareaAutosize
      minRows={1}
      maxRows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Mensaje"
      name="message"
      id="message"
      className=" w-full resize-none rounded-3xl p-2 text-text-color bg-secondary font-mc"
    ></TextareaAutosize>
  );
}

export default Input;
