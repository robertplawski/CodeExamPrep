import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { FaUser } from "react-icons/fa";
import { Login } from "../routes/Login";
import { Index } from "../routes/Index";
import { PopupContext } from "../contexts/PopupContext";

export const Header = ({ children }) => {
  const { showPopup } = useContext(PopupContext);
  const { me, isWaiting } = useContext(AuthContext);
  return (
    <header className="border-neutral-200 border-[0.05rem] flex flex-row items-center gap-2 justify-between shadow-sm rounded-lg bg-white p-2 top-0 w-full ">
      <Link to="/">
        <p className=" font-bold text-lg">CEP</p>
      </Link>
      {children}
      {!isWaiting &&
        (me ? (
          <Button onClick={() => showPopup(<Index />)}>
            <FaUser />
            <p>{me.name}</p>
          </Button>
        ) : (
          <Button onClick={() => showPopup(<Login />)}>
            <FaUser />
            <p>Zaloguj się</p>
          </Button>
        ))}
    </header>
  );
};
