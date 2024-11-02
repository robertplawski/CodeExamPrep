import { createContext, useContext, useEffect, useState } from "react";
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { PopupContext } from "./PopupContext";
import { Login } from "../routes/Login";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext({
  task: null,
  isLoading: null,
  error: null,
});

const fetchTask = async (name) => {
  const req = await fetch(import.meta.env.VITE_API_URI + `content/findTask`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  });
  if (!req.ok) {
    const data = await req.json();
    if (data) {
      return data;
    } else {
      return { message: req.status + " - " + req.statusText, success: false };
    }
  }
  const data = await req.json();

  return data;
};

export const TaskContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showPopup, closePopup } = useContext(PopupContext);
  const { me, isLoggedIn, isWaiting } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();
  useEffect(() => {
    if (isWaiting) {
      return;
    }
    if (!isLoggedIn) {
      showPopup(<Login />, () => {
        closePopup();
        navigate("/");
      });
    } else {
      fetchTask(name).then((data) => {
        if (data.success) {
          setTask(data.task);
        } else {
          setError(data);
        }
        setTimeout(() => setLoading(false), 200);
      });
    }
  }, [isLoggedIn, isWaiting]);
  return (
    <TaskContext.Provider value={{ task, isLoading, error }}>
      {isLoading || isWaiting ? (
        <div className="flex-1 justify-center items-center flex flex-col gap-2 ">
          <FaSpinner size={24} className="animate-spin" />
          <p>Ładowanie zadania...</p>
        </div>
      ) : error ? (
        <div className="flex-1 justify-center items-center flex flex-col gap-2 ">
          <FaExclamationCircle size={24} />
          <p>{error.message}</p>
          <Link to="/">
            <Button>Powrót do lobby</Button>
          </Link>
        </div>
      ) : (
        children
      )}
    </TaskContext.Provider>
  );
};
