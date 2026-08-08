import React, { useState } from "react";
import { useGame } from "../context/GameContext.jsx";
import styles from "./Admin.module.css";

export default function Admin() {
  const { cases } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [newCase, setNewCase] = useState({ title: "", difficulty: "Facil", description: "" });
  const [search, setSearch] = useState("");
  const [localCases, setLocalCases] = useState([]);

  const allCases = [...cases, ...localCases];
  const filtered = allCases.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newCase.title.trim()) return;
    setLocalCases((prev) => [...prev, { ...newCase, id: `custom-${Date.now()}`, status: "disponible", suspects: [], evidence: [], places: [], timeline: [], rules: [] }]);
    setNewCase({ title: "", difficulty: "Facil", description: "" });
    setShowForm(false);
  };

  const stats = [
    { label: "Total Casos", value: allCases.length, icon: "📁" },
    { label: "Disponibles", value: allCases.filter((c) => c.status === "disponible").length, icon: "🟢" },
    { label: "Completados", value: allCases.filter((c) => c.status === "completado").length, icon: "✅" },
    { label: "Sospechosos", value: allCases.reduce((acc, c) => acc + (c.suspects?.length || 0), 0), icon: "🕵️" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Panel Administrativo</h1>
          <p className={styles.sub}>Gestión de casos e investigaciones del sistema Logic Detective.</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>+ Nuevo Caso</button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <strong className={styles.statValue}>{s.value}</strong>
            <small>{s.label}</small>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="🔍 Buscar caso..."
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
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className={styles.id}>{c.id}</td>
                <td className={styles.titleCell}>{c.title}</td>
                <td>
                  <span className={`${styles.diff} ${styles[c.difficulty?.toLowerCase()]}`}>{c.difficulty}</span>
                </td>
                <td>{c.suspects?.length ?? 0}</td>
                <td>{c.evidence?.length ?? 0}</td>
                <td>
                  <span className={`${styles.status} ${c.status === "completado" ? styles.done : styles.avail}`}>
                    {c.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button className={styles.actionBtn}>👁 Ver</button>
                  <button className={styles.actionBtn}>✏️ Editar</button>
                  <button className={`${styles.actionBtn} ${styles.del}`}>🗑 Borrar</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" className={styles.empty}>No se encontraron casos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {showForm && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className={styles.modal}>
            <h2>Crear Nuevo Caso</h2>
            <label>Título</label>
            <input className={styles.input} value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} placeholder="Nombre del caso..." />
            <label>Dificultad</label>
            <select className={styles.input} value={newCase.difficulty} onChange={(e) => setNewCase({ ...newCase, difficulty: e.target.value })}>
              <option>Facil</option>
              <option>Medio</option>
              <option>Dificil</option>
            </select>
            <label>Descripción</label>
            <textarea className={styles.input} rows="4" value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} placeholder="Descripción del caso..." />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={handleCreate}>Crear Caso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
