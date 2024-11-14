import { CenteredTitleText } from "../components/CenteredTitleText";
import { Container } from "../components/Container";
import { InputRow } from "../components/InputRow";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaClock, FaSpinner, FaTasks, FaTrophy } from "react-icons/fa";
import { DoomsdayClock } from "../components/DoomsdayClock";
import { AuthContext } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Leaderboard } from "./Leaderboard";
import { PopupContext } from "../contexts/PopupContext";
export const TaskRow = ({ name, title, language, yourScore, averageScore }) => {
  const { me, isWaiting } = useContext(AuthContext);
  console.log(yourScore);
  return (
    <tr>
      <td>
        <Link to={`/task/${name}`}>{name}</Link>
      </td>
      <td>{title}</td>
      <td>{language}</td>
      {!isWaiting &&
        me &&
        (yourScore >= 0 ? <td>{yourScore}%</td> : <td>Nie wykonano</td>)}
      <td>{averageScore}%</td>
    </tr>
  );
};
export const fetchTasks = async () => {
  const req = await fetch(import.meta.env.VITE_API_URI + "content/tasks", {
    credentials: "include",
  });

  const data = await req.json();
  console.log(data);
  return data;
};
export const TasksBody = () => {
  const [isLoading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data.tasks);
      setLoading(false);
    });
  }, []);
  return (
    <tbody>
      {isLoading ? (
        <tr>
          <td colSpan={5}>
            <FaSpinner className="animate-spin" />
          </td>
        </tr>
      ) : (
        tasks.map((task, key) => <TaskRow {...task} key={key} />)
      )}
    </tbody>
  );
};

export const Tasks = () => {
  const { showPopup } = useContext(PopupContext);
  const { me, isWaiting } = useContext(AuthContext);
  return (
    <div className="gap-2 flex flex-col">
      <Header />
      <Container className="max-w-[48rem] gap-2 w-full ">
        <CenteredTitleText>Zadania egzaminacyjne</CenteredTitleText>
        <DoomsdayClock />
        <hr />
        <div className="flex flex-row gap-2 justify-stretch">
          {!isWaiting && me && me.groups.includes("admin") && (
            <Button className="flex-1">
              <FaTasks />
              <p>Add task</p>
            </Button>
          )}

          <Button className="flex-1" onClick={() => showPopup(<Leaderboard />)}>
            <FaTrophy />
            <p>Globalna tabela wyników</p>
          </Button>
        </div>
        <hr />
        <div className="overflow-x-scroll flex ">
          <table className="  flex-1 table-auto  whitespace-nowrap">
            <thead className="font-bold">
              <tr>
                <th>Nazwa</th>
                <th>Tytuł</th>
                <th>Język</th>
                {!isWaiting && me && <th>Twój wynik</th>}
                <th>Średnia</th>
              </tr>
            </thead>
            <TasksBody />
          </table>
        </div>
      </Container>
    </div>
  );
};
