import React from "react";
import styles from "./TimelineView.module.css";

export default function TimelineView({ events }) {
  return (
    <div className={styles.timeline}>
      {events.map((ev, i) => (
        <div key={i} className={`${styles.item} ${ev.suspicious ? styles.suspicious : ""}`}>
          <div className={styles.connector}>
            <div className={styles.dot}></div>
            {i < events.length - 1 && <div className={styles.line}></div>}
          </div>
          <div className={styles.content}>
            <span className={styles.time}>{ev.time}</span>
            <p className={styles.event}>{ev.event}</p>
            {ev.suspicious && <span className={styles.suspTag}>⚠ Sospechoso</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
