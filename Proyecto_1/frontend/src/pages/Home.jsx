import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import styles from "./Home.module.css";

const difficultyColor = { Facil: "#4caf50", Medio: "#ff9800", Dificil: "#f44336" };

export default function Home() {
  const { cases, selectCase } = useGame();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleStart = (c) => {
    selectCase(c);
    navigate(`/investigation/${c.id}`);
  };

  return (
    <div className={`${styles.page} ${visible ? styles.visible : ""}`}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Sistema Experto de IA</div>
          <h1 className={styles.heroTitle}>Logic Detective</h1>
          <p className={styles.heroSub}>
            Analiza casos de investigación usando lógica simbólica e inferencia basada
            en conocimiento. Descubre al culpable mediante razonamiento, no por instinto.
          </p>
          <div className={styles.heroActions}>
            <Link to="/cases" className={styles.btnPrimary}>Explorar Casos</Link>
            <Link to="/admin" className={styles.btnSecondary}>Panel Admin</Link>
          </div>
        </div>
        <div className={styles.heroArt}>
          <div className={styles.orb}></div>
          <div className={styles.magnify}>🔍</div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.steps}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div className={styles.stepsGrid}>
          {[
            { icon: "🕵️", title: "Investiga", desc: "Interroga sospechosos, examina evidencias y visita lugares." },
            { icon: "🧠", title: "Analiza", desc: "El motor Prolog infiere relaciones, contradicciones y motivos." },
            { icon: "⚖️", title: "Acusa", desc: "Emite tu acusación fundamentada con las reglas lógicas activadas." },
          ].map((s) => (
            <div key={s.title} className={styles.stepCard}>
              <span className={styles.stepIcon}>{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cases */}
      <section className={styles.casesSection}>
        <h2 className={styles.sectionTitle}>Casos Disponibles</h2>
        <div className={styles.casesGrid}>
          {cases.slice(0, 3).map((c) => (
            <div key={c.id} className={styles.caseCard}>
              <div className={styles.caseHeader}>
                <span
                  className={styles.diffBadge}
                  style={{ background: difficultyColor[c.difficulty] + "22", color: difficultyColor[c.difficulty] }}
                >
                  {c.difficulty}
                </span>
                <span className={styles.statusDot}></span>
              </div>
              <h3 className={styles.caseTitle}>{c.title}</h3>
              <p className={styles.caseDesc}>{c.description.slice(0, 120)}...</p>
              <div className={styles.caseMeta}>
                <span>🕵️ {c.suspects.length} sospechosos</span>
                <span>🔎 {c.evidence.length} evidencias</span>
              </div>
              <button className={styles.caseBtn} onClick={() => handleStart(c)}>
                Iniciar Investigación →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
