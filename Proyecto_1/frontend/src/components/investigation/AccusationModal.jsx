import React, { useState } from "react";
import styles from "./AccusationModal.module.css";
import { accuse, registerAction } from "../../utils/api.js";

export default function AccusationModal({ caseData, onClose, onLog, onViewReport }) {
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAccuse = async () => {
    if (!selected) return;
    setLoading(true);
    const res = await accuse(caseData.id, selected);
    setResult(res);
    const accusedName = caseData.suspects.find(s=>s.id===selected)?.name || selected;
    onLog(`Acusación emitida contra: ${accusedName}`);
    registerAction(caseData.id, `Acusación emitida contra: ${accusedName}`);
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Emitir Acusación Final</h2>

        {!result ? (
          <>
            <p className={styles.sub}>Selecciona al sospechoso que crees que cometió el crimen.</p>
            <div className={styles.suspects}>
              {caseData.suspects.map((s) => (
                <label key={s.id} className={`${styles.option} ${selected === s.id ? styles.selected : ""}`}>
                  <input type="radio" value={s.id} checked={selected === s.id} onChange={() => setSelected(s.id)} />
                  <div className={styles.avatar}>{s.name.charAt(0)}</div>
                  <div>
                    <strong>{s.name}</strong>
                    <span>{s.role}</span>
                  </div>
                </label>
              ))}
            </div>
            <button
              className={styles.accuseBtn}
              onClick={handleAccuse}
              disabled={!selected || loading}
            >
              {loading ? "Analizando..." : "Confirmar Acusación"}
            </button>
          </>
        ) : (
          <div className={`${styles.result} ${result.correct ? styles.correct : styles.wrong}`}>
            <h3>{result.correct ? "¡Caso Resuelto!" : "Acusación Incorrecta"}</h3>
            <p>{result.message}</p>
            {!result.correct && <p className={styles.culprit}>El culpable era: <strong>{result.culpritName}</strong></p>}
            <div className={styles.rules}>
              <strong>Reglas lógicas activadas:</strong>
              <ul>{result.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <button 
                type="button"
                className={styles.accuseBtn} 
                style={{ background: "#3b82f6", color: "#fff", flex: 1 }}
                onClick={() => {
                  onClose();
                  if (onViewReport) onViewReport(result);
                }}
              >
                Ver Informe Pericial Completo
              </button>
              <button className={styles.closeBtn} onClick={onClose} style={{ flex: 1 }}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
