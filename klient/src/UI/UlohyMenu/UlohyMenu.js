import style from "./UlohyMenu.module.css";
import Button from "../Button/Button";
import { PencilFill, X } from "react-bootstrap-icons";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PrihlasenyContext from "../../context/prihlaseny-context";
import Input from "../../UI/Input/Input";
import Modal from "../../UI/Modal/Modal";

function UlohyMenu(props) {
  const prihlasenyCtx = useContext(PrihlasenyContext);
  const [upravuje, setUpravuje] = useState(props.upravuje);
  const textRef = useRef();
  const [dokoncene, setDokoncene] = useState(props.dokoncene);
  const jePrvyRender = useRef(true);
  const id = props.data_id;
  const updateUlohy = props.updateUlohy;
  const [chyba, setChyba] = useState();

  function upravit() {
    setUpravuje(true);
  }

  function neupravuje() {
    setUpravuje(false);
  }

  useEffect(() => {
    if (upravuje) {
      textRef.current.disabled = false;
      textRef.current.focus();
    } else {
      textRef.current.disabled = true;
    }
  }, [upravuje]);

  const ulozit = useCallback(() => {
    fetch(`/api/uloha/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        text: textRef.current.value,
        dokoncene: dokoncene,
      }),
    }).then((odpoved) => {
      if (odpoved.ok) {
        neupravuje();
        odpoved.json().then((uloha) => updateUlohy(uloha));
      } else {
        if (odpoved.status === 401) {
          setChyba({
            nazov: `Chyba ${odpoved.status}`,
            sprava: "Neautorizovaná operácia.",
            button: "OK",
          });
        } else {
          setChyba({
            nazov: `Chyba ${odpoved.status}`,
            sprava: "Niečo sa pokazilo.",
            button: "OK",
          });
        }
      }
    });
  }, [dokoncene, textRef, prihlasenyCtx, id, updateUlohy]);

  function dokonceneZmena() {
    setDokoncene(!dokoncene);
  }

  useEffect(() => {
    if (jePrvyRender.current) {
      jePrvyRender.current = false;
      return;
    }
    ulozit();
  }, [dokoncene, ulozit]);

  function vytvorit() {
    fetch("/api/ulohy", {
      method: "POST",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        text: textRef.current.value,
      }),
    }).then((odpoved) => {
      if (odpoved.ok) {
        props.zmazat();
        odpoved.json().then((uloha) => {
          props.updatePoPridani(uloha);
        });
      } else {
        if (odpoved.status === 401) {
          setChyba({
            nazov: `Chyba ${odpoved.status}`,
            sprava: "Neautorizovaná operácia.",
            button: "OK",
          });
        } else {
          setChyba({
            nazov: `Chyba ${odpoved.status}`,
            sprava: "Niečo sa pokazilo.",
            button: "OK",
          });
        }
      }
    });
  }

  function chybaButton() {
    setChyba(null);
  }

  return (
    <li className={style.li}>
      {chyba && (
        <Modal
          nazov={chyba.nazov}
          sprava={chyba.sprava}
          button={chyba.button}
          onclick={chybaButton}
        />
      )}
      {!props.upravuje && (
        <input checked={dokoncene} type="checkbox" onChange={dokonceneZmena} />
      )}
      <Input
        disabled
        className={`${upravuje && style.input_active} ${style.input}`}
        defaultValue={props.text}
        ref={textRef}
      />
      {upravuje ? (
        <Button
          onClick={props.upravuje ? vytvorit : ulozit}
          className={style.button}
          typ="primarne"
        >
          Uložiť
        </Button>
      ) : (
        <Button data-id={props.data_id} onClick={upravit} typ="zmazat_menu">
          <PencilFill height="30" width="30" />
        </Button>
      )}

      <Button
        data-id={props.data_id}
        onClick={props.zmazat}
        typ="zmazat_menu"
        title="Zmazať"
      >
        <X height="50" width="50" />
      </Button>
    </li>
  );
}

export default UlohyMenu;
