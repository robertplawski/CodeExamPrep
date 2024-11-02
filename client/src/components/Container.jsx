import { twMerge } from "tw-merge";

export const Container = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        ` border-neutral-400 bg-white min-w-0 gap-2 flex flex-col p-4 rounded-lg shadow-md ` +
          className
      )}
    >
      {children}
    </div>
  );
};
