# MANUAL DE USUARIO - LOGIC DETECTIVE
**Guía Oficial para el Detective y Administrador del Sistema**  
**Facultad de Ingeniería - Universidad de San Carlos de Guatemala**  
**Inteligencia Artificial 1 - Sección A | Segundo Semestre 2026**  
**Grupo 9**

---

## 1. INTRODUCCIÓN Y OBJETIVO DEL SISTEMA

Bienvenido a **Logic Detective**, una plataforma interactiva de investigación criminal impulsada por un motor de Inteligencia Artificial basado en lógica simbólica de primer orden (**SWI-Prolog**).

Como detective, tu objetivo es recolectar pruebas, interrogar sospechosos, confrontar testimonios y descubrir al culpable mediante deducción lógica formal. Al final, el motor de inferencia de Prolog evaluará tu acusación y fundamentará el resultado con la cadena de reglas lógicas demostradas.

---

## 2. NAVEGACIÓN PRINCIPAL

La aplicación cuenta con una barra de navegación superior accesible en todo momento:

* **Inicio (`/`):** Portada informativa del sistema, explicación de la metodología y acceso directo a los casos destacados.
* **Casos (`/cases`):** Catálogo de casos disponibles para resolver, clasificados por nivel de dificultad.
* **Admin (`/admin`):** Panel de control para que los administradores gestionen, creen y eliminen casos en la base de conocimiento de Prolog.

![Inicio](./image/Screenshot%202026-08-25%20220339.png)

---

## 3. GUÍA PASO A PASO: MODO DETECTIVE

### Paso 1: Selección del Caso
1. Ingresa a la sección **Casos**.
2. Filtra por dificultad (**Todos**, **Facil**, **Medio**, **Dificil**).
3. Revisa la cantidad de sospechosos, evidencias y lugares disponibles.
4. Haz clic en **"Iniciar Investigación →"** para abrir el expediente.

![Casos](./image/Screenshot%202026-08-25%20220610.png)

---

### Paso 2: El Dashboard de Investigación
El panel de investigación se divide en dos secciones principales:
* **Barra Lateral Izquierda:**
  * **Caso Activo:** Título y dificultad.
  * **Nivel de Sospecha en Vivo:** Muestra barras de porcentaje de cada sospechoso que aumentan dinámicamente según tus interrogatorios.
  * **Bitácora:** Registro en tiempo real de cada una de tus acciones con hora exacta.
* **Panel Central con Pestañas de Investigación:**
  * **Descripción:** Resumen de los hechos y cifras clave del expediente.
  * **Sospechosos:** Tarjetas interactivas de cada persona de interés.
  * **Evidencias:** Pruebas físicas, digitales, documentales y químicas recolectadas.
  * **Lugares:** Áreas de la escena del crimen para inspeccionar.
  * **Cronología:** Línea de tiempo con los sucesos clave de la noche del crimen.
  * **Testimonios:** Declaraciones recopiladas de testigos presenciales.
  * **Coartadas:** Cuadro de coartadas evaluadas deductivamente por Prolog.
  * **Cámaras:** Grabaciones de seguridad y monitoreo perimetral.
  * **Accesos:** Registros de tarjetas maestras, cerraduras y biometría.
  * **Relaciones:** Consulta de vínculos previos, relaciones y redes de complicidad entre personas del caso.
  * **Contradicciones:** Lista de contradicciones lógicas detectadas por Prolog entre declaraciones y pruebas.
  * **Pistas:** Sistema de pistas asistidas por el motor de IA.

![Investigacion](./image/Screenshot%202026-08-25%20220754.png)
---

### Paso 3: Interrogatorio Progresivo de Sospechosos
Cada sospechoso inicia con estado **"Sin interrogar · Sospecha desconocida"** (`?%`).

1. Haz clic en el botón **`Interrogar (0/4)`** de la tarjeta del sospechoso.
2. Selecciona una de las **4 Líneas de Interrogatorio**:
   * **1. *"¿Dónde se encontraba a la hora del incidente?"*:**  
     ➔ Descubre la coartada alegada y el dictamen inicial de Prolog.
   * **2. *"¿Tenía algún interés personal, conflicto o motivo en este asunto?"*:**  
     ➔ Indaga sobre el móvil (deudas, dinero, venganza, espionaje). Si Prolog confirma el motivo, el porcentaje de sospecha aumenta.
   * **3. *"¿Disponía de llaves, accesos o conocimientos para cometer el acto?"*:**  
     ➔ Indaga sobre los medios (llaves maestras, ganzúa, accesos de TI). Si posee los medios, la sospecha sube.
   * **4. *"Confrontar con evidencias periciales y grabaciones de cámaras"***:  
     ➔ Cruza lo dicho con las grabaciones perimetrales. Si mintió, Prolog lo desmiente y su sospecha se eleva al 100%.

> **Nota:** También dispones del botón **`Analizar Todo en Prolog`** para ejecutar la inferencia completa inmediata de todas las reglas del sospechoso.

![Interrogar](./image/Screenshot%202026-08-25%20221034.png)
---

### Paso 4: Sistema de Pistas
* Si necesitas orientación en el caso, dirígete a la pestaña **Pistas**.
* Haz clic en **`Solicitar Pista`**.
* Cuentas con un máximo de **3 pistas por caso**. Cada solicitud quedará registrada en la bitácora del caso.

![Pistas](./image/Screenshot%202026-08-25%20221331.png)
---

### Paso 5: Emisión de la Acusación Final
1. Cuando hayas determinado al responsable con base en las pruebas, haz clic en el botón rojo **`Emitir Acusación Final`** en la esquina inferior derecha.
2. Selecciona al sospechoso que consideras culpable.
3. Haz clic en **`Confirmar Acusación`**.
4. **Veredicto de Prolog:**
   * **Si acertaste:** Se mostrará **"¡Caso Resuelto!"** junto a la justificación y lista de reglas lógicas activadas (`tuvo_acceso`, `tuvo_oportunidad`, `posee_motivo`, `posee_medios`, `coartada_invalida`, `culpable`).
   * **Si fallaste:** Se mostrará **"Acusación Incorrecta"**, indicando quién era el verdadero responsable deducido por Prolog y sus motivos.

![Veredicto](./image/Screenshot%202026-08-25%20221431.png)
---

### Paso 6: Generación e Impresión del Informe Pericial
En cualquier momento de la investigación o al finalizar una acusación, puedes pulsar el botón **`Generar Informe Pericial`**:
* Se abrirá el **Informe Pericial de Investigación** con formato forense formal.
* Incluye: Resumen ejecutivo, cuadro de sospechosos, evidencias clasificadas, dictamen de Prolog con reglas demostradas, y la bitácora completa de actuaciones con firmas de cierre.
* Haz clic en **`Imprimir / Guardar en PDF`** para abrir la ventana nativa de impresión y guardarlo como un archivo PDF oficial.

![Informe](./image/Screenshot%202026-08-25%20221545.png)
---

## 4. GUÍA DEL PANEL ADMINISTRATIVO (ADMIN)

El Panel Administrativo (`/admin`) permite gestionar la base de conocimiento de Prolog sin necesidad de escribir código directamente en los archivos `.pl`.

### 4.1 Crear un Nuevo Caso en Prolog
1. Haz clic en el botón **`+ Nuevo Caso Estructurado`**.
2. **Opción rápida:** Pulsa **`Cargar Plantilla de Ejemplo`** para precargar un caso completo ("El Robo del Prototipo Cuántico") con datos listos para inferencia en Prolog.
3. **Opción personalizada:** Completa las 4 pestañas del formulario:
   * **1. Información:** Título, nivel de dificultad (Fácil, Medio, Difícil) y descripción de los hechos.
   * **2. Sospechosos:** Agrega sospechosos con su nombre, rol, declaración de coartada, y selecciona desde los menús desplegables su **Móvil** (Deudas, Espionaje, Venganza, Mercado Negro) y sus **Medios** (Llaves maestras, Alarmas, Servidor TI, Ganzúa, Somnífero).
   * **3. Evidencias:** Agrega pruebas clasificando su tipo (Física, Digital, Documental, Testimonial, Química) y lugar de hallazgo.
   * **4. Lugares:** Registra las áreas de interés del incidente.
4. Haz clic en **`Guardar Caso en Prolog`**. El caso se persistirá en los archivos de datos de Prolog y estará disponible inmediatamente para ser investigado.

![Crear Caso](./image/Screenshot%202026-08-25%20223417.png)

### 4.2 Investigar, Editar y Eliminar Casos
* **Investigar:** Haz clic en el botón **`Investigar`** de la tabla para abrir directamente el expediente en el panel de detective.
* **Editar:** Haz clic en el botón **`Editar`** para abrir el formulario con los datos cargados del caso, permitiendo modificar su título, dificultad, descripción, sospechosos, evidencias y lugares, y guardar los cambios directamente en Prolog.
* **Borrar:** Haz clic en el botón **`Borrar`** para eliminar el caso de la memoria y disco de Prolog (limpiando todos los hechos asociados de personas, evidencias, coartadas y registros sin dejar datos huérfanos).

![Investigar y Eliminar](./image/Screenshot%202026-08-25%20223337.png)
---

## 5. PREGUNTAS FRECUENTES Y SOPORTE

* **¿Cómo sé si una coartada es válida o falsa?**  
  Prolog la evalúa cruzando la declaración del sospechoso contra las grabaciones de cámaras y registros de acceso. Si el sospechoso afirmó estar en otro lugar pero una cámara o tarjeta lo registró en la escena, Prolog marcará su coartada como **Desmentida**.
* **¿Por qué un sospechoso inocente no sube su nivel de sospecha?**  
  Porque Prolog verifica que carece de motivos reales (`posee_motivo` = falso) y que su coartada no tiene contradicciones probatorias.
* **¿Puedo guardar el informe en PDF?**  
  Sí, al pulsar **`Imprimir / Guardar en PDF`** en el informe pericial, selecciona *"Guardar como PDF"* en el menú de destino de tu navegador.
