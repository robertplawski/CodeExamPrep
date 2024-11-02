import {
  MdAppRegistration,
  MdEmail,
  MdMailLock,
  MdPassword,
} from "react-icons/md";
import {
  FaCheck,
  FaCode,
  FaEye,
  FaEyeSlash,
  FaHashtag,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { SmallBrandingFooter } from "../components/SmallBrandingFooter.jsx";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useCookies } from "react-cookie";
import { Container } from "../components/Container.jsx";
import { Main } from "../components/Main.jsx";
import { CenteredTitleText } from "../components/CenteredTitleText.jsx";
import { CenteredErrorText } from "../components/CenteredErrorText.jsx";
import { InputLabel } from "../components/InputLabel.jsx";
import { InputRow } from "../components/InputRow.jsx";
import { Input } from "../components/Input.jsx";
import { RxCheck, RxCross1 } from "react-icons/rx";
import { Button } from "../components/Button.jsx";
import { PopupContext } from "../contexts/PopupContext.jsx";
import { Login } from "./Login.jsx";
export const fetchIsValidInviteToken = async (token) => {
  const req = await fetch(
    import.meta.env.VITE_API_URI + "auth/isInviteTokenValid",
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );
  const data = await req.json();

  return data;
};
export const Register = () => {
  const { login } = useContext(AuthContext);
  const { closePopup, showPopup } = useContext(PopupContext);
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inviteToken = formData.get("inviteToken");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    event.preventDefault();
    const response = await fetch(
      import.meta.env.VITE_API_URI + "auth/registerWithInviteToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          inviteToken,
          name,
          email,
          password,
        }),
      }
    );

    const json = await response.json();
    if (!json.success) {
      setError(json.message);
      return;
    }

    setError(null);
    login();
    closePopup();
  };
  const [error, setError] = useState("");
  const [isPasswordShown, setShowPassword] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const [isInviteTokenValid, setInviteTokenValid] = useState(false);
  useEffect(() => {
    fetchIsValidInviteToken(inviteToken).then((result) =>
      setInviteTokenValid(result.success)
    );
  }, [inviteToken]);
  return (
    <Container>
      <CenteredTitleText>Rejestracja</CenteredTitleText>
      <p className="text-center">Wpisz swoje dane, aby zarejestrować się</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <InputRow>
          <InputLabel
            icon={<FaHashtag size={24} />}
            text={"Kod dostępu"}
          ></InputLabel>
          <Input
            onChange={(event) => setInviteToken(event.target.value)}
            type="text"
            name="inviteToken"
          />
          <div className="absolute right-2" type="button">
            {isInviteTokenValid ? <RxCheck /> : <RxCross1 />}
          </div>
        </InputRow>
        <InputRow>
          <InputLabel icon={<FaUser size={24} />} text={"Imię"}></InputLabel>
          <Input type="text" name="name" />
        </InputRow>
        <InputRow>
          <InputLabel icon={<MdEmail size={24} />} text={"Email"}></InputLabel>
          <Input type="email" name="email" />
        </InputRow>
        <InputRow>
          <InputLabel
            icon={<MdPassword size={24} />}
            text={"Hasło"}
          ></InputLabel>
          <Input name="password" type={isPasswordShown ? "text" : "password"} />
          <button
            className="absolute right-2"
            type="button"
            onClick={() => setShowPassword(!isPasswordShown)}
          >
            {isPasswordShown ? <FaEye /> : <FaEyeSlash />}
          </button>
        </InputRow>
        <Button className="p-[0.25rem]" type="submit">
          Zarejestruj się
        </Button>

        {error && <CenteredErrorText>{error}</CenteredErrorText>}
        <hr />

        <button
          onClick={() => showPopup(<Login />)}
          className="flex-row gap-2 items-center flex justify-center"
        >
          <FaUserPlus size={20} />
          <p>Mam już konto</p>
        </button>
      </form>
      <SmallBrandingFooter />
    </Container>
  );
};
