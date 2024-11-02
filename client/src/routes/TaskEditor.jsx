import { Container } from "../components/Container";
import Editor from "@monaco-editor/react";
import { createPortal } from "react-dom";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Login } from "./Login";
import { PopupContext } from "../contexts/PopupContext";
import { useNavigate, useParams } from "react-router";
import { RxCross1, RxCross2, RxPlus } from "react-icons/rx";
import { Button } from "../components/Button";
import { FaArrowsAlt, FaLock, FaTrophy, FaUnlock } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { createSwapy } from "swapy";
import { twMerge } from "tw-merge";
import { data } from "autoprefixer";
import { Header } from "../components/Header";
import Frame from "react-frame-component";
import { emmetHTML } from "emmet-monaco-es";
import { TaskContext, TaskContextProvider } from "../contexts/TaskContext";
export const Dummy = () => {
  return (
    <>
      <div className="flex flex-row gap-2 p-0 flex-1">
        <Container className="max-w-[100%]">Pliki</Container>
        <Container className="flex-1 max-w-[100%] h-[100%]">
          <p>index.html</p>
        </Container>
      </div>
      <div className="flex flex-col flex-1 gap-2 p-2">
        <Container className="flex-1 max-w-[100%] overflow-scroll"></Container>
        <Container className="flex-1 p-0 max-w-[100%]"></Container>
      </div>
    </>
  );
};

const Tab = ({ children, onClick, currentIndex, index }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        `bg-white cursor-pointer text-sm border-[1px] border-b-0  border-neutral-400 p-1 flex gap-2 items-center rounded-t-lg ${
          currentIndex != index && "translate-y-[0.3rem] bg-neutral-100"
        }`
      )}
    >
      {children}
    </button>
  );
};
{
  /*
        {children}
      <Tab>
        <p>index.html</p>
        <RxCross1 size={16} />
      </Tab>
      <Tab>
        <RxPlus size={16} />
      </Tab>*/
}
const getFileMetadata = async (id) => {
  const req = await fetch(
    import.meta.env.VITE_API_URI + `uploads/${id}/metadata`,
    {
      credentials: "include",
      method: "GET",
    }
  );
  const data = await req.json();
  return data;
};
export const TabsContainer = ({
  setIndex,
  windowName,
  index,
  children,
  files,
}) => {
  const [metadata, setMetadata] = useState([]);
  useEffect(() => {
    if (!files) {
      return;
    }
    const fetch = async () => {
      setMetadata(
        await Promise.all(
          files.map(async (file) => await getFileMetadata(file))
        )
      );
    };
    fetch();
  }, []);
  return (
    <div className="rounded-t-lg flex  bg-neutral-200  flex-row p-1 border-b-[1px] overflow-x-scroll border-neutral-400 gap-1 ">
      {metadata &&
        metadata.map((child, i) => (
          <Tab
            key={i}
            index={i}
            currentIndex={index}
            onClick={() => setIndex(i)}
          >
            {child.filename}
          </Tab>
        ))}
      <div className="text-right justify-end flex-1 items-end flex ">
        <div className="bg-white flex-row gap-3 flex items-center text-black p-[0.25rem] rounded-lg font-bold">
          <p>&lt; {windowName} &gt;</p>
        </div>
      </div>
    </div>
  );
};
const WindowContainer = ({ className, children, dataSwapyItem }) => {
  return (
    <div
      data-swapy-item={dataSwapyItem}
      className={twMerge(`h-full flex-1 flex flex-col ${className || ""}`)}
    >
      {children}
    </div>
  );
};
/*
          <WindowContainer>
              <TabsContainer windowName="edytor" />
              <Container className="flex-1 max-w-[100%] p-0 ">
                <Editor
                  theme="vs-light"
                  className="absolute h-full"
                  width="100%"
                  height="100%"
                  defaultLanguage="html"
                  automaticLayout={true}
                  defaultValue="<body>Test</body>"
                />
              </Container>
            </WindowContainer>
          </div>
          <div className=" flex flex-col flex-1 gap-2">
            <WindowContainer>
              <TabsContainer windowName="zadanie" />
              <Container className="flex-1 max-w-[100%] p-0 overflow-scroll  flex-1">
                <iframe
                  src={`/task-documents/${name}.pdf`}
                  className="w-full h-full flex-1 rounded-xl overflow-scroll"
                />
              </Container>
            </WindowContainer>
            <WindowContainer>
              <TabsContainer windowName="wynik" />
              <Container className="flex-1 p-0 max-w-[100%] flex">
                <iframe
                  className="w-full h-full flex-1 rounded-xl overflow-scroll flex-1"
                  src={
                    import.meta.env.VITE_API_URI +
                    `preview-solution/?id=solution_id_here&filename=index.html`
                  }
                ></iframe>
              </Container>
            </WindowContainer>
            */
/*
  <Editor
        theme="vs-light"
        width="100%"
        height="100%"
        defaultLanguage="html"
        automaticLayout={true}
        defaultValue="<body>Test</body>"
      />*/

const EditorWindow = ({ dataSwapyItem }) => {
  return (
    <>
      <WindowContainer dataSwapyItem={dataSwapyItem}>
        <TabsContainer windowName="edytor" />
        <Container className="flex-1 items-stretch flex flex-col max-w-[100%] p-0 overflow-scroll  flex-1">
          <div id="monaco-portal"></div>

          <Editor
            beforeMount={(monaco) => {
              emmetHTML(monaco);
            }}
            defaultLanguage="html"
            value="<p>Hello!</p>"
            options={{
              automaticLayout: true,
            }}
            className=" flex-1 h-full w-full flex items-stretch justify-stretch"
          />
        </Container>
      </WindowContainer>
    </>
  );
};

const TaskWindow = ({ dataSwapyItem }) => {
  const { task } = useContext(TaskContext);
  const { name, files } = task;
  const [index, setIndex] = useState(0);
  return (
    <WindowContainer dataSwapyItem={dataSwapyItem}>
      <TabsContainer
        index={index}
        setIndex={setIndex}
        windowName={"zadanie"}
        files={files}
      />
      <Container className="flex-1 max-w-[100%] p-0 overflow-scroll  flex-1">
        <iframe
          src={`${import.meta.env.VITE_API_URI}uploads/${
            task.files[index]
          }/download`}
          className="w-full h-full flex-1 rounded-xl overflow-scroll"
        />
      </Container>
    </WindowContainer>
  );
};
const SolutionWindow = ({ dataSwapyItem }) => {
  return (
    <WindowContainer dataSwapyItem={dataSwapyItem}>
      <TabsContainer windowName="wynik" />
      <Container className="flex-1 p-0 max-w-[100%] flex">
        <iframe
          className="w-full h-full flex-1 rounded-xl overflow-scroll flex-1"
          src={
            import.meta.env.VITE_API_URI +
            `preview-solution/?id=solution_id_here&filename=index.html`
          }
        ></iframe>
      </Container>
    </WindowContainer>
  );
};

const WINDOWS = {
  a: <EditorWindow dataSwapyItem="a" />,
  b: <TaskWindow dataSwapyItem="b" />,
  c: <SolutionWindow dataSwapyItem="c" />,
};
const DEFAULT = {
  a: "a",
  b: "b",
  c: "c",
};
var slotWindows = localStorage.getItem("slotItem")
  ? JSON.parse(localStorage.getItem("slotItem"))
  : DEFAULT;
function getItemById(itemId) {
  if (itemId == "a") {
    return <EditorWindow dataSwapyItem="a" />;
  }
  if (itemId == "b") {
    return <TaskWindow dataSwapyItem="b" />;
  }
  if (itemId == "c") {
    return <SolutionWindow dataSwapyItem="c" />;
  }
}
const SwapySlot = ({ id, className }) => {
  return (
    <div data-swapy-slot={id} className={twMerge(`${className || ""}`)}>
      {getItemById(slotWindows[id])}
    </div>
  );
};

export const TaskEditor = () => {
  const { me, isWaiting } = useContext(AuthContext);
  const { showPopup, closePopup } = useContext(PopupContext);
  const [showContent, setShowContent] = useState(false);

  const [canEditLayout, setCanEditLayout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (canEditLayout) {
      const container = document.querySelector(".swapy");
      const swapy = createSwapy(container, {
        swapMode: "hover",
      });
      swapy.onSwap(({ data }) => {
        localStorage.setItem("slotItem", JSON.stringify(data.object));
      });
      swapy.onSwapEnd(({ data, hasChanged }) => {
        console.log(hasChanged);
        console.log("end", data);
        /*editor.layout({ width: 0, height: 0 });
        window.requestAnimationFrame(() => {
          // get the parent dimensions and re-layout the editor
          const rect = parent.getBoundingClientRect();
          editor.layout({ width: rect.width, height: rect.height });
        });*/
      });

      swapy.onSwapStart(() => {
        console.log("start");
      });
      return () => swapy.destroy();
    }
    return () => {};
  }, [canEditLayout]);

  const close = () => {
    closePopup();
    navigate("/");
  };
  useEffect(() => {
    if (!isWaiting) {
      if (me) {
        setShowContent(true);
      } else {
        setShowContent(false);
        showPopup(<Login />, close);
      }
    }
  }, [isWaiting, me]);
  const [isDomReady, setDomReady] = useState(false);
  useEffect(() => {
    setDomReady(true);
  }, []);

  const { task } = useContext(TaskContext);
  return (
    <div
      className={twMerge(
        `flex-1 gap-2 flex-col flex w-full h-full transition-all duration-300 scale-0 ${
          isDomReady && "scale-1"
        }`
      )}
    >
      <Header>
        <p>"{task?.name}"</p>
        <div className="flex-1"></div>
        <Button>
          <FaTrophy />
          <p>Tabela wyników zadania</p>
        </Button>
        <Button
          onClick={() => setCanEditLayout(!canEditLayout)}
          className={"p-1"}
        >
          {canEditLayout ? <FaUnlock /> : <FaLock />}
          <p>Layout</p>
        </Button>
      </Header>
      {
        <div className="flex swapy flex-col sm:flex-row w-full gap-2 flex-1 flex-wrap">
          <div className="flex-wrap flex flex-row gap-2 p-0 flex-1 overflow-hidden">
            <SwapySlot className="flex-1" id={"a"} />
            <div className="flex flex-col flex-1 gap-2">
              <SwapySlot className="flex-1" id={"b"} />
              <SwapySlot className="flex-1" id={"c"} />
            </div>
          </div>
        </div>
      }
    </div>
  );
};
