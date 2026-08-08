import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.icon}>🔍</span>
      <h1>404 - Página No Encontrada</h1>
      <p>La pista que buscas no existe o fue eliminada del expediente.</p>
      <Link to="/" className={styles.btn}>Volver al Inicio</Link>
    </div>
  );
}
