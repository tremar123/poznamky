import style from "./Layout.module.css";
import {
  List,
  X,
  JustifyLeft,
  ListCheck,
  JournalText,
  BoxArrowLeft,
} from "react-bootstrap-icons";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../UI/Navbar/Navbar";
import PrihlasenyContext from "../../context/prihlaseny-context";

function Layout(props) {
  const [sidebarState, setSidebarState] = useState(false);

  const prihlasenyCtx = useContext(PrihlasenyContext);

  function sidebar() {
    sidebarState ? setSidebarState(false) : setSidebarState(true);
  }

  return (
    <>
      <Navbar className={style.nav}>
        <button className={style.menu} onClick={sidebar}>
          {sidebarState ? (
            <X width="50" height="50" />
          ) : (
            <List width="50" height="50" />
          )}
        </button>

        <p className={`${style.p}`}>
          Prihlásený ako:
          <br />
          <b>{prihlasenyCtx.meno}</b>
        </p>
      </Navbar>
      <nav
        className={`${style.sidenav} ${
          sidebarState ? style.sidenav_open : null
        }`}
      >
        <Link
          className={`${sidebarState ? style.link_open : style.link} ${
            props.stranka === "poznamky" ? style.selected_link : null
          }`}
          to="/poznamky"
        >
          <JustifyLeft width="40" height="40" />
          <h6>Poznamky</h6>
        </Link>
        <Link
          className={`${sidebarState ? style.link_open : style.link} ${
            props.stranka === "ulohy" ? style.selected_link : null
          }`}
          to="/ulohy"
        >
          <ListCheck width="40" height="40" />
          <h6>Ulohy</h6>
        </Link>
        <Link
          className={`${sidebarState ? style.link_open : style.link} ${
            props.stranka === "zoznamy" ? style.selected_link : null
          }`}
          to="/zoznamy"
        >
          <JournalText width="40" height="40" />
          <h6>Zoznamy</h6>
        </Link>

        {/* <p className={`${style.p} ${sidebarState ? style.link_open : style.link}`}>
          Prihlásený ako:
          <br />
          <b>{prihlasenyCtx.meno}</b>
        </p> */}

        <button
          title="Odhlásiť sa"
          onClick={prihlasenyCtx.odhlasit}
          className={`${sidebarState ? style.link_open : style.link} ${
            sidebarState ? style.button_open : null
          } ${style.button}`}
        >
          <BoxArrowLeft width="40" height="40" />
          <h6>Odhlásiť sa</h6>
        </button>
      </nav>
      <main
        onClick={sidebarState ? sidebar : null}
        className={`${style.main} ${sidebarState ? style.main_open : null} ${style.main}`}
      >
        {props.children}
      </main>
    </>
  );
}

export default Layout;
