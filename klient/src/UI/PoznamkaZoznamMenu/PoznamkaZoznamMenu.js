import style from "./PoznamkaZoznamMenu.module.css";
import { X } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Button from "../Button/Button";

function PoznamkaZoznamMenu(props) {
  return (
    <li className={style.li}>
      <Link
        className={style.link}
        to={{
          pathname:
            props.stranka === "poznamky"
              ? `/poznamka/${props.data_id}`
              : `/zoznam/${props.data_id}`,
        }}
      >
        <h3>{props.nazov}</h3>
      </Link>
      <Button data-id={props.data_id} onClick={props.zmazat} typ="zmazat_menu" title="Zmazať">
      <X height="50" width="50" />
      </Button>
    </li>
  );
}

export default PoznamkaZoznamMenu;
