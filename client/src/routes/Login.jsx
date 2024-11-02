import {
  MdAppRegistration,
  MdEmail,
  MdMailLock,
  MdPassword,
} from "react-icons/md";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useCookies } from "react-cookie";
import { Container } from "../components/Container.jsx";
import { Main } from "../components/Main.jsx";
import { CenteredTitleText } from "../components/CenteredTitleText.jsx";
import { CenteredErrorText } from "../components/CenteredErrorText.jsx";
import { InputLabel } from "../components/InputLabel.jsx";
import { InputRow } from "../components/InputRow.jsx";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";
import { SmallBrandingFooter } from "../components/SmallBrandingFooter.jsx";
import { PopupContext } from "../contexts/PopupContext.jsx";
import { Register } from "./Register.jsx";
export const Login = () => {
  const { closePopup, showPopup } = useContext(PopupContext);
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    event.preventDefault();
    const response = await fetch(import.meta.env.VITE_API_URI + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const json = await response.json();
    if (!json.success) {
      setError(json.message);
      return;
    }

    setError(null);
    closePopup();
    login();
  };
  const [isPasswordShown, setShowPassword] = useState(false);
  return (
    <Container>
      <CenteredTitleText>Login</CenteredTitleText>

      <p className="text-center">
        Wpisz swoje dane, by zalogować się do portalu
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
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
          {" "}
          Zaloguj się
        </Button>

        {error && <CenteredErrorText>{error}</CenteredErrorText>}
        <hr />
        <div className="flex-row gap-2 items-center flex justify-center">
          <MdMailLock size={20} />
          <Link to="/forgot-password">Zapomniałem hasła!</Link>
        </div>
        <button
          onClick={() => showPopup(<Register />)}
          className="flex-row gap-2 items-center flex justify-center"
        >
          <FaUserPlus size={20} />
          <p>Nie mam jeszcze konta</p>
        </button>
      </form>
      <SmallBrandingFooter />
    </Container>
  );
};
