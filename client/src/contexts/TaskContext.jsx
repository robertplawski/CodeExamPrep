import { createContext, useContext, useEffect, useState } from "react";
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { PopupContext } from "./PopupContext";
import { Login } from "../routes/Login";
import { AuthContext } from "./AuthContext";
import Markdown from "react-markdown";

export const TaskContext = createContext({
  task: null,
  isLoading: null,
  error: null,
  solution: null,
  refetchSolution: () => {},
  createNewSolutionFile: null,
});
const fetchSolution = async (taskId) => {
  const req = await fetch(import.meta.env.VITE_API_URI + `solutions`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId: taskId }),
  });
  if (!req.ok) {
    const data = await req.json();
    if (data) {
      return { status: req.status, ...data };
    } else {
      return { message: req.status + " - " + req.statusText, success: false };
    }
  }
  const data = await req.json();

  return data;
};

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
      return { status: req.status, ...data };
    } else {
      return {
        message: req.status + " - " + req.statusText,
        success: false,
      };
    }
  }
  const data = await req.json();

  return data;
};
const createSolution = async (taskId) => {
  return fetch(import.meta.env.VITE_API_URI + `solutions/create`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId: taskId }),
  });
};
export const TaskContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showPopup, closePopup } = useContext(PopupContext);
  const { me, isLoggedIn, isWaiting } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState(null);
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
          fetchSolution(data.task._id).then((sol) => {
            if (sol.success) {
              setSolution(sol.solution);
            } else {
              setError(sol);
              if (sol.status == 404) {
                // ONLY FOR NOW
                createSolution(data.task._id).then(() => navigate(0));
              }
            }
          });
        } else {
          setError(data);
        }
        setTimeout(() => setLoading(false), 200);
      });
    }
  }, [isLoggedIn, isWaiting]);

  const createNewSolutionFile = async (filename = "index.html") => {
    console.log(filename);
    console.log(task.allowedSolutionFilenames);
    if (!task.allowedSolutionFilenames.includes(filename)) {
      return { success: false, message: "Niepoprawna nazwa!" };
    }
    const req = await fetch(
      import.meta.env.VITE_API_URI + "solutions/createNewFile",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId: task._id, filename }),
      }
    );
    const data = await req.json();
    return { success: true, message: "Yippe" };
  };
  const refetchSolution = () => {
    return fetchSolution(task._id).then((sol) => {
      if (sol.success) {
        setSolution(sol.solution);
      }
    });
  };
  return (
    <TaskContext.Provider
      value={{
        task,
        solution,
        createNewSolutionFile,
        isLoading,
        refetchSolution,
        error,
      }}
    >
      {isLoading || isWaiting || !task || !solution ? (
        <div className="flex-1 justify-center items-center flex flex-col gap-2 ">
          <FaSpinner size={24} className="animate-spin" />
          <p>Ładowanie zadania...</p>
        </div>
      ) : error ? (
        <div className="flex-1 justify-center items-center flex flex-col gap-2 ">
          <FaExclamationCircle size={24} />

          {!solution && task && error.status == 404 ? (
            <>
              <FaSpinner size={24} className="animate-spin" />
              <p className="text-center max-w-xs">
                Tworzenie nowego rozwiązania...
              </p>
              {/*Chcesz zacząć rozwiązywanie zadania? <br />
                {` Data rozpoczęcia: ${new Date().toLocaleString("pl-PL")}`}
                <br />
                <br />
                Narazie czas nie będzie liczony, ale w przyszłości mam zamiar
                zrobić zadania czasowe.
                <br />
                Postaraj się rozwiązać egzamin w jednym siedzeniu - w taki
                sposób czas policzony będzie najbardziej dokładny - potraktuj to
                jak egzamin.   <Button onClick={() => createSolutionAndRefresh()}>
                Rozwiąż zadanie
              </Button>*/}
            </>
          ) : (
            <Markdown>{error.message}</Markdown>
          )}
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
