import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Main } from "../components/Main.jsx";
export const fetchBackendHealth = async () => {
  const req = await fetch(import.meta.env.VITE_API_URI + "ping");
  const data = await req.json();
  return req.ok;
};
export const fetchLogout = async () => {
  const req = await fetch(import.meta.env.VITE_API_URI + "auth/logout", {
    credentials: "include",
    method: "POST",
  });
  const data = await req.json();

  return data;
};
export const fetchLoggedIn = async () => {
  const req = await fetch(import.meta.env.VITE_API_URI + "auth/me", {
    credentials: "include",
    method: "POST",
  });
  const data = await req.json();

  return data;
};

export const AuthContext = createContext({
  isLoggedIn: false,
  me: {},
  login: () => {},
  logout: () => {},
  isWaiting: true,
});

export const AuthContextProvider = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [me, setMe] = useState({});
  const [backendHealthy, setBackendHealthy] = useState(false);
  const updateHealth = () => {
    setBackendHealthy(false);
    fetchBackendHealth().then((result) => {
      setBackendHealthy(result);
    });
  };
  useEffect(() => {
    updateHealth();
    return () => {};
  }, [setBackendHealthy]);
  const updateState = () => {
    setLoggedIn(false);

    fetchLoggedIn().then((result) => {
      setMe(result.user);
      setLoggedIn(result.success || false);
      setIsWaiting(false);
    });
  };
  useEffect(() => {
    updateState();
    return () => {};
  }, [setLoggedIn]);
  const login = () => {
    updateState();
    //navigate("/");
  };
  const logout = () => {
    fetchLogout().then(() => {
      updateState();
      //navigate("/login");
    });
  };
  return (
    <AuthContext.Provider value={{ isWaiting, me, isLoggedIn, login, logout }}>
      {backendHealthy ? (
        <Outlet />
      ) : (
        <p className="flex items-center justify-center h-[100vh] text-center text-xl font-bold">
          Brak połączenia z backendem
          <br />
          Kontakt: dev@robertplawski.pl
        </p>
      )}
    </AuthContext.Provider>
  );
};
