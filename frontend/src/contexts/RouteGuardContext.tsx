import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

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
    () => sessionStorage.getItem("canView") === "true"
  );

  useEffect(() => {
    sessionStorage.setItem("canView", canView.toString());
  }, [canView]);

  const setCanView = (value: SetStateAction<boolean>) => {
    setCanViewState(value);
    sessionStorage.setItem("canView", value.toString());
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
