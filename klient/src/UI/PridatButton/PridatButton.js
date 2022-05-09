import style from "./PridatButton.module.css";
import { Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

function PridatButton(props) {
  const navigate = useNavigate();

  function pridat() {
    if (props.stranka) {
      navigate("/" + props.stranka);
    } else {
      props.onClick();
    }
  }

  return (
    <button title="Pridať" className={style.button} onClick={pridat}>
      <Plus width="80" height="80" />
    </button>
  );
}

export default PridatButton;
