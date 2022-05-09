import { forwardRef } from "react";
import style from "./Input.module.css";

const Input = forwardRef(({ typ, className, ...rest }, ref) => {
  return <input className={`${className} ${style.input}  ${typ === "cisty" ? style.cisty : null}`} {...rest} ref={ref} />;
});

export default Input;
