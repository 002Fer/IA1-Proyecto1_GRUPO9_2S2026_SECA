import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} Logic Detective — IA1 Proyecto 1 · Grupo 9</span>
    </footer>
  );
}
