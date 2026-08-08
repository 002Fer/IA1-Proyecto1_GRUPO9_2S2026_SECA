import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.icon}>🔍</span>
        <span className={styles.title}>Logic Detective</span>
      </div>
      <ul className={styles.links}>
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/cases" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Casos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Admin
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
