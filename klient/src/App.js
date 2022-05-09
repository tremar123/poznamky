import Prihlasenie from "./Stranky/Ostatne/Prihlasenie";
import { Route, Routes, Navigate } from "react-router-dom";
import PoznamkyZoznamy from "./Stranky/PoznamkyZoznamy/PoznamkyZoznamy";
import Ulohy from "./Stranky/Ulohy/Ulohy";
import Poznamka from "./Stranky/PoznamkyZoznamy/Poznamka";
import Registracia from "./Stranky/Ostatne/Registracia";
import PrivateRoute from "./Stranky/Ostatne/PrivateRoute";
import Zoznam from "./Stranky/PoznamkyZoznamy/Zoznam";

function App() {
  return (
    <Routes>
      <Route element={<Prihlasenie />} path="/prihlasenie" />
      <Route element={<Registracia />} path="/registracia" />

      <Route element={<Navigate to="/poznamky" />} path="/" exact />

      <Route element={<PrivateRoute />} path="/poznamky">
        <Route
          element={<PoznamkyZoznamy stranka="poznamky" />}
          path="/poznamky"
        />
      </Route>

      <Route element={<PrivateRoute />} path="/ulohy">
        <Route element={<Ulohy />} path="/ulohy" />
      </Route>

      <Route element={<PrivateRoute />} path="/zoznamy">
        <Route
          element={<PoznamkyZoznamy stranka="zoznamy" />}
          path="/zoznamy"
        />
      </Route>

      <Route element={<PrivateRoute />} path="/poznamka/:id">
        <Route element={<Poznamka />} path="/poznamka/:id" />
      </Route>

      <Route element={<PrivateRoute />} path="/poznamka">
        <Route element={<Poznamka />} path="/poznamka" />
      </Route>

      <Route element={<PrivateRoute />} path="/zoznam/:id">
        <Route element={<Zoznam />} path="/zoznam/:id" />
      </Route>

      <Route element={<PrivateRoute />} path="/zoznam">
        <Route element={<Zoznam />} path="/zoznam" />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
