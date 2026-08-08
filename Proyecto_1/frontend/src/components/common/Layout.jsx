import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
