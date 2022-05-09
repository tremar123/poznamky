import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PrihlasenyContext from "../../context/prihlaseny-context";

function PrivateRoute() {
  const prihlasenyCtx = useContext(PrihlasenyContext);

  return prihlasenyCtx.jePrihlaseny ? <Outlet /> : <Navigate to="/prihlasenie" />;
}

export default PrivateRoute;
