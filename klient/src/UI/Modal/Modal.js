import Button from "../Button/Button";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";

function Modal(props) {
  return ReactDOM.createPortal(
    <div onClick={props.onclick} className={styles.pozadie}>
      <div className={styles.modal}>
        <h1>{props.nazov}</h1>
        <p>{props.sprava}</p>
        <Button onClick={props.onclick} typ="primarne">
          {props.button}
        </Button>
      </div>
    </div>,
    document.getElementById("modal")
  );
}

export default Modal;
