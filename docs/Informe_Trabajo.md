# INFORME DE DISTRIBUCIÓN DE TRABAJO GRUPAL
**Proyecto 1: Sistema Experto de Investigación Criminal - Logic Detective**  
**Facultad de Ingeniería - Universidad de San Carlos de Guatemala**  
**Escuela de Ciencias y Sistemas - Inteligencia Artificial 1 | Sección A**  
**Segundo Semestre 2026 | Grupo 9**

---

## 1. RESUMEN DE DISTRIBUCIÓN DEL TRABAJO

El proyecto fue desarrollado de forma colaborativa y modular, asignando formalmente las 5 responsabilidades técnicas y la posterior fase de optimizaciones, corrección de errores y despliegue:

| Integrante / Carnet | Responsabilidad Asignada | Resumen de Tareas Realizadas | % Participación |
|---|---|---|:---:|
| **Integrante 1 (201700866)** | **Responsabilidad 1** (Acceso, oportunidad y backend) | Hechos de lugares, horarios y accesos; reglas `tuvo_acceso/2`, `tuvo_oportunidad/2`; conexión base Python-PySwip y consultas de líneas temporales. | **20%** |
| **Integrante 2 (202001076)** | **Responsabilidad 2** (Motivos, medios y módulo administrativo) | Hechos de motivos, herramientas y evidencias; reglas `posee_motivo/2`, `posee_medios/2`; desarrollo del CRUD administrativo y persistencia de datos. | **20%** |
| **Integrante 3 (201700686)** | **Responsabilidad 3** (Coartadas e interfaz de investigación) | Hechos de coartadas, testigos y cámaras; reglas `coartada_valida/2`, `coartada_invalida/2`; interfaz web base del detective, pistas y bitácora de acciones. | **20%** |
| **Integrante 4 (202001950)** | **Responsabilidad 4** (Contradicciones, declaraciones y pruebas) | Hechos de declaraciones; reglas `contradice_evidencia/2`, `contradice_declaracion/3`, `dio_informacion_falsa/2`, `posibles_complices/4` y suite de pruebas unitarias automatizadas. | **20%** |
| **Integrante 5 (202202768)** | **Responsabilidad 5** (Corrección de errores, Interrogatorio Progresivo, Informe PDF, Docker y despliegue) | Corrección de procedimientos estáticos y errores dinámicos en Prolog (`:- dynamic`); desarrollo del sistema de interrogatorio interactivo con 4 líneas de investigación y aumento progresivo de sospecha en tiempo real; implementación y exportación del Informe Pericial Forense en PDF; Dockerización multicontenedor (`docker-compose.yml`); pipeline de CI/CD en GitHub Actions; despliegue en AWS EC2 y redacción de manuales técnicos. | **20%** |
| **TOTAL** | | | **100%** |

---

## 2. DESGLOSE DETALLADO DE RESPONSABILIDADES Y ENTREGABLES

### Responsabilidad 1: Acceso, oportunidad y backend (20%) — *Asignada a: 201700866*
* **Archivos Implementados:** `app/prolog/acceso_oportunidad.pl`, `app/prolog/data/acceso_oportunidad_data.pl`, `app/routers/responsabilidad1.py`, `tests/test_responsabilidad1.py`, `docs/RESPONSABILIDAD_1_DOCUMENTACION.md`.
* **Tareas y Entregables:**
  1. **Hechos en Prolog:** Definición de `ubicacion_incidente/2` y `horario_incidente/3` para los 3 casos, reutilizando hechos existentes de `persona/4`, `lugar/3`, `registro_acceso/6` y `linea_tiempo/4`.
  2. **Reglas de Inferencia Lógica:**
     * `hora_a_minutos(Hora, Minutos)`: Conversión de cadenas 'HH:MM' a minutos enteros.
     * `hora_en_intervalo(Hora, Inicio, Fin)`: Comparación temporal con soporte de intervalos que cruzan medianoche.
     * `tuvo_acceso(Persona, Caso)`: Deducción lógica de presencia física en la ubicación del incidente.
     * `tuvo_oportunidad(Persona, Caso)`: Deducción lógica de presencia en la escena durante el intervalo temporal del delito.
  3. **Desarrollo del Router en FastAPI (`responsabilidad1.py`):**
     * `GET /api/casos/{caso_id}/sospechosos`
     * `GET /api/casos/{caso_id}/lugares`
     * `GET /api/casos/{caso_id}/linea-tiempo`
     * `GET /api/casos/{caso_id}/accesos` (consulta `tuvo_acceso/2`)
     * `GET /api/casos/{caso_id}/oportunidades` (consulta `tuvo_oportunidad/2`)
  4. **Pruebas Automatizadas:** Creación de 10 pruebas unitarias con `pytest` en `tests/test_responsabilidad1.py` validando inferencias lógicas y respuestas de endpoints.

---

### Responsabilidad 2: Motivos, medios y módulo administrativo (20%) — *Asignada a: 202001076*
* **Tareas y Entregables:**
  1. Registro en Prolog de los motivos, herramientas, objetos y evidencias (`motivos_medios_data.pl`, `evidencias_data.pl`).
  2. Implementación de reglas de inferencia: `posee_motivo/2`, `posee_medios/2`, `medio_fisico/2`, `medio_tecnico/2`, `medio_conocimiento/2` y `evidencia_relacionada/3`.
  3. Creación del módulo administrativo en frontend (`Admin.jsx`) y backend (`admin.py`).
  4. Implementación del registro, modificación y eliminación de casos, sospechosos, evidencias y declaraciones en Prolog (`crud.pl`).
  5. Diseño del almacenamiento de datos en archivos `.pl`.
  6. Realización de pruebas funcionales del módulo administrativo.

---

### Responsabilidad 3: Coartadas e interfaz de investigación (20%) — *Asignada a: 201700686*
* **Tareas y Entregables:**
  1. Registro en Prolog de coartadas, testigos, cámaras y registros de acceso.
  2. Implementación de reglas de evaluación de coartadas: `coartada_valida/2` y `coartada_invalida/2`.
  3. Creación de la interfaz principal del detective (`InvestigationDashboard.jsx`).
  4. Visualización estructurada de casos, sospechosos, lugares, evidencias, testimonios y pistas.
  5. Implementación de la acusación final y visualización del resultado (`AccusationModal.jsx`).
  6. Registro de las actuaciones del usuario en la bitácora (`/api/log`).

---

### Responsabilidad 4: Contradicciones, declaraciones y pruebas (20%) — *Asignada a: 202001950*
* **Archivos Implementados:** `app/prolog/declaraciones_contradicciones.pl`, `app/prolog/data/declaraciones_data.pl`, `app/routers/api_contradicciones.py`, `tests/test_api_contradicciones.py`, `tests/test_contradicciones_prolog.py`, `docs/RESPONSABILIDAD_4_DOCUMENTACION.md`, `docs/GUIA_EVALUACION_RESPONSABILIDAD_4.md`.
* **Tareas y Entregables:**
  1. **Hechos en Prolog:** Modelado de hechos estructurados con `declaracion/6` (testimonios y coartadas afirmadas), `registro_ubicacion_real/5` (fuentes objetivas de cámaras y logs) y `relacion_previa/4` (vínculos entre sospechosos).
  2. **Reglas de Inferencia Lógica:**
     * `contradice_evidencia(Caso, Persona, Evidencia, Detalle)`: Inferencia de incongruencia entre declaración y registros reales/evidencias.
     * `contradice_declaracion_testigo(Caso, PersonaMentirosa, Testigo, Detalle)`: Contraste de declaraciones entre involucrados.
     * `dio_informacion_falsa(Caso, Persona, Razon)`: Deducción formal de testimonios desmentidos.
     * `posibles_complices(Caso, SospechosoPrincipal, Complice, Razon)`: Inferencia de redes de complicidad y conspiración.
  3. **Desarrollo del Router en FastAPI (`api_contradicciones.py`):**
     * `GET /api/health`
     * `GET /api/declaraciones/{caso_id}`
     * `GET /api/contradicciones/{caso_id}`
     * `GET /api/informacion-falsa/{caso_id}`
     * `GET /api/complices/{caso_id}/{sospechoso}`
  4. **Pruebas Automatizadas:** Creación de suite completa con 13 pruebas unitarias en `pytest` cubriendo casos positivos, negativos y casos de borde.

---

### Responsabilidad 5: Corrección de errores, Interrogatorio Progresivo, Informe PDF, Docker y despliegue (20%) — *Asignada a: 202202768*
* **Tareas y Entregables:**
  1. **Corrección de Errores Críticos e Integración de Prolog:**
     * Solución de errores de permisos y procedimientos estáticos (`permission_error(modify, static_procedure, ...)`) al crear y borrar casos, declarando directivas dinámicas globales (`:- dynamic`).
     * Corrección de aridades y sincronización de predicados (`camara/6`, `testigo/5`, `registro_acceso/6`, `linea_tiempo/4`, `testimonio/4`) para que los casos nuevos se pueblen al 100% en todas las pestañas.
  2. **Sistema de Interrogatorio Progresivo Interactivo:**
     * Implementación del diálogo estructurado en 4 líneas de investigación (Coartada, Móvil, Medios, Confrontación pericial) en `SuspectCard.jsx`.
     * Cálculo y aumento dinámico del porcentaje de sospecha en tiempo real sincronizado con la barra lateral izquierda y persistencia entre cambios de pestañas.
  3. **Generador y Exportador de Informe Pericial Forense en PDF:**
     * Desarrollo del componente `CaseReportModal.jsx` con resumen ejecutivo, cuadro de sospechosos, justificación deductiva de Prolog y bitácora completa.
     * Implementación de ventana de impresión aislada (`window.print()`) optimizada para guardar el informe en PDF con formato oficial sin páginas en blanco.
  4. **Dockerización Multicontenedor:**
     * Configuración del `Dockerfile` de Backend (Python 3.11-slim + SWI-Prolog-nox + libffi).
     * Configuración del `Dockerfile` multi-stage de Frontend (Vite build + Nginx Alpine en puerto 80).
     * Orquestación de servicios en `docker-compose.yml`.
  5. **Pipeline de CI/CD y Pruebas Automatizadas:**
     * Creación del flujo de GitHub Actions (`ci.yml`) con ejecución de suite de 25 pruebas unitarias y validación de build.
  6. **Despliegue en AWS EC2 y Documentación Técnica:**
     * Despliegue de la solución en la nube de Amazon Web Services (AWS EC2).
     * Redacción del Manual Técnico (`Manual_Tecnico.md`), Manual de Usuario (`Manual_Usuario.md`) y soporte de diagramas.

---

## 3. CONCLUSIÓN GRUPAL

La división del trabajo permitió estructurar el sistema experto en componentes independientes pero perfectamente acoplados a través de las consultas a Prolog y la API REST. Cada integrante cumplió con el 100% de los criterios de aceptación técnicos y funcionales establecidos en el enunciado del Proyecto 1.
