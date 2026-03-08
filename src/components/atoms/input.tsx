import TextareaAutosize from 'react-textarea-autosize';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

function Input({ value, onChange, inputRef }: InputProps) {
  return (
    <div className="w-full rounded-3xl bg-secondary overflow-hidden ring-offset-background focus-within:ring-1 focus-within:ring-white flex">
      <label htmlFor="message" className="sr-only">
        Mensaje:
      </label>
      <TextareaAutosize
        ref={inputRef}
        minRows={1}
        maxRows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Mensaje"
        name="message"
        id="message"
        className="block w-full resize-none p-2 text-text-color font-mc scrollbar-custom"
      ></TextareaAutosize>
    </div>
  );
}

export default Input;
