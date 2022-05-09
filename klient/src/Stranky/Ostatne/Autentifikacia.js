import Navbar from "../../UI/Navbar/Navbar";
import style from "./Autentifikacia.module.css";
import { Link } from "react-router-dom";

function Autentifikacia(props) {
  return (
    <>
      <Navbar />
      <main className={style.main}>
        <div className={style.div}>
          <Link className={`${style.link} ${props.stranka === "prihlasenie" ? style.link_selected : null}`} to="/prihlasenie">Prihlásenie</Link>
          <Link className={`${style.link} ${props.stranka === "registracia" ? style.link_selected : null}`} to="/registracia">Registrácia</Link>
          {props.children}
        </div>
      </main>
    </>
  );
}

export default Autentifikacia;
