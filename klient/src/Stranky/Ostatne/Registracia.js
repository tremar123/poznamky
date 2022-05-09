import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import PrihlasenyContext from "../../context/prihlaseny-context";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Autentifikacia from "./Autentifikacia";
import Modal from "../../UI/Modal/Modal";
import style from "./Registracia.module.css";

function Registracia() {
  const menoInputRef = useRef();
  const hesloInputRef = useRef();
  const hesloZnovaInputRef = useRef();

  const [nacitavanie, setNacitavanie] = useState(false);

  const prihlasenyCtx = useContext(PrihlasenyContext);

  const navigate = useNavigate();

  const [chyba, setChyba] = useState();

  function registracia(event) {
    event.preventDefault();

    const meno = menoInputRef.current.value;
    const heslo = hesloInputRef.current.value;
    const hesloZnova = hesloZnovaInputRef.current.value;

    //overenie
    if (heslo.length < 6) {
      return setChyba({
        nazov: "Neplatné heslo",
        sprava: "Heslo musí obsahovať aspoň 6 znakov.",
        button: "Znova",
      });
    }

    if (heslo === hesloZnova) {
      fetch("/api/registracia", {
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
          if (odpoved.status === 409) {
            setChyba({
              nazov: "Používateľké meno je obsadené",
              sprava: "Vytvorte si iné používateľské meno.",
              button: "Znova",
            });
          } else {
            setChyba({
              nazov: `Chyba ${odpoved.status}`,
              sprava: "Niečo sa pokazilo.",
              button: "OK",
            });
          }
          setNacitavanie(false);
        }
      });
    } else {
      setChyba({
        nazov: "Neplatné heslo",
        sprava: "Heslá sa musia zhodovať.",
        button: "Znova",
      });
    }
  }

  function chybaButton() {
    setChyba(null);
  }

  return (
    <Autentifikacia stranka="registracia">
      {chyba && (
        <Modal
          nazov={chyba.nazov}
          sprava={chyba.sprava}
          button={chyba.button}
          onclick={chybaButton}
        />
      )}
      <form onSubmit={registracia}>
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
          minLength="6"
          ref={hesloInputRef}
        />
        <Input
          className={style.input}
          name="heslo-znova"
          placeholder="Heslo znova"
          type="password"
          minLength="6"
          ref={hesloZnovaInputRef}
        />
        {!nacitavanie && <Button typ="prihlasenie" type="submit">Zaregistrovať</Button>}
        {nacitavanie && (
          <Button disabled typ="prihlasenie" type="submit">
            Načítava sa...
          </Button>
        )}
      </form>
    </Autentifikacia>
  );
}

export default Registracia;
