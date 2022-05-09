import { useCallback, useContext, useEffect, useState } from "react";
import PrihlasenyContext from "../../context/prihlaseny-context";
import UlohyMenu from "../../UI/UlohyMenu/UlohyMenu";
import Layout from "../Layout/Layout";
import style from "../../UI/Ostatne/Menu.module.css";
import PridatButton from "../../UI/PridatButton/PridatButton";
import Modal from "../../UI/Modal/Modal";

function Ulohy() {
  const prihlasenyCtx = useContext(PrihlasenyContext);
  let [ulohy, setUlohy] = useState([]);
  let [novaUloha, setNovaUloha] = useState(false);
  const [chyba, setChyba] = useState();

  useEffect(() => {
    fetch("/api/ulohy", {
      method: "GET",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
      },
    }).then((odpoved) => {
      if (odpoved.ok) {
        odpoved.json().then((data) => {
          setUlohy(data);
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
  }, [prihlasenyCtx.token]);

  function zmazat(event) {
    const element = event.currentTarget;
    const id = +element.dataset.id;

    fetch(`/api/uloha/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
      },
    }).then((odpoved) => {
      if (odpoved.ok) {
        element.parentElement.style.animationPlayState = "running";
        element.parentElement.addEventListener("animationend", () => {
          setUlohy((prevState) => {
            const update = prevState.filter((uloha) => uloha.id !== id);
            return update;
          });
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

  const updateUlohy = useCallback((objekt) => {
    setUlohy((prevState) => {
      return prevState.map((uloha) =>
        uloha.id === objekt.id ? { ...objekt } : uloha
      );
    });
  }, []);

  function pridatUloha() {
    setNovaUloha(true);
  }

  function nepridatUloha() {
    setNovaUloha(false);
  }

  function updatePoPridani(uloha) {
    setUlohy((prevState) => {
      return [...prevState, uloha];
    });
  }

  function chybaButton() {
    setChyba(null);
  }

  return (
    <Layout stranka="ulohy">
      {chyba && (
        <Modal
          nazov={chyba.nazov}
          sprava={chyba.sprava}
          button={chyba.button}
          onclick={chybaButton}
        />
      )}
      <ul className={style.ul}>
        {ulohy.length === 0 && !novaUloha ? (
          <p className={style.nic}>Nič sa nenašlo</p>
        ) : (
          ulohy.map((uloha) => {
            return (
              <UlohyMenu
                key={uloha.id}
                text={uloha.text}
                dokoncene={uloha.dokoncene}
                data_id={uloha.id}
                zmazat={zmazat}
                updateUlohy={updateUlohy}
                upravuje={false}
              />
            );
          })
        )}
        {novaUloha && (
          <UlohyMenu
            upravuje={true}
            zmazat={nepridatUloha}
            updatePoPridani={updatePoPridani}
          />
        )}
      </ul>
      <PridatButton onClick={pridatUloha} />
    </Layout>
  );
}

export default Ulohy;
