import { Plus, X } from "react-bootstrap-icons";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import style from "./ZoznamPolozky.module.css";

function ZoznamPolozky(props) {
  return (
    <li data-id={props.id} className={style.li}>
      {props.pridat ? (
        <button
          type="button"
          onClick={props.onclick}
          title="Pridať"
          className={style.pridat}
        >
          <Plus height="100%" width="100%" />
        </button>
      ) : (
        <>
          <Input
            onChange={props.changeOznacene}
            type="checkbox"
            checked={props.checked}
          />
          <Input
            onChange={props.changeText}
            className={style.input}
            typ="cisty"
            value={props.value}
          />
          <Button onClick={props.zmazatPolozka} typ="zmazat_menu">
            <X height="50" width="50" />
          </Button>
        </>
      )}
    </li>
  );
}

export default ZoznamPolozky;
