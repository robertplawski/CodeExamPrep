import { twMerge } from "tw-merge";

export const Input = ({
  placeholder,
  type,
  name,
  value,
  onChange,
  className,
}) => {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      type={type}
      name={name}
      value={value}
      className={twMerge(
        `flex-[2] min-w-0 p-[0.15rem] rounded-lg border-[0.025rem] border-neutral-400 `,
        className || ""
      )}
    />
  );
};
