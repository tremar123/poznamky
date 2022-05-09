import React, { useState } from "react";

const PrihlasenyContext = React.createContext({
  meno: "",
  token: "",
  jePrihlaseny: false,
  prihlasit: (token) => {},
  odhlasit: () => {},
});

export function PrihlasenyContextProvider(props) {
  const nacitanyToken = localStorage.getItem("token");
  const nacitaneMeno = localStorage.getItem("meno");
  const [token, setToken] = useState(nacitanyToken);
  const [meno, setMeno] = useState(nacitaneMeno);

  const jePrihlaseny = !!token;

  function prihlasenie(token, meno) {
    setToken(token);
    setMeno(meno);
    localStorage.setItem("token", token);
    localStorage.setItem("meno", meno);
  }

  function odhlasenie() {
    setToken("");
    localStorage.clear();
  }

  const context = {
    meno: meno,
    token: token,
    jePrihlaseny: jePrihlaseny,
    prihlasit: prihlasenie,
    odhlasit: odhlasenie,
  };

  return (
    <PrihlasenyContext.Provider value={context}>
      {props.children}
    </PrihlasenyContext.Provider>
  );
}

export default PrihlasenyContext;
