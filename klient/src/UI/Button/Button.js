import style from "./Button.module.css";

function Button({ children, className, typ, ...rest }) {
  return (
    <button
      className={`${style.button} ${className}  ${
        typ === "zmazat_menu"
          ? style.zmazat_menu
          : typ === "primarne"
          ? style.primarne
          : typ === "sekundarne"
          ? style.sekundarne
          : typ === "zmazat"
          ? style.zmazat
          : typ === "prihlasenie"
          ? style.prihlasenie
          : null
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
