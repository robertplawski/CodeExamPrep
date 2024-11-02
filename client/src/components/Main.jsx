import { twMerge } from "tw-merge";

export const Main = ({ children, className }) => {
  return (
    <main
      className={twMerge(
        `flex p-2 bg-neutral-100 w-3xl flex-col items-center gap-2 min-h-[100vh] ${className}`
      )}
    >
      {children}
    </main>
  );
};
