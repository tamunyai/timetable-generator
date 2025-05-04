import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadFromSession, saveToSession } from "../utils";
import { ROUTE_GUARD_KEY } from "../constants";

type RouteGuardContextType = {
  canView: boolean;
  setCanView: React.Dispatch<React.SetStateAction<boolean>>;
};

const RouteGuardContext = createContext<RouteGuardContextType | undefined>(
  undefined
);

export const RouteGuardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [canView, setCanViewState] = useState<boolean>(
    () => loadFromSession(ROUTE_GUARD_KEY) === "true"
  );

  useEffect(() => {
    saveToSession(ROUTE_GUARD_KEY, canView.toString())
  }, [canView]);

  const setCanView = (value: SetStateAction<boolean>) => {
    setCanViewState(value);
    saveToSession(ROUTE_GUARD_KEY, value.toString());
  };

  return (
    <RouteGuardContext.Provider value={{ canView, setCanView }}>
      {children}
    </RouteGuardContext.Provider>
  );
};

export const useRouteGuard = () => {
  const context = useContext(RouteGuardContext);
  if (!context) {
    throw new Error("useRouteGuard must be used within a RouteGuardProvider");
  }
  return context;
};
