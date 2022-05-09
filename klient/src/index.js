import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PrihlasenyContextProvider } from "./context/prihlaseny-context";

ReactDOM.render(
  <React.StrictMode>
    <PrihlasenyContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrihlasenyContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
