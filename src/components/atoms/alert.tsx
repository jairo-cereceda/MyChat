export interface AlertProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Alert({ text, onConfirm, onCancel }: AlertProps) {
  return (
    <div className="fixed flex z-100 justify-center items-center w-full h-full bg-backdrop">
      <div className="rounded-2xl bg-primary text-text-color p-4 flex flex-col gap-3 ">
        <h2 className="font-semibold text-center">{text}</h2>
        <div className="flex justify-between w-full gap-4">
          <button
            onClick={onConfirm}
            className="font-semibold px-5 py-2 rounded-lg bg-detail hover:bg-detail-hover"
          >
            Aceptar
          </button>
          <button
            onClick={onCancel}
            className="font-semibold px-5 py-2 rounded-lg bg-detail hover:bg-detail-hover"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alert;
