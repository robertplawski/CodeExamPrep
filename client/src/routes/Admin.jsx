import { CenteredTitleText } from "../components/CenteredTitleText.jsx";
import { Container } from "../components/Container.jsx";
import { Button } from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { MdEmail, MdKeyboardReturn } from "react-icons/md";
import { FaBackward, FaQuestion, FaUser } from "react-icons/fa";
import { useContext } from "react";
import {
  PopupContext,
  PopupContextProvider,
} from "../contexts/PopupContext.jsx";
import { Index } from "./Index.jsx";
import { Invite } from "./Invite.jsx";
export const Admin = () => {
  const { showPopup, closePopup } = useContext(PopupContext);
  return (
    <Container>
      <CenteredTitleText>Panel administracyjny</CenteredTitleText>
      <hr />

      <Button onClick={() => showPopup(<Invite />)} className="w-full">
        <MdEmail />
        <p>Zaproszenia</p>
      </Button>

      {/*<Button className="w-full">
        <FaUser />
        <p>Użytkownicy</p>
      </Button>

      <Button className="w-full">
        <FaQuestion />
        <p>Zadania</p>
      </Button>*/}
      <hr />
      <Button className="w-full" onClick={() => showPopup(<Index />)}>
        <MdKeyboardReturn />
        <p>Powrót do menu</p>
      </Button>
    </Container>
  );
};
