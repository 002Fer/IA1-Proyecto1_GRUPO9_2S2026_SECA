import React from "react";
import styles from "./ContradictionAlert.module.css";

export default function ContradictionAlert({ contradictions }) {
  if (!contradictions || contradictions.length === 0) {
    return <p className={styles.empty}>No se detectaron contradicciones aún.</p>;
  }
  return (
    <div className={styles.list}>
      {contradictions.map((c) => (
        <div key={c.id} className={styles.alert}>
          <div className={styles.alertHeader}>
            <span className={styles.icon}>⚠</span>
            <span className={styles.label}>Contradicción Detectada</span>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <span className={styles.colLabel}>Declaración</span>
              <p>"{c.statement}"</p>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.col}>
              <span className={styles.colLabel}>Evidencia</span>
              <p>{c.evidence}</p>
            </div>
          </div>
          <div className={styles.suspect}>Sospechoso involucrado: <strong>{c.suspect}</strong></div>
        </div>
      ))}
    </div>
  );
}
