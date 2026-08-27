import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import { getCaseById, getHint, registerAction, getWitnesses, getCameras, getAccessRecords, getTestimonies } from "../utils/api.js";
import SuspectCard, { getSuspectCurrentScore } from "../components/investigation/SuspectCard.jsx";
import EvidenceItem from "../components/investigation/EvidenceItem.jsx";
import TimelineView from "../components/investigation/TimelineView.jsx";
import ContradictionAlert from "../components/investigation/ContradictionAlert.jsx";
import AccusationModal from "../components/investigation/AccusationModal.jsx";
import CaseReportModal from "../components/investigation/CaseReportModal.jsx";
import styles from "./InvestigationDashboard.module.css";

const TABS = ["Descripción", "Sospechosos", "Evidencias", "Lugares", "Cronología", "Testimonios", "Coartadas", "Cámaras", "Accesos", "Contradicciones", "Pistas"];

export default function InvestigationDashboard() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { logAction, log } = useGame();

  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState("Descripción");
  const [hint, setHint] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showAccuse, setShowAccuse] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [lastAccusationResult, setLastAccusationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investigationData, setInvestigationData] = useState({ witnesses: [], cameras: [], access: [], testimonies: [] });
  
  // Estado persistente del interrogatorio por sospechoso
  const [interrogationProgress, setInterrogationProgress] = useState({});

  useEffect(() => {
    getCaseById(caseId)
      .then(async (c) => {
        setCaseData(c);
        const [witnesses, cameras, access, testimonies] = await Promise.all([
          getWitnesses(caseId).catch(() => []),
          getCameras(caseId).catch(() => []),
          getAccessRecords(caseId).catch(() => []),
          getTestimonies(caseId).catch(() => []),
        ]);
        setInvestigationData({ witnesses, cameras, access, testimonies });
        logAction(`Investigación iniciada: ${c.title}`);
        registerAction(caseId, `Investigación iniciada: ${c.title}`);
        setLoading(false);
      })
      .catch(() => { navigate("/cases"); });
  }, [caseId]);

  const handleTab = (tab) => {
    setActiveTab(tab);
    logAction(`Sección consultada: ${tab}`);
    registerAction(caseId, `Sección consultada: ${tab}`);
  };

  const handleUpdateProgress = (suspectId, progressData) => {
    setInterrogationProgress((prev) => ({
      ...prev,
      [suspectId]: progressData
    }));
  };

  const handleInterrogate = (suspect, customAction) => {
    const text = customAction || `Interrogatorio a: ${suspect.name}`;
    logAction(text);
    registerAction(caseId, text);
  };

  const handleAnalyzeSuspect = (suspect) => {
    setInterrogationProgress((prev) => ({
      ...prev,
      [suspect.id]: {
        askedQuestions: { alibi: true, motive: true, means: true, confront: true },
        fullyAnalyzed: true,
        expanded: true
      }
    }));
    logAction(`Inferencia en Prolog: ${suspect.name} -> Nivel de sospecha: ${suspect.suspicionLevel}%`);
    registerAction(caseId, `Inferencia en Prolog: ${suspect.name} -> Nivel de sospecha: ${suspect.suspicionLevel}%`);
  };

  const handleHint = async () => {
    if (hintsUsed >= 3) return;
    const h = await getHint(caseId);
    setHint(h);
    setHintsUsed((n) => n + 1);
    logAction(`Pista solicitada (${hintsUsed + 1}/3)`);
    registerAction(caseId, `Pista solicitada (${hintsUsed + 1}/3)`);
  };

  if (loading) return <div className={styles.loading}><div className={styles.spinner}></div></div>;
  if (!caseData) return null;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.caseInfo}>
          <span className={styles.caseLabel}>CASO ACTIVO</span>
          <h2 className={styles.caseTitle}>{caseData.title}</h2>
          <span className={styles.diff}>{caseData.difficulty}</span>
        </div>

        <div className={styles.suspicionSection}>
          <h4>Nivel de Sospecha</h4>
          {caseData.suspects.map((s) => {
            const p = interrogationProgress[s.id] || {};
            const score = getSuspectCurrentScore(s, p.askedQuestions, p.fullyAnalyzed);
            const isRevealed = score !== null;
            const pct = isRevealed ? score : 0;
            const color = pct >= 70 ? "#f44336" : pct >= 40 ? "#ff9800" : "#4caf50";

            return (
              <div key={s.id} className={styles.suspBar}>
                <span className={styles.suspName}>{s.name.split(" ")[0]}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: isRevealed ? `${pct}%` : "0%",
                      background: isRevealed ? color : "transparent"
                    }}
                  />
                </div>
                <span className={styles.suspPct} style={{ color: isRevealed ? color : "var(--text-muted)" }}>
                  {isRevealed ? `${pct}%` : "?%"}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.logSection}>
          <h4>Bitácora</h4>
          <div className={styles.logList}>
            {log.length === 0
              ? <p className={styles.logEmpty}>Sin acciones aún.</p>
              : log.map((entry) => (
                <div key={entry.id} className={styles.logEntry}>
                  <span className={styles.logTime}>{entry.timestamp}</span>
                  <span>{entry.text}</span>
                </div>
              ))
            }
          </div>
        </div>
      </aside>

      {/* Main panel */}
      <div className={styles.main}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => handleTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.content}>
          {activeTab === "Descripción" && (
            <div className={styles.section}>
              <h3>Descripción del Caso</h3>
              <p className={styles.descText}>{caseData.description}</p>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}><strong>{caseData.suspects.length}</strong><small>Sospechosos</small></div>
                <div className={styles.infoCard}><strong>{caseData.evidence.length}</strong><small>Evidencias</small></div>
                <div className={styles.infoCard}><strong>{caseData.places.length}</strong><small>Lugares</small></div>
                <div className={styles.infoCard}><strong>{caseData.rules.length}</strong><small>Reglas</small></div>
              </div>
            </div>
          )}

          {activeTab === "Sospechosos" && (
            <div className={styles.section}>
              <h3>Sospechosos</h3>
              <div className={styles.suspectsGrid}>
                {caseData.suspects.map((s) => (
                  <SuspectCard 
                    key={s.id} 
                    suspect={s}
                    progress={interrogationProgress[s.id] || {}}
                    onUpdateProgress={handleUpdateProgress}
                    onInterrogate={handleInterrogate} 
                    onAnalyze={handleAnalyzeSuspect} 
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "Evidencias" && (
            <div className={styles.section}>
              <h3>Evidencias</h3>
              <div className={styles.evidenceGrid}>
                {caseData.evidence.map((ev) => (
                  <EvidenceItem key={ev.id} evidence={ev} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "Lugares" && (
            <div className={styles.section}>
              <h3>Lugares de Investigación</h3>
              <div className={styles.placesList}>
                {caseData.places.map((p, i) => (
                  <div key={p.id} className={styles.placeCard}>
                    <span className={styles.placeNum}>0{i + 1}</span>
                    <div>
                      <h4>{p.name}</h4>
                      <p>{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Cronología" && (
            <div className={styles.section}>
              <h3>Línea de Tiempo</h3>
              <TimelineView events={caseData.timeline} />
            </div>
          )}

          {activeTab === "Testimonios" && (
            <div className={styles.section}>
              <h3>Testimonios registrados</h3>
              <div className={styles.testimonyList}>
                {investigationData.testimonies.map((t, i) => (
                  <div className={styles.testimonyCard} key={`${t.suspectId}-${i}`}>
                    <strong>{t.suspectName}</strong><span className={styles.meta}>{t.type}</span>
                    <p>"{t.statement}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Coartadas" && (
            <div className={styles.section}>
              <h3>Coartadas</h3>
              <div className={styles.alibiList}>
                {caseData.suspects.map((s) => (
                  <div className={`${styles.alibiCard} ${s.alibiValid ? styles.alibiValid : styles.alibiInvalid}`} key={s.id}>
                    <strong>{s.name}</strong><span>{s.alibiValid ? "Válida" : "Inválida"}</span><p>{s.alibi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Cámaras" && (
            <div className={styles.section}>
              <h3>Cámaras de seguridad</h3>
              <div className={styles.recordList}>
                {investigationData.cameras.map((c) => <div className={styles.recordCard} key={c.id}><strong>{c.location}</strong><span>{c.start}{c.end !== c.start ? ` – ${c.end}` : ""}</span><p>{c.observation}</p></div>)}
              </div>
            </div>
          )}

          {activeTab === "Accesos" && (
            <div className={styles.section}>
              <h3>Registros de acceso</h3>
              <div className={styles.recordList}>
                {investigationData.access.map((a, i) => <div className={styles.recordCard} key={`${a.suspectId}-${i}`}><strong>{a.suspectName}</strong><span>{a.time} · {a.location}</span><p>Fuente: {a.source} · Acción: {a.action}</p></div>)}
              </div>
            </div>
          )}

          {activeTab === "Contradicciones" && (
            <div className={styles.section}>
              <h3>Contradicciones Detectadas</h3>
              <ContradictionAlert contradictions={caseData.contradictions} />
            </div>
          )}

          {activeTab === "Pistas" && (
            <div className={styles.section}>
              <h3>Sistema de Pistas</h3>
              <p className={styles.hintInfo}>Tienes <strong>{3 - hintsUsed}</strong> pistas disponibles.</p>
              <button className={styles.hintBtn} onClick={handleHint} disabled={hintsUsed >= 3}>
                {hintsUsed >= 3 ? "Sin pistas disponibles" : "Solicitar Pista"}
              </button>
              {hint && <div className={styles.hintBox}><p>{hint}</p></div>}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className={styles.bottomBar}>
          <button 
            className={styles.reportBtn} 
            onClick={() => { 
              setShowReport(true); 
              logAction("Informe pericial consultado"); 
              registerAction(caseId, "Informe pericial consultado"); 
            }}
          >
            Generar Informe Pericial
          </button>
          <button 
            className={styles.accuseBtn} 
            onClick={() => { 
              setShowAccuse(true); 
              logAction("Acusación iniciada"); 
              registerAction(caseId, "Acusación iniciada"); 
            }}
          >
            Emitir Acusación Final
          </button>
        </div>
      </div>

      {showAccuse && (
        <AccusationModal
          caseData={caseData}
          onClose={() => setShowAccuse(false)}
          onLog={logAction}
          onViewReport={(res) => {
            setLastAccusationResult(res);
            setShowReport(true);
          }}
        />
      )}

      {showReport && (
        <CaseReportModal
          caseData={caseData}
          log={log}
          onClose={() => setShowReport(false)}
          accusationResult={lastAccusationResult}
        />
      )}
    </div>
  );
}
