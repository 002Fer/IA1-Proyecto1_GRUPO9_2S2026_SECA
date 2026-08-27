import React from "react";
import styles from "./SuspectCard.module.css";

const suspicionColor = (lvl) => lvl >= 70 ? "#f44336" : lvl >= 40 ? "#ff9800" : "#4caf50";

export function getSuspectCurrentScore(suspect, askedQuestions, fullyAnalyzed) {
  if (fullyAnalyzed) return suspect.suspicionLevel ?? 0;
  if (!askedQuestions || Object.keys(askedQuestions).length === 0) return null;

  let score = 0;
  const isCulprit = (suspect.suspicionLevel ?? 0) >= 70;

  if (askedQuestions["alibi"]) {
    if (!suspect.alibiValid) {
      score += isCulprit ? 30 : 15;
    } else {
      score += 5;
    }
  }

  if (askedQuestions["motive"]) {
    if (suspect.motive && suspect.motive !== "ninguno" && suspect.motive !== "ninguno_identificado") {
      score += isCulprit ? 25 : 15;
    }
  }

  if (askedQuestions["means"]) {
    if (suspect.means && suspect.means !== "ninguno" && suspect.means !== "ninguno_identificado") {
      score += isCulprit ? 25 : 10;
    }
  }

  if (askedQuestions["confront"]) {
    if (!suspect.alibiValid || isCulprit) {
      score += 20;
    }
  }

  return Math.min(score, suspect.suspicionLevel ?? 0);
}

export default function SuspectCard({ suspect, progress = {}, onUpdateProgress, onInterrogate, onAnalyze }) {
  const askedQuestions = progress.askedQuestions || {};
  const fullyAnalyzed = !!progress.fullyAnalyzed;
  const expanded = !!progress.expanded;

  const currentScore = getSuspectCurrentScore(suspect, askedQuestions, fullyAnalyzed);
  const isRevealed = currentScore !== null;
  const currentSuspicion = isRevealed ? currentScore : 0;
  const questionsCount = Object.keys(askedQuestions).length;

  const handleToggleExpand = () => {
    if (onUpdateProgress) {
      onUpdateProgress(suspect.id, {
        ...progress,
        expanded: !expanded
      });
    }
  };

  const handleAskQuestion = (key, questionLabel) => {
    if (askedQuestions[key]) return;

    const updatedQuestions = { ...askedQuestions, [key]: true };
    const allDone = Object.keys(updatedQuestions).length === 4;

    if (onUpdateProgress) {
      onUpdateProgress(suspect.id, {
        ...progress,
        askedQuestions: updatedQuestions,
        fullyAnalyzed: allDone || fullyAnalyzed,
        expanded: true
      });
    }

    if (onInterrogate) {
      onInterrogate(suspect, questionLabel);
    }
  };

  const handleAnalyzeAll = () => {
    if (onUpdateProgress) {
      onUpdateProgress(suspect.id, {
        ...progress,
        askedQuestions: { alibi: true, motive: true, means: true, confront: true },
        fullyAnalyzed: true,
        expanded: true
      });
    }
    if (onAnalyze) {
      onAnalyze(suspect);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.avatar} style={{ background: `hsl(${suspect.id.charCodeAt(suspect.id.length - 1) * 30},60%,40%)` }}>
          {suspect.name.charAt(0)}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{suspect.name}</h3>
          <span className={styles.role}>{suspect.role} · {suspect.age ? `${suspect.age} años` : "Edad N/D"}</span>
        </div>
        <div
          className={styles.suspLevel}
          style={{ color: isRevealed ? suspicionColor(currentSuspicion) : "var(--text-muted)" }}
        >
          {isRevealed ? `${currentSuspicion}%` : "?%"}
        </div>
      </div>

      <div className={styles.bar}>
        <div
          className={styles.barFill}
          style={{
            width: isRevealed ? `${currentSuspicion}%` : "0%",
            background: isRevealed ? suspicionColor(currentSuspicion) : "transparent"
          }}
        />
      </div>

      <div className={styles.badges}>
        {askedQuestions["alibi"] && (
          <span className={`${styles.badge} ${suspect.alibiValid ? styles.valid : styles.invalid}`}>
            {suspect.alibiValid ? "Coartada Válida" : "Coartada Desmentida"}
          </span>
        )}
        {askedQuestions["motive"] && suspect.motive && (
          <span className={styles.badge}>Móvil: {suspect.motive}</span>
        )}
        {askedQuestions["means"] && suspect.means && (
          <span className={styles.badge}>Medios: {suspect.means}</span>
        )}
        {!isRevealed && (
          <span className={styles.badge} style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
            Sin interrogar · Sospecha desconocida
          </span>
        )}
      </div>

      <p className={styles.desc}>{suspect.description || "Persona de interés vinculada al caso."}</p>

      <div className={styles.actions}>
        <button
          className={styles.btnInterrogate}
          onClick={handleToggleExpand}
        >
          {expanded ? "Ocultar Interrogatorio" : `Interrogar (${questionsCount}/4)`}
        </button>

        {!fullyAnalyzed ? (
          <button className={styles.btnAnalyze} onClick={handleAnalyzeAll}>
            Analizar Todo en Prolog
          </button>
        ) : (
          <button className={styles.btnAnalyzed} disabled>
            Inferencia Completa
          </button>
        )}
      </div>

      {expanded && (
        <div className={styles.interrogationPanel}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "var(--primary)" }}>
            Líneas de Interrogatorio:
          </h4>

          {/* Pregunta 1: Coartada */}
          <div className={styles.questionBlock}>
            <button
              className={`${styles.qBtn} ${askedQuestions["alibi"] ? styles.qBtnActive : ""}`}
              onClick={() => handleAskQuestion("alibi", `Preguntar coartada a ${suspect.name}`)}
            >
              1. "¿Dónde se encontraba a la hora del incidente?"
            </button>
            {askedQuestions["alibi"] && (
              <div className={styles.answerBox}>
                <p className={styles.dialogueText}>
                  "{suspect.alibi || (suspect.statements && suspect.statements[0]) || "Afirmo no haber estado en el lugar de los hechos."}"
                </p>
                <span className={styles.prologTag}>
                  Dictamen Prolog: {suspect.alibiValid ? "Coartada coherente con los horarios." : "Coartada desmentida por cámaras o evidencias."}
                </span>
              </div>
            )}
          </div>

          {/* Pregunta 2: Motivo */}
          <div className={styles.questionBlock}>
            <button
              className={`${styles.qBtn} ${askedQuestions["motive"] ? styles.qBtnActive : ""}`}
              onClick={() => handleAskQuestion("motive", `Indagar motivos de ${suspect.name}`)}
            >
              2. "¿Tenía algún interés personal, conflicto o motivo en este asunto?"
            </button>
            {askedQuestions["motive"] && (
              <div className={styles.answerBox}>
                <p className={styles.dialogueText}>
                  {suspect.motive && suspect.motive !== "ninguno" && suspect.motive !== "ninguno_identificado"
                    ? `Se descubren antecedentes y registros vinculados a: ${suspect.motive}.`
                    : "No se registran deudas ni conflictos personales aparentes con el incidente."}
                </p>
                <span className={styles.prologTag}>
                  Prolog posee_motivo: {suspect.motive && suspect.motive !== "ninguno" ? "Identificado (+Sospecha)" : "Ninguno relevante"}
                </span>
              </div>
            )}
          </div>

          {/* Pregunta 3: Medios */}
          <div className={styles.questionBlock}>
            <button
              className={`${styles.qBtn} ${askedQuestions["means"] ? styles.qBtnActive : ""}`}
              onClick={() => handleAskQuestion("means", `Preguntar por medios/herramientas a ${suspect.name}`)}
            >
              3. "¿Disponía de llaves, accesos o conocimientos para cometer el acto?"
            </button>
            {askedQuestions["means"] && (
              <div className={styles.answerBox}>
                <p className={styles.dialogueText}>
                  {suspect.means && suspect.means !== "ninguno" && suspect.means !== "ninguno_identificado"
                    ? `Posee acceso técnico o físico comprobado: ${suspect.means}.`
                    : "No cuenta con llaves maestras ni permisos especiales para áreas restringidas."}
                </p>
                <span className={styles.prologTag}>
                  Prolog posee_medios: {suspect.means && suspect.means !== "ninguno" ? "Confirmado (+Sospecha)" : "Sin medios especiales"}
                </span>
              </div>
            )}
          </div>

          {/* Pregunta 4: Confrontacion */}
          <div className={styles.questionBlock}>
            <button
              className={`${styles.qBtn} ${askedQuestions["confront"] ? styles.qBtnActive : ""}`}
              onClick={() => handleAskQuestion("confront", `Confrontar evidencias con ${suspect.name}`)}
            >
              4. "Confrontar con evidencias periciales y grabaciones de cámaras"
            </button>
            {askedQuestions["confront"] && (
              <div className={styles.answerBox}>
                <p className={styles.dialogueText}>
                  {!suspect.alibiValid || (suspect.suspicionLevel >= 70)
                    ? "El sospechoso muestra nerviosismo al ser confrontado con los registros de la escena del crimen."
                    : "Mantiene la calma; los registros periciales no sitúan su presencia en la escena durante el incidente."}
                </p>
                <span className={styles.prologTag}>
                  Evaluación Final Prolog: Nivel de sospecha consolidado en {suspect.suspicionLevel}%.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
