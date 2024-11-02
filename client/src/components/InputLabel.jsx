export const InputLabel = ({ icon, text }) => {
  return (
    <div className="flex-1 flex-row gap-2 flex items-center">
      {icon}
      <label>{text}</label>
    </div>
  );
};
