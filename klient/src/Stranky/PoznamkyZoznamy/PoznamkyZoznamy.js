import Layout from "../Layout/Layout";
import PrihlasenyContext from "../../context/prihlaseny-context";
import { useContext, useEffect, useState } from "react";
import PoznamkaZoznamMenu from "../../UI/PoznamkaZoznamMenu/PoznamkaZoznamMenu";
import style from "../../UI/Ostatne/Menu.module.css";
import PridatButton from "../../UI/PridatButton/PridatButton";
import Modal from "../../UI/Modal/Modal";

function PoznamkyZoznamy(props) {
  const prihlasenyCtx = useContext(PrihlasenyContext);
  const [poznamkyZoznamy, setPoznamkyZoznamy] = useState([]);
  const [chyba, setChyba] = useState();

  useEffect(() => {
    fetch(`/api/${props.stranka}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${prihlasenyCtx.token}`,
      },
    }).then((odpoved) => {
      if (odpoved.ok) {
        odpoved.json().then((data) => setPoznamkyZoznamy(data));
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
  }, [props.stranka, prihlasenyCtx.token]);

  function zmazat(event) {
    const element = event.currentTarget;
    const id = +element.dataset.id;
    fetch(
      `/api/${
        props.stranka === "poznamky" ? "poznamka" : "zoznam"
      }/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${prihlasenyCtx.token}`,
        },
      }
    ).then((odpoved) => {
      if (odpoved.ok) {
        element.parentElement.style.animationPlayState = "running";
        element.parentElement.addEventListener("animationend", () => {
          setPoznamkyZoznamy((prevState) => {
            return prevState.filter((polozkaZoznam) => polozkaZoznam.id !== id);
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

  function chybaButton() {
    setChyba(null);
  }

  return (
    <Layout stranka={props.stranka}>
      {chyba && (
        <Modal
          nazov={chyba.nazov}
          sprava={chyba.sprava}
          button={chyba.button}
          onclick={chybaButton}
        />
      )}
      {poznamkyZoznamy.length === 0 ? (
        <p className={style.nic}>Nič sa nenašlo</p>
      ) : (
        <ul className={style.ul}>
          {poznamkyZoznamy.map((poznamkaZoznam) => {
            return (
              <PoznamkaZoznamMenu
                zmazat={zmazat}
                key={poznamkaZoznam.id}
                nazov={poznamkaZoznam.nazov}
                data_id={poznamkaZoznam.id}
                stranka={props.stranka}
              />
            );
          })}
        </ul>
      )}
      <PridatButton
        stranka={props.stranka === "poznamky" ? "poznamka" : "zoznam"}
      />
    </Layout>
  );
}

export default PoznamkyZoznamy;
