import React, { useState } from "react";
import styles from "./SuspectCard.module.css";

const suspicionColor = (lvl) => lvl >= 70 ? "#f44336" : lvl >= 40 ? "#ff9800" : "#4caf50";

export default function SuspectCard({ suspect, onInterrogate, onAnalyze }) {
  const [interrogated, setInterrogated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleInterrogateClick = () => {
    setInterrogated(true);
    setExpanded(!expanded);
    if (onInterrogate) {
      onInterrogate(suspect);
    }
  };

  const handleAnalyzeClick = () => {
    // Si no ha sido interrogado aún, registramos el interrogatorio automáticamente
    if (!interrogated) {
      setInterrogated(true);
      setExpanded(true);
      if (onInterrogate) onInterrogate(suspect);
    }
    setRevealed(true);
    if (onAnalyze) {
      onAnalyze(suspect);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.avatar} style={{ background: `hsl(${suspect.id.charCodeAt(suspect.id.length-1)*30},60%,40%)` }}>
          {suspect.name.charAt(0)}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{suspect.name}</h3>
          <span className={styles.role}>{suspect.role} · {suspect.age ? `${suspect.age} años` : "Edad N/D"}</span>
        </div>
        <div
          className={styles.suspLevel}
          style={{ color: revealed ? suspicionColor(suspect.suspicionLevel) : "var(--text-muted)" }}
        >
          {revealed ? `${suspect.suspicionLevel}%` : "?%"}
        </div>
      </div>

      <div className={styles.bar}>
        <div
          className={styles.barFill}
          style={{
            width: revealed ? `${suspect.suspicionLevel}%` : "0%",
            background: revealed ? suspicionColor(suspect.suspicionLevel) : "transparent"
          }}
        />
      </div>

      <div className={styles.badges}>
        {revealed ? (
          <>
            <span className={`${styles.badge} ${suspect.alibiValid ? styles.valid : styles.invalid}`}>
              {suspect.alibiValid ? "Coartada Válida" : "Coartada Desmentida"}
            </span>
            {suspect.motive && <span className={styles.badge}>Móvil: {suspect.motive}</span>}
            {suspect.means && <span className={styles.badge}>Medios: {suspect.means}</span>}
          </>
        ) : (
          <span className={styles.badge} style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
            {interrogated ? "Declaración obtenida · Pendiente de análisis" : "Sin interrogar"}
          </span>
        )}
      </div>

      <p className={styles.desc}>{suspect.description || "Persona de interés vinculada al caso."}</p>

      <div className={styles.actions}>
        <button className={styles.btnInterrogate} onClick={handleInterrogateClick}>
          {expanded ? "Ocultar Declaración" : "Interrogar"}
        </button>

        {!revealed ? (
          <button className={styles.btnAnalyze} onClick={handleAnalyzeClick}>
            Analizar Sospecha en Prolog
          </button>
        ) : (
          <button className={styles.btnAnalyzed} disabled>
            Inferencia Completada
          </button>
        )}
      </div>

      {expanded && (
        <div className={styles.testimony}>
          <strong>Declaraciones del sospechoso:</strong>
          <ul>
            {suspect.statements && suspect.statements.length > 0 ? (
              suspect.statements.map((s, i) => <li key={i}>"{s}"</li>)
            ) : (
              <li>"{suspect.alibi || "Afirma no haber estado en la escena del crimen."}"</li>
            )}
          </ul>
          <div className={styles.detail}>
            <span><strong>Coartada alegada:</strong> {suspect.alibi || "Sin coartada registrada."}</span>
            {revealed && (
              <span>
                <strong>Dictamen de Coartada por Prolog:</strong>{" "}
                <strong style={{ color: suspect.alibiValid ? "#4caf50" : "#f44336" }}>
                  {suspect.alibiValid ? "Válida (Sin contradicciones halladas)" : "Desmentida por contradicción / evidencia"}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
