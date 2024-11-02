import { MdError } from "react-icons/md";

export const CenteredErrorText = ({ children }) => {
  return (
    <div className="flex items-center justify-center flex-row gap-4">
      <MdError size={20} />
      <p>{children}</p>
    </div>
  );
};
