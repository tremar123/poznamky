import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PrihlasenyContext from "../../context/prihlaseny-context";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Layout from "../Layout/Layout";
import style from "./Poznamka.module.css";
import Modal from "../../UI/Modal/Modal";

function Poznamka() {
  const navigate = useNavigate();
  const prihlasenyCtx = useContext(PrihlasenyContext);
  const { id } = useParams();

  const nazov = useRef();
  const poznamka = useRef();
  const [chyba, setChyba] = useState();

  useEffect(() => {
    if (id) {
      // zobaraziť a upraviť
      fetch(`/api/poznamka/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
        },
      }).then((odpoved) => {
        if (odpoved.ok) {
          odpoved.json().then((odpoved) => {
            nazov.current.value = odpoved.nazov;
            poznamka.current.value = odpoved.poznamka;
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
  }, [id, prihlasenyCtx.token]);

  function zrusit() {
    navigate("/poznamky");
  }

  function zmazat() {
    fetch(`/api/poznamka/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
      },
    }).then((odpoved) => {
      if (odpoved.ok) {
        navigate("/poznamky");
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

  function ulozit(event) {
    event.preventDefault();
    if (id) {
      fetch(`/api/poznamka/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nazov: nazov.current.value,
          poznamka: poznamka.current.value,
        }),
      }).then((odpoved) => {
        if (odpoved.ok) {
          navigate("/poznamky");
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
    } else {
      fetch("/api/poznamky", {
        method: "POST",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nazov: nazov.current.value,
          poznamka: poznamka.current.value,
        }),
      }).then((odpoved) => {
        if (odpoved.ok) {
          navigate("/poznamky");
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
  }

  function chybaButton() {
    setChyba(null);
  }

  return (
    <Layout stranka="poznamky">
      {chyba && (
        <Modal
          nazov={chyba.nazov}
          sprava={chyba.sprava}
          button={chyba.button}
          onclick={chybaButton}
        />
      )}
      <form className={style.form} onSubmit={ulozit}>
        <Input
          className={style.nazov}
          typ="cisty"
          placeholder="Názov"
          autoFocus
          ref={nazov}
        />
        <textarea
          className={style.textarea}
          placeholder="Text..."
          ref={poznamka}
        ></textarea>
        <div className={style.tlacitka}>
          {id && (
            <Button
              typ="zmazat"
              className={style.zmazat}
              onClick={zmazat}
              type="button"
            >
              Zmazať
            </Button>
          )}
          <Button
            typ="sekundarne"
            className={style.zrusit}
            onClick={zrusit}
            type="button"
          >
            Zrušiť
          </Button>
          <Button typ="primarne" className={style.ulozit} type="submit">
            Uložiť
          </Button>
        </div>
      </form>
    </Layout>
  );
}

export default Poznamka;
