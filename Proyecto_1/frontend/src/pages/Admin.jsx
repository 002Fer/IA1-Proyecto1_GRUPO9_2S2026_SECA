import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCases, createAdminCase, deleteAdminCase } from "../utils/api.js";
import { useGame } from "../context/GameContext.jsx";
import styles from "./Admin.module.css";

// Opciones predefinidas estructuradas para el motor Prolog
const MOTIVOS_OPTIONS = [
  { value: "ninguno", label: "Ninguno identificado" },
  { value: "deudas_economicas", label: "Deudas Económicas Urgentes" },
  { value: "espionaje_industrial", label: "Espionaje / Venta Corporativa" },
  { value: "venganza_personal", label: "Venganza Personal / Laboral" },
  { value: "contactos_mercado_negro", label: "Contactos en Mercado Negro" },
  { value: "herencia_disputada", label: "Disputa de Herencia / Fortuna" },
];

const MEDIOS_OPTIONS = [
  { value: "ninguno", label: "Sin medios especiales" },
  { value: "llaves_maestras", label: "Llaves Maestras / Acceso Físico" },
  { value: "sistema_alarmas", label: "Acceso al Sistema de Alarmas" },
  { value: "acceso_servidor", label: "Credenciales de Servidor / TI" },
  { value: "somnifero", label: "Sustancias Químicas / Somnífero" },
  { value: "ganzua", label: "Herramientas de Forzado / Ganzúa" },
];

const TIPOS_EVIDENCIA = [
  { value: "fisica", label: "Física (Huellas, objetos, fibras)" },
  { value: "digital", label: "Digital (Logs de servidor, cámaras)" },
  { value: "documental", label: "Documental (Recibos, correos, contratos)" },
  { value: "testimonial", label: "Testimonial (Declaración de testigos)" },
  { value: "quimica", label: "Química (Residuos, sustancias)" },
];

// Plantilla de ejemplo precargada
const PLANTILLA_EJEMPLO = {
  title: "El Robo del Prototipo Cuántico",
  difficulty: "Medio",
  description: "Un microchip cuántico de alta tecnología ha sido sustraído de la bóveda de la empresa CyberTech durante la madrugada.",
  suspects: [
    { name: "Dr. Víctor Ramos", role: "Ingeniero en Jefe", alibi: "Afirma haber estado trabajando en su casa toda la noche.", motive: "espionaje_industrial", means: "acceso_servidor" },
    { name: "Carla Mendoza", role: "Directora de Finanzas", alibi: "Asistió a una cena de negocios concurrida.", motive: "deudas_economicas", means: "ninguno" },
    { name: "Andrés Silva", role: "Técnico de Seguridad", alibi: "Reporta fallo de cámaras y afirma que estuvo en la recepción.", motive: "contactos_mercado_negro", means: "sistema_alarmas" },
    { name: "Sofía Castro", role: "Asistente de Laboratorio", alibi: "Se retiró a las 18:00 con permiso médico.", motive: "ninguno", means: "ninguno" }
  ],
  evidence: [
    { description: "Descarga de archivos confidenciales de la bóveda a las 02:15 AM", type: "digital", place: "Sala de Servidores" },
    { description: "Tarjeta de acceso maestro utilizada en la compuerta", type: "digital", place: "Bóveda Principal" },
    { description: "Herramienta especializada de corte en la papelera", type: "fisica", place: "Taller Técnico" },
    { description: "Registro de transferencia internacional de 100,000 USD", type: "documental", place: "Registros Financieros" }
  ],
  places: [
    { name: "Bóveda Principal", description: "Cámara acorazada donde se custodiaba el prototipo." },
    { name: "Sala de Servidores", description: "Centro de datos con registros de accesos y cámaras." },
    { name: "Oficina del Director", description: "Despacho con contratos confidenciales de la patente." },
    { name: "Estacionamiento", description: "Salida de emergencia monitoreada por sensores." }
  ]
};

export default function Admin() {
  const navigate = useNavigate();
  const { refreshCases } = useGame();
  const [casesList, setCasesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalTab, setModalTab] = useState("info");
  const [search, setSearch] = useState("");
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newCase, setNewCase] = useState({
    title: "",
    difficulty: "Facil",
    description: "",
    suspects: [
      { name: "", role: "Principal Sospechoso", alibi: "", motive: "deudas_economicas", means: "llaves_maestras" },
      { name: "", role: "Empleado del lugar", alibi: "", motive: "ninguno", means: "ninguno" },
    ],
    evidence: [
      { description: "", type: "fisica", place: "Escena del crimen" }
    ],
    places: [
      { name: "", description: "" }
    ]
  });

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await getCases();
      setCasesList(data);
    } catch (err) {
      console.error("Error al cargar casos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filtered = casesList.filter((c) =>
    (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.id || "").toLowerCase().includes(search.toLowerCase())
  );

  const showNotification = (msg, type = "success") => {
    setStatusMsg({ text: msg, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleCargarPlantilla = () => {
    setNewCase(JSON.parse(JSON.stringify(PLANTILLA_EJEMPLO)));
    showNotification("Plantilla de ejemplo cargada con indicios listos para Prolog.");
  };

  const handleAddSuspect = () => {
    setNewCase(prev => ({
      ...prev,
      suspects: [...prev.suspects, { name: "", role: "Sospechoso", alibi: "", motive: "ninguno", means: "ninguno" }]
    }));
  };

  const handleAddEvidence = () => {
    setNewCase(prev => ({
      ...prev,
      evidence: [...prev.evidence, { description: "", type: "fisica", place: "Lugar del hecho" }]
    }));
  };

  const handleAddPlace = () => {
    setNewCase(prev => ({
      ...prev,
      places: [...prev.places, { name: "", description: "" }]
    }));
  };

  const handleCreate = async () => {
    if (!newCase.title.trim() || !newCase.description.trim()) {
      showNotification("Por favor completa el título y la descripción del caso.", "error");
      setModalTab("info");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: newCase.title,
        difficulty: newCase.difficulty,
        description: newCase.description,
        suspects: newCase.suspects.filter(s => s.name.trim().length > 0),
        evidence: newCase.evidence.filter(e => e.description.trim().length > 0),
        places: newCase.places.filter(p => p.name.trim().length > 0)
      };

      await createAdminCase(payload);
      showNotification("Caso creado exitosamente con sus reglas lógicas en Prolog.");
      
      setNewCase({
        title: "",
        difficulty: "Facil",
        description: "",
        suspects: [
          { name: "", role: "Principal Sospechoso", alibi: "", motive: "deudas_economicas", means: "llaves_maestras" },
          { name: "", role: "Empleado del lugar", alibi: "", motive: "ninguno", means: "ninguno" },
        ],
        evidence: [{ description: "", type: "fisica", place: "Escena del crimen" }],
        places: [{ name: "", description: "" }]
      });

      setShowForm(false);
      setModalTab("info");
      await fetchCases();
      if (refreshCases) await refreshCases();
    } catch (err) {
      showNotification(err.message || "Error al crear el caso en Prolog", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (caseItem) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el caso "${caseItem.title}" (${caseItem.id}) de Prolog?`)) {
      try {
        await deleteAdminCase(caseItem.id);
        showNotification(`Caso ${caseItem.id} eliminado correctamente de Prolog.`);
        await fetchCases();
        if (refreshCases) await refreshCases();
      } catch (err) {
        showNotification(err.message || "Error al eliminar el caso de Prolog", "error");
      }
    }
  };

  const stats = [
    { label: "Total Casos", value: casesList.length, badge: "Total" },
    { label: "Fáciles", value: casesList.filter((c) => (c.difficulty || "").toLowerCase().includes("facil")).length, badge: "Fácil" },
    { label: "Medios", value: casesList.filter((c) => (c.difficulty || "").toLowerCase().includes("medio")).length, badge: "Medio" },
    { label: "Difíciles", value: casesList.filter((c) => (c.difficulty || "").toLowerCase().includes("dificil")).length, badge: "Difícil" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Panel Administrativo</h1>
          <p className={styles.sub}>Gestión, creación y persistencia de casos e investigaciones en Prolog.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.newBtn} onClick={() => { setShowForm(true); setModalTab("info"); }}>
            + Nuevo Caso Estructurado
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{
          padding: "12px 16px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: statusMsg.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
          color: statusMsg.type === "error" ? "#f87171" : "#4ade80",
          border: `1px solid ${statusMsg.type === "error" ? "#ef4444" : "#22c55e"}`,
          fontWeight: "500"
        }}>
          {statusMsg.text}
        </div>
      )}

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "700", textTransform: "uppercase" }}>{s.badge}</span>
            <strong className={styles.statValue}>{s.value}</strong>
            <small>{s.label}</small>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Buscar caso por título o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Dificultad</th>
              <th>Sospechosos</th>
              <th>Evidencias</th>
              <th>Lugares</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className={styles.empty}>Cargando casos desde el motor Prolog...</td></tr>
            ) : filtered.length > 0 ? (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td className={styles.id}>{c.id}</td>
                  <td className={styles.titleCell}>{c.title}</td>
                  <td>
                    <span className={`${styles.diff} ${styles[(c.difficulty || "facil").toLowerCase()]}`}>{c.difficulty}</span>
                  </td>
                  <td>{c.suspectsCount ?? c.suspects?.length ?? 0}</td>
                  <td>{c.evidenceCount ?? c.evidence?.length ?? 0}</td>
                  <td>{c.placesCount ?? c.places?.length ?? 0}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => navigate(`/investigation/${c.id}`)}
                      title="Abrir investigación del caso"
                    >
                      Investigar
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.del}`}
                      onClick={() => handleDelete(c)}
                      title="Eliminar caso de Prolog"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className={styles.empty}>No se encontraron casos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create modal with tabs & predefined options */}
      {showForm && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className={styles.modal} style={{ maxWidth: "680px", width: "95%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 style={{ margin: 0 }}>Nuevo Caso en Prolog</h2>
              <button 
                type="button" 
                onClick={handleCargarPlantilla}
                style={{ 
                  background: "rgba(59, 130, 246, 0.15)", 
                  color: "#60a5fa", 
                  border: "1px solid #3b82f6", 
                  padding: "6px 12px", 
                  borderRadius: "6px", 
                  cursor: "pointer", 
                  fontWeight: "600",
                  fontSize: "0.85rem"
                }}
              >
                Cargar Plantilla de Ejemplo
              </button>
            </div>

            {/* Modal Subtabs */}
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "16px", paddingBottom: "8px" }}>
              <button 
                type="button"
                onClick={() => setModalTab("info")} 
                style={{ 
                  background: modalTab === "info" ? "var(--primary)" : "transparent", 
                  color: modalTab === "info" ? "#fff" : "var(--text-muted)",
                  border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" 
                }}
              >
                1. Información
              </button>
              <button 
                type="button"
                onClick={() => setModalTab("suspects")} 
                style={{ 
                  background: modalTab === "suspects" ? "var(--primary)" : "transparent", 
                  color: modalTab === "suspects" ? "#fff" : "var(--text-muted)",
                  border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" 
                }}
              >
                2. Sospechosos ({newCase.suspects.filter(s=>s.name).length})
              </button>
              <button 
                type="button"
                onClick={() => setModalTab("evidence")} 
                style={{ 
                  background: modalTab === "evidence" ? "var(--primary)" : "transparent", 
                  color: modalTab === "evidence" ? "#fff" : "var(--text-muted)",
                  border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" 
                }}
              >
                3. Evidencias ({newCase.evidence.filter(e=>e.description).length})
              </button>
              <button 
                type="button"
                onClick={() => setModalTab("places")} 
                style={{ 
                  background: modalTab === "places" ? "var(--primary)" : "transparent", 
                  color: modalTab === "places" ? "#fff" : "var(--text-muted)",
                  border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" 
                }}
              >
                4. Lugares ({newCase.places.filter(p=>p.name).length})
              </button>
            </div>

            {/* Tab 1: Info */}
            {modalTab === "info" && (
              <div>
                <label>Título del Caso</label>
                <input 
                  className={styles.input} 
                  value={newCase.title} 
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} 
                  placeholder="Ej: El Robo del Microchip Cuántico" 
                />
                
                <label>Nivel de Dificultad</label>
                <select 
                  className={styles.input} 
                  value={newCase.difficulty} 
                  onChange={(e) => setNewCase({ ...newCase, difficulty: e.target.value })}
                >
                  <option value="Facil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Dificil">Difícil</option>
                </select>

                <label>Descripción del Caso / Incidente</label>
                <textarea 
                  className={styles.input} 
                  rows="4" 
                  value={newCase.description} 
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} 
                  placeholder="Describe los acontecimientos principales del caso para el detective..." 
                />
              </div>
            )}

            {/* Tab 2: Suspects con opciones estructuradas */}
            {modalTab === "suspects" && (
              <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Configura los sospechosos con sus indicios lógicos:</span>
                  <button type="button" onClick={handleAddSuspect} style={{ padding: "4px 8px", fontSize: "0.8rem", cursor: "pointer" }}>+ Añadir Persona</button>
                </div>
                {newCase.suspects.map((s, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input 
                        className={styles.input} 
                        style={{ flex: 2, marginBottom: 0 }}
                        placeholder="Nombre completo" 
                        value={s.name} 
                        onChange={(e) => {
                          const updated = [...newCase.suspects];
                          updated[idx].name = e.target.value;
                          setNewCase({ ...newCase, suspects: updated });
                        }} 
                      />
                      <input 
                        className={styles.input} 
                        style={{ flex: 1, marginBottom: 0 }}
                        placeholder="Rol / Ocupación" 
                        value={s.role} 
                        onChange={(e) => {
                          const updated = [...newCase.suspects];
                          updated[idx].role = e.target.value;
                          setNewCase({ ...newCase, suspects: updated });
                        }} 
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>Móvil / Motivo (Prolog)</label>
                        <select 
                          className={styles.input}
                          style={{ marginBottom: 0, fontSize: "0.85rem" }}
                          value={s.motive || "ninguno"}
                          onChange={(e) => {
                            const updated = [...newCase.suspects];
                            updated[idx].motive = e.target.value;
                            setNewCase({ ...newCase, suspects: updated });
                          }}
                        >
                          {MOTIVOS_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>Medios / Acceso (Prolog)</label>
                        <select 
                          className={styles.input}
                          style={{ marginBottom: 0, fontSize: "0.85rem" }}
                          value={s.means || "ninguno"}
                          onChange={(e) => {
                            const updated = [...newCase.suspects];
                            updated[idx].means = e.target.value;
                            setNewCase({ ...newCase, suspects: updated });
                          }}
                        >
                          {MEDIOS_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>Declaración / Coartada Alegada (Prolog evaluará su validez)</label>
                      <input 
                        className={styles.input} 
                        style={{ marginBottom: 0, fontSize: "0.85rem" }}
                        placeholder="Declaración del sospechoso sobre su ubicación durante el crimen..." 
                        value={s.alibi} 
                        onChange={(e) => {
                          const updated = [...newCase.suspects];
                          updated[idx].alibi = e.target.value;
                          setNewCase({ ...newCase, suspects: updated });
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Evidence con tipos estructurados */}
            {modalTab === "evidence" && (
              <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Evidencias e indicios clasificados:</span>
                  <button type="button" onClick={handleAddEvidence} style={{ padding: "4px 8px", fontSize: "0.8rem", cursor: "pointer" }}>+ Añadir Evidencia</button>
                </div>
                {newCase.evidence.map((ev, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <input 
                        className={styles.input} 
                        style={{ flex: 2, marginBottom: 0 }}
                        placeholder="Descripción de la evidencia" 
                        value={ev.description} 
                        onChange={(e) => {
                          const updated = [...newCase.evidence];
                          updated[idx].description = e.target.value;
                          setNewCase({ ...newCase, evidence: updated });
                        }} 
                      />
                      <select 
                        className={styles.input} 
                        style={{ flex: 1, marginBottom: 0, fontSize: "0.85rem" }}
                        value={ev.type} 
                        onChange={(e) => {
                          const updated = [...newCase.evidence];
                          updated[idx].type = e.target.value;
                          setNewCase({ ...newCase, evidence: updated });
                        }} 
                      >
                        {TIPOS_EVIDENCIA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <input 
                      className={styles.input} 
                      style={{ marginBottom: 0, fontSize: "0.85rem" }}
                      placeholder="Lugar donde se halló el indicio..." 
                      value={ev.place} 
                      onChange={(e) => {
                        const updated = [...newCase.evidence];
                        updated[idx].place = e.target.value;
                        setNewCase({ ...newCase, evidence: updated });
                      }} 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Places */}
            {modalTab === "places" && (
              <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Lugares relevantes en la escena:</span>
                  <button type="button" onClick={handleAddPlace} style={{ padding: "4px 8px", fontSize: "0.8rem", cursor: "pointer" }}>+ Añadir Lugar</button>
                </div>
                {newCase.places.map((pl, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <input 
                      className={styles.input} 
                      style={{ marginBottom: "6px" }}
                      placeholder="Nombre del lugar (Ej: Bóveda Principal)" 
                      value={pl.name} 
                      onChange={(e) => {
                        const updated = [...newCase.places];
                        updated[idx].name = e.target.value;
                        setNewCase({ ...newCase, places: updated });
                      }} 
                    />
                    <input 
                      className={styles.input} 
                      style={{ marginBottom: 0, fontSize: "0.85rem" }}
                      placeholder="Descripción de lo que ocurrió allí..." 
                      value={pl.description} 
                      onChange={(e) => {
                        const updated = [...newCase.places];
                        updated[idx].description = e.target.value;
                        setNewCase({ ...newCase, places: updated });
                      }} 
                    />
                  </div>
                ))}
              </div>
            )}

            <div className={styles.modalActions} style={{ marginTop: "20px" }}>
              <button className={styles.cancelBtn} onClick={() => setShowForm(false)} disabled={isSubmitting}>
                Cancelar
              </button>
              <button className={styles.saveBtn} onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? "Guardando en Prolog..." : "Guardar Caso en Prolog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
