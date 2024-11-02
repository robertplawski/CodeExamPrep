import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { twMerge } from "tw-merge";

export const Transition = (props) => {
  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);
  return (
    <div
      {...props}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransistionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}
      className={twMerge(
        `flex-1  w-[100vw] p-2 h-[100vh] bg-neutral-100 flex flex-col items-center ${
          props.className || ""
        } ${transitionStage || ""}`
      )}
    >
      <Outlet />
    </div>
  );
};
