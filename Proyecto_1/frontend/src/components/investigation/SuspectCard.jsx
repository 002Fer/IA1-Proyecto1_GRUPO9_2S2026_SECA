import React, { useState } from "react";
import styles from "./SuspectCard.module.css";

const suspicionColor = (lvl) => lvl >= 70 ? "#f44336" : lvl >= 40 ? "#ff9800" : "#4caf50";

export default function SuspectCard({ suspect, onInterrogate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.avatar} style={{ background: `hsl(${suspect.id.charCodeAt(suspect.id.length-1)*30},60%,40%)` }}>
          {suspect.name.charAt(0)}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{suspect.name}</h3>
          <span className={styles.role}>{suspect.role} · {suspect.age} años</span>
        </div>
        <div
          className={styles.suspLevel}
          style={{ color: suspicionColor(suspect.suspicionLevel) }}
        >
          {suspect.suspicionLevel}%
        </div>
      </div>

      <div className={styles.bar}>
        <div
          className={styles.barFill}
          style={{ width: `${suspect.suspicionLevel}%`, background: suspicionColor(suspect.suspicionLevel) }}
        />
      </div>

      <div className={styles.badges}>
        <span className={`${styles.badge} ${suspect.alibiValid ? styles.valid : styles.invalid}`}>
          {suspect.alibiValid ? "✓ Coartada Válida" : "✗ Coartada Inválida"}
        </span>
        {suspect.motive && <span className={styles.badge}>💡 Motivo</span>}
        {suspect.means && <span className={styles.badge}>🔧 Medios</span>}
      </div>

      <p className={styles.desc}>{suspect.description}</p>

      <div className={styles.actions}>
        <button className={styles.btnInterrogate} onClick={() => { setExpanded(!expanded); onInterrogate(suspect); }}>
          {expanded ? "Cerrar" : "🗣 Interrogar"}
        </button>
      </div>

      {expanded && (
        <div className={styles.testimony}>
          <strong>Declaraciones:</strong>
          <ul>
            {suspect.statements.map((s, i) => <li key={i}>"{s}"</li>)}
          </ul>
          <div className={styles.detail}>
            <span><strong>Coartada:</strong> {suspect.alibi}</span>
            <span><strong>Motivo:</strong> {suspect.motive}</span>
          </div>
        </div>
      )}
    </div>
  );
}
