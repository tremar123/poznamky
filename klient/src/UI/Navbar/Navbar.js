import style from "./Navbar.module.css";

function Navbar(props) {
  return(
    <nav className={style.nav}>
      {props.children}
    </nav>
  );
}

export default Navbar;