import { JSX, ReactNode } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  hint: string;
  children: ReactNode; // Permite pasar cualquier contenido como hijo
}

function Tooltip({ hint, children }: TooltipProps): JSX.Element {
  return (
    <div className={styles.tooltip}>
      {children} {/* Contenido arbitrario */}
      <span className={styles.tooltiptext}>{hint}</span>
    </div>
  );
}

export default Tooltip;
