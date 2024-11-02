import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Main } from "../components/Main.jsx";
import { Container } from "../components/Container.jsx";
import { CenteredText } from "../components/CenteredText.jsx";
import { CenteredTitleText } from "../components/CenteredTitleText.jsx";
import { Button } from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { FaCog, FaDoorOpen, FaQuestion } from "react-icons/fa";
import { MdAdminPanelSettings, MdEmail } from "react-icons/md";
import { DoomsdayClock } from "../components/DoomsdayClock.jsx";
import { PopupContext } from "../contexts/PopupContext.jsx";
import { Admin } from "./Admin.jsx";
export const Index = () => {
  const { logout, me } = useContext(AuthContext);
  const { closePopup, showPopup } = useContext(PopupContext);
  return (
    <Container>
      <CenteredTitleText>Witaj, {me.name}</CenteredTitleText>

      <hr />
      {!me.isVerified && (
        <>
          <CenteredText>
            "Nie zweryfikowano e-mail, nie wszystkie funkcje będą działać."
          </CenteredText>
          <Button>
            {" "}
            <MdEmail />
            <p>Wyślij jeszcze raz email</p>
          </Button>
          <hr />
        </>
      )}
      {me.groups.includes("admin") && (
        <>
          <Button onClick={() => showPopup(<Admin />)} className="w-full">
            <MdAdminPanelSettings />
            <p>Admin panel</p>
          </Button>
          <hr />
        </>
      )}

      <Button className="w-full ">
        <FaCog />
        <p>Ustawienia</p>
      </Button>
      <hr />
      <Button
        onClick={() => {
          showPopup(null);
          closePopup();
          logout();
        }}
      >
        <FaDoorOpen />
        <p>Wyloguj się</p>
      </Button>
    </Container>
  );
};
