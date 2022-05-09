import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrihlasenyContext from "../../context/prihlaseny-context";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Autentifikacia from "./Autentifikacia";
import Modal from "../../UI/Modal/Modal";
import style from "./Prihlasenie.module.css";

function Prihlasenie() {
  const menoInputRef = useRef();
  const hesloInputRef = useRef();

  const [nacitavanie, setNacitavanie] = useState(false);

  const prihlasenyCtx = useContext(PrihlasenyContext);

  const navigate = useNavigate();

  const [chyba, setChyba] = useState();

  function prihlasenie(event) {
    event.preventDefault();

    const meno = menoInputRef.current.value;
    const heslo = hesloInputRef.current.value;

    fetch("/api/prihlasenie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: meno,
        password: heslo,
      }),
    }).then((odpoved) => {
      setNacitavanie(true);
      if (odpoved.ok) {
        odpoved.json().then((odpoved) => {
          prihlasenyCtx.prihlasit(odpoved.token, odpoved.username);
          navigate("/poznamky");
        });
      } else {
        if (odpoved.status === 400) {
          setChyba({
            nazov: "Chyba",
            sprava: "Neplatné prihlasovacie údaje, skúste to znova.",
            button: "OK",
          });
        } else {
          setChyba({
            nazov: `Chyba ${odpoved.status}`,
            správa: "Niečo sa pokazilo.",
            button: "OK",
          });
        }
        setNacitavanie(false);
      }
    });
  }

  function chybaButton() {
    setChyba(null);
  }

  return (
    <Autentifikacia stranka="prihlasenie">
      {chyba && (
        <Modal
          nazov={chyba.nazov}
          sprava={chyba.sprava}
          button={chyba.button}
          onclick={chybaButton}
        />
      )}
      <form onSubmit={prihlasenie}>
        <Input
          className={style.input}
          name="meno"
          placeholder="Používatelské meno"
          ref={menoInputRef}
        />
        <Input
          className={style.input}
          name="heslo"
          placeholder="Heslo"
          type="password"
          ref={hesloInputRef}
        />
        {!nacitavanie && <Button typ="prihlasenie" type="submit">Prihlásiť sa</Button>}
        {nacitavanie && (
          <Button disabled typ="prihlasenie" type="submit">
            Načítava sa...
          </Button>
        )}
      </form>
    </Autentifikacia>
  );
}

export default Prihlasenie;
