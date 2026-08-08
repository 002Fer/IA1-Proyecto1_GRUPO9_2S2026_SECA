import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import styles from "./CaseSelection.module.css";

const difficultyColor = { Facil: "#4caf50", Medio: "#ff9800", Dificil: "#f44336" };

export default function CaseSelection() {
  const { cases, selectCase } = useGame();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todos");

  const filtered = filter === "Todos" ? cases : cases.filter((c) => c.difficulty === filter);

  const handleStart = (c) => {
    selectCase(c);
    navigate(`/investigation/${c.id}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Seleccionar Caso</h1>
        <p className={styles.sub}>Elige un caso de investigación y asume el rol de detective.</p>
      </div>

      <div className={styles.filters}>
        {["Todos", "Facil", "Medio", "Dificil"].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((c, i) => (
          <div key={c.id} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.cardTop}>
              <div className={styles.caseNumber}>Caso #{i + 1}</div>
              <span
                className={styles.diffBadge}
                style={{ background: difficultyColor[c.difficulty] + "22", color: difficultyColor[c.difficulty] }}
              >
                {c.difficulty}
              </span>
            </div>
            <h2 className={styles.title}>{c.title}</h2>
            <p className={styles.desc}>{c.description}</p>
            <div className={styles.stats}>
              <div className={styles.stat}><span>🕵️</span><strong>{c.suspects.length}</strong><small>Sospechosos</small></div>
              <div className={styles.stat}><span>🔎</span><strong>{c.evidence.length}</strong><small>Evidencias</small></div>
              <div className={styles.stat}><span>📍</span><strong>{c.places.length}</strong><small>Lugares</small></div>
            </div>
            <button className={styles.startBtn} onClick={() => handleStart(c)}>
              Iniciar Investigación →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
