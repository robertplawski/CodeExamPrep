import { createContext, useState } from "react";
import { Outlet } from "react-router";
import { twMerge } from "tw-merge";

export const PopupContext = createContext({
  popupElement: null,
  isPopupShown: false,
  showPopup: (element, customClose) => {},
  closePopup: () => {},
});
export const PopupContextProvider = () => {
  const [isPopupShown, setPopupShown] = useState(false);
  const [popupElement, setPopupElement] = useState(null);
  const [canClose, setCanClose] = useState(false);
  const [customClose, setCustomClose] = useState(() => () => {});
  const showPopup = (element, closeFunction) => {
    setPopupShown(true);
    setCustomClose(() => closeFunction);
    setPopupElement(element);
  };
  const closePopup = () => {
    setPopupShown(false);
    setCustomClose(null);
  };
  return (
    <PopupContext.Provider
      value={{ popupElement, showPopup, closePopup, isPopupShown }}
    >
      <div
        className={twMerge(
          `transition-all duration-300 z-10 absolute  justify-center flex items-center w-full h-full ${
            isPopupShown
              ? "pointer-events-auto backdrop-blur-md bg-[rgba(0,0,0,0.2)]"
              : "pointer-events-none"
          }`
        )}
      >
        <div
          className="w-full h-full absolute"
          onClick={() => {
            if (customClose) {
              customClose();
            } else {
              closePopup();
            }
          }}
        />
        <div
          className={`${
            isPopupShown ? "scale-1" : "scale-0"
          } transition-all duration-200 flex items-center justify-center absolute`}
        >
          {popupElement}
        </div>
      </div>

      <Outlet />
    </PopupContext.Provider>
  );
};
