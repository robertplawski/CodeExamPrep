import { twMerge } from "tw-merge";

export const Button = ({ disabled, children, onClick, className, type }) => {
  return (
    <button
      disabled={disabled}
      className={twMerge(
        `hover:bg-neutral-100 flex items-center gap-2 justify-center transition-colors min-w-0 p-1 rounded-lg border-[0.025rem] border-neutral-400 ${className} disabled:bg-neutral-200`
      )}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
