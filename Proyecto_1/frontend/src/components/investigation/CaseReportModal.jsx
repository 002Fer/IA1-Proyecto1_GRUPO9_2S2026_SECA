import React from "react";
import styles from "./CaseReportModal.module.css";

export default function CaseReportModal({ caseData, log = [], onClose, accusationResult }) {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const handlePrint = () => {
    const reportElem = document.getElementById("informe-caso-contenido");
    if (!reportElem) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=920,height=850");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Informe Pericial - ${caseData.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            * { box-sizing: border-box; }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 30px 40px;
              margin: 0;
              line-height: 1.5;
              font-size: 13px;
            }
            .header-wrap {
              border-bottom: 2px solid #1e3a8a;
              padding-bottom: 12px;
              margin-bottom: 16px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .dept-badge {
              font-size: 10px;
              font-weight: 800;
              color: #2563eb;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            h1 {
              font-size: 20px;
              font-weight: 800;
              margin: 4px 0;
              color: #0f172a;
            }
            .case-sub {
              color: #475569;
              font-size: 12px;
              font-weight: 600;
            }
            .meta-box {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 8px 12px;
              font-size: 11px;
              line-height: 1.5;
            }
            .section {
              margin-bottom: 16px;
            }
            .section-title {
              font-size: 13px;
              font-weight: 700;
              color: #1e3a8a;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .narrative {
              font-size: 12.5px;
              color: #334155;
              margin: 0;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 6px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 6px 8px;
              text-align: left;
            }
            th {
              background: #f1f5f9;
              font-weight: 700;
              color: #1e293b;
              font-size: 11.5px;
            }
            .tag-valid {
              background: #dcfce7;
              color: #15803d;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: 700;
              font-size: 11px;
            }
            .tag-invalid {
              background: #fee2e2;
              color: #b91c1c;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: 700;
              font-size: 11px;
            }
            .two-cols {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
            .sub-heading {
              font-size: 12px;
              font-weight: 700;
              color: #334155;
              margin: 0 0 4px 0;
            }
            ul {
              margin: 0 0 0 16px;
              padding: 0;
              font-size: 12px;
              color: #334155;
            }
            li {
              margin-bottom: 3px;
            }
            .verdict-box {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              border-left: 4px solid #2563eb;
              padding: 10px 12px;
              border-radius: 4px;
              font-size: 12px;
            }
            .code-tag {
              background: #e2e8f0;
              padding: 1px 4px;
              border-radius: 3px;
              font-family: monospace;
              font-size: 11px;
              color: #0f172a;
            }
            .signatures {
              display: flex;
              justify-content: space-around;
              margin-top: 30px;
              padding-top: 15px;
            }
            .sign-line {
              text-align: center;
              font-size: 11px;
              color: #475569;
            }
            .sign-border {
              width: 200px;
              border-top: 1px dashed #64748b;
              margin-bottom: 4px;
            }
            @media print {
              body { padding: 15px 25px; }
              @page { margin: 1cm; size: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header-wrap">
            <div>
              <div class="dept-badge">LOGIC DETECTIVE · SISTEMA EXPERTO FORENSE</div>
              <h1>INFORME PERICIAL DE INVESTIGACIÓN</h1>
              <div class="case-sub">${caseData.title} · Referencia: #${caseData.id}</div>
            </div>
            <div class="meta-box">
              <div><strong>Fecha de Emisión:</strong> ${currentDate}</div>
              <div><strong>Clasificación:</strong> Caso ${caseData.difficulty}</div>
              <div><strong>Estado:</strong> ${accusationResult ? (accusationResult.correct ? "CASO RESUELTO" : "EN REVISIÓN") : "INVESTIGACIÓN FINALIZADA"}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">1. Resumen Ejecutivo del Incidente</div>
            <p class="narrative">${caseData.description}</p>
          </div>

          <div class="section">
            <div class="section-title">2. Cuadro de Sospechosos e Inferencia Lógica</div>
            <table>
              <thead>
                <tr>
                  <th>Individuo</th>
                  <th>Ocupación / Rol</th>
                  <th>Coartada Evaluada</th>
                  <th>Detectado</th>
                  <th>Medios / Acceso</th>
                  <th>Sospecha</th>
                </tr>
              </thead>
              <tbody>
                ${caseData.suspects.map(s => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.role}</td>
                    <td>
                      <span class="${s.alibiValid ? 'tag-valid' : 'tag-invalid'}">
                        ${s.alibiValid ? 'Válida' : 'Desmentida'}
                      </span>
                    </td>
                    <td>${s.motive && s.motive !== 'ninguno' ? s.motive : 'Sin móvil registrado'}</td>
                    <td>${s.means && s.means !== 'ninguno' ? s.means : 'Sin medios especiales'}</td>
                    <td><strong>${s.suspicionLevel}%</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">3. Evidencias Colectadas y Escenarios de Inspección</div>
            <div class="two-cols">
              <div>
                <div class="sub-heading">Evidencias Materiales y Digitales:</div>
                <ul>
                  ${caseData.evidence.map(ev => `
                    <li><strong>[${ev.type.toUpperCase()}]</strong> ${ev.description} — <em>${ev.place}</em></li>
                  `).join('')}
                </ul>
              </div>
              <div>
                <div class="sub-heading">Lugares Inspeccionados:</div>
                <ul>
                  ${caseData.places.map(pl => `
                    <li><strong>${pl.name}:</strong> ${pl.description}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">4. Dictamen Pericial y Cadena Deductiva (Motor Prolog)</div>
            <div class="verdict-box">
              ${accusationResult ? `
                <div style="margin-bottom: 6px;">
                  <strong>Resultado de la Acusación:</strong> 
                  <span style="font-weight: 700; color: ${accusationResult.correct ? '#15803d' : '#b91c1c'}">
                    ${accusationResult.correct ? 'ACUSACIÓN FUNDAMENTADA Y CORRECTA' : 'ACUSACIÓN DISCORDANTE'}
                  </span>
                </div>
                <p style="margin: 0 0 6px 0;">${accusationResult.message}</p>
                ${accusationResult.culpritName && !accusationResult.correct ? `<p style="margin: 0 0 6px 0;">Responsable lógico deducido por Prolog: <strong>${accusationResult.culpritName}</strong></p>` : ''}
                ${accusationResult.rules && accusationResult.rules.length > 0 ? `
                  <div style="margin-top: 6px;">
                    <strong>Reglas Lógicas Activadas:</strong>
                    <ul style="margin-top: 3px;">
                      ${accusationResult.rules.map(r => `<li><span class="code-tag">${r}</span></li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              ` : `
                <p style="margin: 0 0 6px 0;">
                  El motor de inferencia de Prolog contrastó la base de hechos, coartadas y grabaciones de seguridad.
                </p>
                <strong>Reglas Principales Aplicadas en el Caso:</strong>
                <ul style="margin-top: 3px;">
                  <li><span class="code-tag">tuvo_acceso/2</span>: Verificación de presencia en la escena del crimen.</li>
                  <li><span class="code-tag">tuvo_oportunidad/2</span>: Coincidencia con la franja horaria del incidente.</li>
                  <li><span class="code-tag">posee_motivo/2</span> y <span class="code-tag">posee_medios/2</span>: Comprobación de móvil y herramientas.</li>
                  <li><span class="code-tag">coartada_invalida/2</span>: Descarte de justificación por contradicción probatoria.</li>
                  <li><span class="code-tag">culpable/2</span>: Deducción formal del responsable lógico.</li>
                </ul>
              `}
            </div>
          </div>

          <div class="section">
            <div class="section-title">5. Bitácora Cronológica de Actuaciones del Detective</div>
            ${log.length === 0 ? `
              <p style="color: #64748b; font-style: italic;">Sin actuaciones registradas.</p>
            ` : `
              <table>
                <thead>
                  <tr>
                    <th style="width: 120px;">Hora</th>
                    <th>Actuación Realizada</th>
                  </tr>
                </thead>
                <tbody>
                  ${log.map(entry => `
                    <tr>
                      <td style="font-family: monospace; color: #475569;">${entry.timestamp}</td>
                      <td>${entry.text}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>

          <div class="signatures">
            <div class="sign-line">
              <div class="sign-border"></div>
              <span>Firma Detective a Cargo</span>
            </div>
            <div class="sign-line">
              <div class="sign-border"></div>
              <span>Sello Validación Pericial (Prolog Engine)</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Barra superior de control */}
        <div className={styles.controlsBar}>
          <button className={styles.printBtn} onClick={handlePrint}>
            Imprimir / Guardar en PDF
          </button>
          <button className={styles.closeBtn} onClick={onClose}>✕ Cerrar</button>
        </div>

        {/* Vista previa en pantalla */}
        <div className={styles.printableDocument} id="informe-caso-contenido">
          {/* Encabezado */}
          <div className={styles.reportHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.deptBadge}>LOGIC DETECTIVE · SISTEMA EXPERTO FORENSE</span>
              <h1 className={styles.reportTitle}>INFORME PERICIAL DE INVESTIGACIÓN</h1>
              <span className={styles.caseSub}>{caseData.title} · Referencia: #{caseData.id}</span>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.metaBox}>
                <div><strong>Fecha de Emisión:</strong> {currentDate}</div>
                <div><strong>Clasificación:</strong> Confidencial / Caso {caseData.difficulty}</div>
                <div><strong>Estado:</strong> {accusationResult ? (accusationResult.correct ? "CASO RESUELTO" : "EN REVISIÓN") : "INVESTIGACIÓN FINALIZADA"}</div>
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Descripción de los Hechos */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Resumen Ejecutivo del Incidente</h2>
            <p className={styles.narrativeText}>{caseData.description}</p>
          </section>

          {/*Sospechosos e Indicios */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Cuadro de Sospechosos e Inferencia Lógica</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Individuo</th>
                  <th>Ocupación / Rol</th>
                  <th>Coartada Evaluada</th>
                  <th>Móvil Detectado</th>
                  <th>Medios / Acceso</th>
                  <th>Sospecha</th>
                </tr>
              </thead>
              <tbody>
                {caseData.suspects.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.role}</td>
                    <td>
                      <span className={s.alibiValid ? styles.tagValid : styles.tagInvalid}>
                        {s.alibiValid ? "Válida" : "Desmentida"}
                      </span>
                    </td>
                    <td>{s.motive && s.motive !== "ninguno" ? s.motive : "Sin móvil registrado"}</td>
                    <td>{s.means && s.means !== "ninguno" ? s.means : "Sin medios especiales"}</td>
                    <td>
                      <strong style={{ color: s.suspicionLevel >= 70 ? "#ef4444" : s.suspicionLevel >= 40 ? "#eab308" : "#22c55e" }}>
                        {s.suspicionLevel}%
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Evidencias Clave y Lugares */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Evidencias Colectadas y Escenarios de Inspección</h2>
            <div className={styles.twoCols}>
              <div>
                <h3 className={styles.subTitle}>Evidencias Materiales y Digitales:</h3>
                <ul className={styles.list}>
                  {caseData.evidence.map((ev) => (
                    <li key={ev.id}>
                      <strong>[{ev.type.toUpperCase()}]</strong> {ev.description} — <em>Hallada en: {ev.place}</em>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={styles.subTitle}>Lugares Inspeccionados:</h3>
                <ul className={styles.list}>
                  {caseData.places.map((pl) => (
                    <li key={pl.id}>
                      <strong>{pl.name}:</strong> {pl.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Veredicto y Deduccion Logica */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Dictamen Pericial y Cadena Deductiva (Motor Prolog)</h2>
            <div className={styles.verdictBox}>
              {accusationResult ? (
                <>
                  <div className={styles.verdictHeader}>
                    <strong>Resultado de la Acusación:</strong>{" "}
                    <span className={accusationResult.correct ? styles.textSuccess : styles.textDanger}>
                      {accusationResult.correct ? "ACUSACIÓN FUNDAMENTADA Y CORRECTA" : "ACUSACIÓN DISCORDANTE"}
                    </span>
                  </div>
                  <p>{accusationResult.message}</p>
                  {accusationResult.culpritName && !accusationResult.correct && (
                    <p>Responsable lógico deducido por Prolog: <strong>{accusationResult.culpritName}</strong></p>
                  )}
                  {accusationResult.rules && accusationResult.rules.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <strong>Reglas de Inferencia Lógica Aplicadas:</strong>
                      <ul className={styles.rulesList}>
                        {accusationResult.rules.map((r, i) => (
                          <li key={i}><code>{r}</code></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p>
                    El motor de inferencia lógica de Prolog procesó la conjunción de reglas de acceso, oportunidad,
                    motivos económicos/laborales, posesión de herramientas y contraste de testimonios con grabaciones perimetrales.
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <strong>Reglas Principales del Sistema Experto:</strong>
                    <ul className={styles.rulesList}>
                      <li><code>tuvo_acceso(Persona, Caso)</code>: Verificación de presencia perimetral.</li>
                      <li><code>tuvo_oportunidad(Persona, Caso)</code>: Coincidencia temporal con el intervalo del incidente.</li>
                      <li><code>posee_motivo(Persona, Caso)</code>: Existencia de interés o conflicto material.</li>
                      <li><code>posee_medios(Persona, Caso)</code>: Disposición de herramientas físicas o técnicas.</li>
                      <li><code>coartada_invalida(Caso, Persona)</code>: Descarte de justificación por contradicción.</li>
                      <li><code>culpable(Persona, Caso)</code>: Demostración formal de culpabilidad lógica.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Bitacora de Acciones */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Bitácora Cronológica de Actuaciones del Detective</h2>
            {log.length === 0 ? (
              <p className={styles.emptyLog}>No se registraron actuaciones manuales adicionales en la bitácora.</p>
            ) : (
              <div className={styles.logTableWrap}>
                <table className={styles.logTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "130px" }}>Hora</th>
                      <th>Actuación Realizada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.map((entry) => (
                      <tr key={entry.id}>
                        <td className={styles.logTimeCell}>{entry.timestamp}</td>
                        <td>{entry.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Firmas de Cierre */}
          <div className={styles.signatures}>
            <div className={styles.signLine}>
              <div className={styles.signBorder}></div>
              <span>Firma Detective a Cargo</span>
            </div>
            <div className={styles.signLine}>
              <div className={styles.signBorder}></div>
              <span>Sello de Validación Pericial (Prolog Engine)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
