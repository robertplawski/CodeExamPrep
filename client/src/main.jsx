import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/inter";
import { Index } from "./routes/Index.jsx";
import { Login } from "./routes/Login.jsx";
import { Register } from "./routes/Register.jsx";
import { Admin } from "./routes/Admin.jsx";
import { Tasks } from "./routes/Tasks.jsx";
import { TaskEditor } from "./routes/TaskEditor.jsx";
import {
  RouterProvider,
  Routes,
  Route,
  createBrowserRouter,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { AuthContext, AuthContextProvider } from "./contexts/AuthContext.jsx";
import { FaSpinner } from "react-icons/fa";
import { Header } from "./components/Header.jsx";
import { Main } from "./components/Main.jsx";
import {
  PopupContext,
  PopupContextProvider,
} from "./contexts/PopupContext.jsx";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { TaskContextProvider } from "./contexts/TaskContext.jsx";
const router = createBrowserRouter([
  {
    element: <AuthContextProvider />,
    children: [
      {
        element: <PopupContextProvider />,
        children: [
          {
            element: (
              <Main>
                <Outlet />
              </Main>
            ),
            children: [
              {
                path: "/",
                element: <Outlet />,
                children: [
                  {
                    path: "/",
                    element: <Outlet />,

                    children: [
                      {
                        path: "/",
                        element: <Tasks />,
                      },
                      {
                        path: "/task/:name",
                        element: (
                          <TaskContextProvider>
                            <TaskEditor />
                          </TaskContextProvider>
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      /*
      {
        path: "/admin",
        element: (
          <AdminOnly redirectTo="/">
            <Admin />
          </AdminOnly>
        ),
      },
      {
        path: "/login_dep",
        element: (
          <RequireAuth redirectTo="/" reverse={true}>
            <Main className="justify-center">
              <Login />
            </Main>
          </RequireAuth>
        ),
      },
      {
        path: "/register_dep",
        element: (
          <RequireAuth redirectTo="/" reverse={true}>
            <Main className="justify-center">
              <Register />
            </Main>
          </RequireAuth>
        ),
      },*/
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
function AdminOnly({ children, reverse, redirectTo }) {
  const { me, isWaiting } = useContext(AuthContext);

  return isWaiting ? (
    <FaSpinner size={24} className="animate-spin" />
  ) : me.groups.includes("admin") ? (
    children
  ) : (
    <Navigate to={redirectTo} replace />
  );
}
function RequireAuth({ children, redirectTo, reverse = false }) {
  const { isLoggedIn, isWaiting } = useContext(AuthContext);
  const { showPopup } = useContext(PopupContext);

  return isWaiting ? (
    <FaSpinner size={24} className="animate-spin" />
  ) : (reverse ? !isLoggedIn : isLoggedIn) ? (
    children
  ) : (
    <Navigate to={redirectTo} replace />
  );
}
