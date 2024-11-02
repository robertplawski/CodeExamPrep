import { CenteredTitleText } from "../components/CenteredTitleText.jsx";
import { Container } from "../components/Container.jsx";
import { Button } from "../components/Button.jsx";
import { Link } from "react-router-dom";
import {
  MdDateRange,
  MdDelete,
  MdEmail,
  MdKeyboardReturn,
  MdMarkEmailRead,
} from "react-icons/md";
import { FaX } from "react-icons/fa6";
import {
  FaBackward,
  FaCheck,
  FaExclamationCircle,
  FaEye,
  FaQuestion,
  FaSpinner,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import {
  PopupContext,
  PopupContextProvider,
} from "../contexts/PopupContext.jsx";
import { Index } from "./Index.jsx";
import { Admin } from "./Admin.jsx";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Input } from "../components/Input.jsx";
import { InputRow } from "../components/InputRow.jsx";
// /removeInvite
export const removeInvite = async (token) => {
  const req = await fetch(import.meta.env.VITE_API_URI + "auth/removeInvite", {
    body: JSON.stringify({ token: token }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
  const data = await req.json();
  return data;
};

export const createInviteToken = async (token, date) => {
  const req = await fetch(
    import.meta.env.VITE_API_URI + "auth/createInviteToken",
    {
      body: JSON.stringify({ token: token, expiresAt: date }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }
  );
  const data = await req.json();
  return data;
};

export const fetchInviteToken = async () => {
  const req = await fetch(import.meta.env.VITE_API_URI + "auth/getInvites", {
    credentials: "include",
  });
  const data = await req.json();

  return data;
};

const TokenBody = ({ forceUpdate, setForceUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  const fetchTokens = () => {
    fetchInviteToken().then((value) => {
      setInvites(value.invites);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchTokens();
  }, [forceUpdate]);
  return (
    <>
      {!loading ? (
        invites.map((value, index) => (
          <TokenRow
            setForceUpdate={setForceUpdate}
            key={index}
            invite={value}
          />
        ))
      ) : (
        <table>
          <tr>
            <td colSpan={6}>
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                <p>Loading...</p>
              </div>
            </td>
          </tr>
        </table>
      )}
    </>
  );
};
const TokenRow = ({ invite, setForceUpdate }) => {
  return (
    <tr>
      <td>{invite.token}</td>

      <td className="text-center">{invite.usedBy ? <FaCheck /> : <FaX />}</td>

      <td className="max-w-16 ">
        <div className="overflow-x-scroll  pb-2">
          {invite.usedBy?.email || ""}
        </div>
      </td>
      <td>{invite.expiresAt.toLocaleString("pl-PL").slice(0, 10)}</td>
      <td className="text-center">
        {!invite.usedBy && (
          <button
            onClick={() => {
              removeInvite(invite.token).then(() => setForceUpdate());
            }}
          >
            <FaTrash />
          </button>
        )}
      </td>
    </tr>
  );
};
export const ReadInvites = ({ forceUpdate, setForceUpdate }) => {
  const { showPopup, closePopup } = useContext(PopupContext);

  return (
    <table className=" w-full">
      <thead>
        <th>Token</th>
        <th>Zużyty</th>
        <th>Użytkownik</th>
        <th>Wygasa dnia</th>
        <th>Akcja</th>
      </thead>
      <tbody>
        <TokenBody setForceUpdate={setForceUpdate} forceUpdate={forceUpdate} />
      </tbody>
    </table>
  );
};
export const Invite = () => {
  const [error, setError] = useState([]);
  const { showPopup, closePopup } = useContext(PopupContext);
  let nowDate = new Date();
  nowDate.setMonth(nowDate.getMonth() + 1);

  const defaultExpiryDate = new Date(nowDate);
  const [date, setDate] = useState(
    defaultExpiryDate.toISOString().slice(0, 10)
  );
  const invitesDisplayRef = useRef(null);
  const [token, setToken] = useState("");
  const [forceUpdate, setForceUpdate] = useReducer((x) => x + 1, 0);
  const addInvite = () => {
    createInviteToken(token, date).then((data) => {
      if (!data.success) {
        setError(data);
      } else {
        setError({});
      }
      setForceUpdate();
    });
  };
  return (
    <Container className={"max-h-[38rem] w-full min-w-[0rem] max-w-[64rem]"}>
      <CenteredTitleText>Zaproszenia</CenteredTitleText>
      <hr />
      <div className="overflow-scroll pb-3">
        {
          <ReadInvites
            setForceUpdate={setForceUpdate}
            forceUpdate={forceUpdate}
          />
        }
      </div>

      <hr />
      <InputRow>
        <label className="flex-row gap-2 items-center flex pr-2">
          <MdEmail /> Nowy kod dostępu:
        </label>
        <Input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={"ABCDEF"}
        />

        <Button
          onClick={() =>
            setToken(
              Number(Math.random()).toString(36).slice(2, 8).toUpperCase()
            )
          }
        >
          Losowy
        </Button>
      </InputRow>
      <InputRow>
        <label className="flex-row gap-2 items-center flex pr-2">
          <MdDateRange /> Data wygaśnięcia:
        </label>
        <Input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
        />
        <Button onClick={() => setDate("10000-10-10")}>Nigdy</Button>
      </InputRow>
      {error.message && (
        <div className="flex-row flex items-center justify-center gap-2 ">
          <FaExclamationCircle />
          <p>{error.message}</p>
        </div>
      )}
      <Button onClick={() => addInvite()}>Dodaj</Button>

      <hr />
      <Button className="w-full" onClick={() => showPopup(<Admin />)}>
        <MdKeyboardReturn />
        <p>Powrót do menu</p>
      </Button>
    </Container>
  );
};
