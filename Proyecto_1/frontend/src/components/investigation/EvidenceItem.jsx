import React, { useState } from "react";
import styles from "./EvidenceItem.module.css";

const typeIcon = { Fisica: "🧪", Quimica: "⚗️", Digital: "💻", Testimonial: "🗣", Documental: "📄", Traza: "👣" };

export default function EvidenceItem({ evidence }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.card} onClick={() => setOpen(!open)}>
      <div className={styles.top}>
        <span className={styles.icon}>{typeIcon[evidence.type] || "🔍"}</span>
        <div className={styles.meta}>
          <span className={styles.type}>{evidence.type}</span>
          <span className={styles.location}>📍 {evidence.location}</span>
        </div>
      </div>
      <p className={styles.desc}>{evidence.description}</p>
      {open && (
        <div className={styles.detail}>
          <span className={styles.label}>Sospechosos relacionados:</span>
          <div className={styles.tags}>
            {evidence.relatedSuspects.length > 0
              ? evidence.relatedSuspects.map((s) => <span key={s} className={styles.tag}>{s}</span>)
              : <span className={styles.tag}>Ninguno identificado</span>
            }
          </div>
        </div>
      )}
      <span className={styles.toggle}>{open ? "▲ Cerrar" : "▼ Ver detalles"}</span>
    </div>
  );
}
