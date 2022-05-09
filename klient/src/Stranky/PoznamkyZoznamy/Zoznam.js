import { useNavigate, useParams } from "react-router-dom";
import PrihlasenyContext from "../../context/prihlaseny-context";
import { useContext, useEffect, useRef, useState } from "react";
import Layout from "../Layout/Layout";
import style from "./Zoznam.module.css";
import Input from "../../UI/Input/Input";
import ZoznamPolozky from "./ZoznamPolozky";
import Button from "../../UI/Button/Button";
import Modal from "../../UI/Modal/Modal";

function Zoznam(props) {
  const navigate = useNavigate();
  const prihlasenyCtx = useContext(PrihlasenyContext);
  const { id } = useParams();

  const [chyba, setChyba] = useState();

  const nazov = useRef();
  const [polozky, setPolozky] = useState([]);

  let cislo = 0;

  useEffect(() => {
    if (id === undefined) {
      return;
    } else {
      fetch(`/api/zoznam/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
        },
      }).then((odpoved) => {
        if (odpoved.ok) {
          odpoved.json().then((odpoved) => {
            nazov.current.value = odpoved.nazov;
            try {
              const polozkyPole = odpoved.polozky.map((polozka) => {
                cislo++;
                return { key: cislo, ...polozka };
              });
              setPolozky(polozkyPole);
            } catch (TypeError) {}
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
  }, [id, prihlasenyCtx.token, cislo]);

  function zmazat() {
    fetch(`/api/zoznam/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
      },
    }).then((odpoved) => {
      if (odpoved.ok) {
        navigate("/zoznamy");
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
    const updatePolozky = polozky;
    updatePolozky.forEach((polozka) => {
      delete polozka.key;
    });

    if (id === undefined) {
      fetch(`/api/zoznamy`, {
        method: "POST",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nazov: nazov.current.value,
          polozky: polozky,
        }),
      }).then((odpoved) => {
        if (odpoved.ok) {
          navigate("/zoznamy");
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
      fetch(`/api/zoznam/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nazov: nazov.current.value,
          polozky: updatePolozky,
        }),
      }).then((odpoved) => {
        if (odpoved.ok) {
          navigate("/zoznamy");
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

  function zrusit() {
    navigate("/zoznamy");
  }

  function changeText(event) {
    const text = event.currentTarget.value;
    const polozkaId = +event.currentTarget.parentElement.dataset.id;
    setPolozky((prevState) => {
      let index = prevState.findIndex((polozka) => polozka.key === polozkaId);
      prevState[index].text = text;
      return [...prevState];
    });
  }

  function changeOznacene(event) {
    const polozkaId = +event.currentTarget.parentElement.dataset.id;
    const oznacene = event.currentTarget.checked;
    setPolozky((prevState) => {
      let index = prevState.findIndex((polozka) => polozka.key === polozkaId);
      prevState[index].oznacene = oznacene;
      return [...prevState];
    });
  }

  function zmazatPolozka(event) {
    event.preventDefault();
    let polozkaId = +event.currentTarget.parentElement.dataset.id;
    event.currentTarget.parentElement.style.animationPlayState = "running";
    event.currentTarget.parentElement.addEventListener("animationend", () => {
      setPolozky((prevState) => {
        return prevState.filter((polozka) => polozka.key !== polozkaId);
      });
    });
  }

  function pridat() {
    setPolozky((prevState) => {
      try {
        const polozkaCislo = polozky[polozky.length - 1].key + 1;
        return [...prevState, { key: polozkaCislo, text: "", oznacene: false }];
      } catch (TypeError) {
        return [{ key: 1, text: "", oznacene: false }];
      }
    });
  }

  function chybaButton() {
    setChyba(null);
  }

  return (
    <Layout stranka="zoznamy">
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
          ref={nazov}
        />
        <ul className={style.ul}>
          {polozky.map((polozka) => {
            return (
              <ZoznamPolozky
                key={polozka.key}
                value={polozka.text}
                checked={polozka.oznacene}
                id={polozka.key}
                zmazatPolozka={zmazatPolozka}
                changeText={changeText}
                changeOznacene={changeOznacene}
              />
            );
          })}
          <ZoznamPolozky onclick={pridat} pridat={true} />
        </ul>
        <div className={style.tlacitka}>
          {id && (
            <Button onClick={zmazat} typ="zmazat" type="button">
              Zmazať
            </Button>
          )}
          <Button
            onClick={zrusit}
            className={style.zrusit}
            type="button"
            typ="sekundarne"
          >
            Zrušiť
          </Button>
          <Button type="submit" typ="primarne">
            Uložiť
          </Button>
        </div>
      </form>
    </Layout>
  );
}

export default Zoznam;
