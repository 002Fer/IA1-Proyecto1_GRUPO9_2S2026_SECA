# GUÍA Y EXPLICACIÓN DETALLADA DE LA RESPONSABILIDAD 4
**Autor / Integrante:** Integrante 4 (Rama `202001950`)  
**Proyecto:** Logic Detective  
**Módulo:** Contradicciones, Declaraciones, Cómplices y Pruebas Automatizadas

---

## 📌 1. Resumen Ejecutivo de Cambios

Para cumplir con la **Responsabilidad 4**, se crearon y modificaron los siguientes archivos en la carpeta `Proyecto_1/backend`:

| Tipo | Archivo | Propósito / Descripción |
| :--- | :--- | :--- |
| **Prolog Data** | `app/prolog/data/declaraciones_data.pl` | Define los hechos de declaraciones, testimonios, ubicaciones reales (cámaras/logs) y relaciones previas. |
| **Prolog Reglas** | `app/prolog/declaraciones_contradicciones.pl` | Reglas lógicas principales: `contradice_evidencia/4`, `contradice_declaracion/4`, `dio_informacion_falsa/3` y `posibles_complices/4`. |
| **Prolog Main** | `app/prolog/main.pl` | Modificado para incluir/consultar el archivo de declaraciones y contradicciones. |
| **Python Service** | `app/prolog_service.py` | Servicio Wrapper en Python que ejecuta las consultas lógicas hacia Prolog usando **PySwip**. |
| **API Endpoints** | `app/routers/contradicciones.py` | Router de FastAPI con endpoints REST para exponer declaraciones, contradicciones, mentiras y cómplices. |
| **Python Main** | `main.py` | Configuración principal de FastAPI, CORS y registro del router de la Responsabilidad 4. |
| **Pruebas** | `tests/test_contradicciones_prolog.py` | Pruebas unitarias de las reglas de Prolog (7 casos positivos y negativos). |
| **Pruebas API** | `tests/test_api_contradicciones.py` | Pruebas de integración HTTP de la API REST (6 casos). |
| **Documentación** | `docs/RESPONSABILIDAD_4_DOCUMENTACION.md` | Documentación técnica con la explicación de reglas y resultados de pruebas. |

---

## 🧠 2. Explicación Detallada del Código (Preparación para Evaluación)

Esta sección explica cómo funciona cada componente para que puedas responder cualquier pregunta teórica o práctica.

---

### A. Base de Conocimiento en Prolog

#### 1. Estructura de los Hechos (`declaraciones_data.pl`)
Los hechos son la información primaria registrada en el sistema. Definimos 3 hechos fundamentales:

```prolog
% declaracion(Caso, Persona, Afirmacion, HoraInicio, HoraFin, LugarAfirmado).
declaracion('caso-1', 'suspect-2', 'Trabaje en mi taller privado toda la noche', '19:45', '06:00', 'taller_privado').

% registro_ubicacion_real(Caso, Persona, Hora, LugarReal, Fuente).
registro_ubicacion_real('caso-1', 'suspect-2', '21:30', 'Sala 3 - Galeria Principal', 'camara_exterior').

% relacion_previa(Caso, Persona1, Persona2, TipoRelacion).
relacion_previa('caso-1', 'suspect-2', 'suspect-4', 'contacto_mercado_negro').
```

- **¿Por qué usamos `registro_ubicacion_real`?**  
  Representa evidencias objetivas irrefutables (cámaras de seguridad, logs de acceso, recibos). Nos permite contrastar la versión subjetiva del sospechoso (`declaracion`) contra la evidencia física real.

---

#### 2. Reglas de Inferencia Lógica (`declaraciones_contradicciones.pl`)

##### Regla 1: `contradice_evidencia/4`
Determina si lo que afirma una persona es desmentido por una evidencia o registro real.

```prolog
contradice_evidencia(Caso, Persona, Evidencia, Detalle) :-
    declaracion(Caso, Persona, Afirmacion, _, _, LugarAfirmado),
    registro_ubicacion_real(Caso, Persona, HoraReal, LugarReal, Fuente),
    LugarAfirmado \= LugarReal,
    evidencia(Caso, Evidencia, _, _, LugarReal),
    atomic_list_concat([Persona, ' afirmo estar en ', LugarAfirmado, ' pero evidencia/registro (', Fuente, ') lo situa en ', LugarReal, ' a las ', HoraReal, '. Declaracion: "', Afirmacion, '"'], Detalle).
```

- **¿Cómo razona Prolog aquí?**
  1. Busca una `declaracion` de la `Persona` en el `Caso` donde afirme estar en `LugarAfirmado`.
  2. Busca un `registro_ubicacion_real` que ubique a esa persona en `LugarReal`.
  3. Evalúa el operador de desigualdad `LugarAfirmado \= LugarReal`. Si son diferentes, hay contradicción.
  4. Unifica la `Evidencia` que corresponde a ese `LugarReal`.
  5. Construye el texto explicativo formateado con `atomic_list_concat/2`.

##### Regla 2: `dio_informacion_falsa/3`
Un sospechoso ha proporcionado información falsa si su versión contradice las evidencias del lugar o la declaración desmentida por un testigo.

```prolog
dio_informacion_falsa(Caso, Persona, Razon) :-
    contradice_evidencia(Caso, Persona, Evidencia, DetalleEv),
    atomic_list_concat(['Informacion falsa respecto a evidencia ', Evidencia, ': ', DetalleEv], Razon).
```

##### Regla 3: `posibles_complices/4`
Infiere qué personas actuaron en complicidad basándose en relaciones previas registradas.

```prolog
posibles_complices(Caso, Principal, Complice, Razon) :-
    relacion_previa(Caso, Principal, Complice, TipoRel),
    Principal \= Complice,
    atomic_list_concat([Complice, ' es posible complice de ', Principal, ' debido a relacion previa (', TipoRel, ') en el caso.'], Razon).
```

---

### B. Integración Python–Prolog con PySwip (`prolog_service.py`)

**PySwip** es un puente (bridge) en Python que permite enviar consultas escritas en lenguaje Prolog al motor SWI-Prolog y recibir los resultados en estructuras de datos de Python (`list` y `dict`).

#### ¿Cómo se ejecuta una consulta PySwip?

```python
from pyswip import Prolog

prolog = Prolog()
prolog.consult("app/prolog/main.pl")

# Ejecutar la consulta en Prolog
resultados = list(prolog.query("contradice_evidencia('caso-1', Persona, Evidencia, Detalle)"))
```

- **Manejo de Cadenas de Texto / Bytes:**  
  En Python 3, PySwip suele retornar átomos de Prolog como objetos tipo `bytes`. En `prolog_service.py` aplicamos decodificación `.decode()` para garantizar que la API devuelva texto JSON limpio:
  ```python
  Detalle = r["Detalle"].decode() if isinstance(r["Detalle"], bytes) else str(r["Detalle"])
  ```

---

### C. API REST en FastAPI (`routers/contradicciones.py`)

Creamos los endpoints HTTP exigidos utilizando FastAPI:

1. **`GET /api/casos/{caso_id}/declaraciones`**:  
   Muestra todas las declaraciones registradas para el caso o las filtradas por `persona_id`.
2. **`GET /api/casos/{caso_id}/contradicciones`**:  
   Invoca la regla `contradice_evidencia/4` de Prolog y responde con el total de contradicciones y el desglose de evidencias que las causaron.
3. **`GET /api/casos/{caso_id}/informacion-falsa`**:  
   Invoca `dio_informacion_falsa/3` y responde con la lista de personas que mintieron y la razón explicada.
4. **`GET /api/casos/{caso_id}/complices`**:  
   Invoca `posibles_complices/4` indicando el `sospechoso_principal` para deducir quiénes son sus cómplices lógicos.

---

### D. Estrategia de Pruebas Automatizadas (Pytest)

Las pruebas automatizadas son fundamentales para garantizar la calidad del software y responder con certeza sobre la precisión del sistema experto.

Se dividen en **Pruebas Positivas** y **Pruebas Negativas**:

#### 1. Pruebas Positivas (Verifican que el sistema detecte los culpables/contradicciones reales)
- **Ejemplo**: Elena Rios (`suspect-2`) en el Caso 1 afirma estar en su taller toda la noche, pero las cámaras la graban en el museo a las 21:30.  
  - *Assert esperado:* `assert 'suspect-2' in sospechosos_contradichos` $\rightarrow$ **PASA**.
- **Ejemplo Cómplices**: Infección de Carmen Lozano (`suspect-4`) como cómplice de Elena Rios por nexo en mercado negro.  
  - *Assert esperado:* `assert 'suspect-4' in complices` $\rightarrow$ **PASA**.

#### 2. Pruebas Negativas (Verifican que no se generen falsos positivos)
- **Ejemplo Coartada Limpia**: Marco Villanueva (`suspect-1`) tiene coartada limpia en la cena del alcalde.  
  - *Assert esperado:* `assert 'suspect-1' not in sospechosos_contradichos` $\rightarrow$ **PASA** (Garantiza que no acusamos a inocentes).
- **Ejemplo Caso Inexistente**: Consultar `caso-invalido-999` debe devolver lista vacía `[]` sin romper el servidor.  
  - *Assert esperado:* `assert len(response) == 0` $\rightarrow$ **PASA**.

---

## ❓ 3. Preguntas Frecuentes de Evaluación y Cómo Responderlas

### Q1: ¿Por qué la lógica de inferencia de contradicciones se hace en Prolog y no en Python con `if/else`?
> **Respuesta:**  
> Porque el enunciado exige utilizar Inteligencia Artificial Simbólica basada en conocimiento. Prolog utiliza **unificación** y **resolución mediante encadenamiento hacia atrás**, lo que permite declarar reglas lógicas generales (`LugarAfirmado \= LugarReal`) en lugar de escribir código imperativo `if/else`. Python únicamente actúa como la capa de presentación y API REST.

### Q2: ¿Qué sucede si la librería nativa de SWI-Prolog no está presente en el entorno?
> **Respuesta:**  
> El servicio `prolog_service.py` incluye un patrón de tolerancia a fallos (*fallback*). Si PySwip no encuentra el ejecutable o biblioteca de SWI-Prolog en el sistema operativo, captura la excepción y conmuta automáticamente a respuestas de respaldo basadas en la misma estructura lógica, evitando que la API de FastAPI falle.

### Q3: ¿Cómo diferencian una contradicción con evidencia de una mentira de sospechoso?
> **Respuesta:**  
> Una contradicción (`contradice_evidencia/4`) es el choque directo entre el testimonio y una prueba objetiva. La regla `dio_informacion_falsa/3` toma esa contradicción y la clasifica formalmente como una afirmación falsa atribuible al sospechoso, generando una justificación detallada para el informe final de la investigación.

---

## 🚀 4. Comandos Clave para Demostración

- **Ejecutar Pruebas Automatizadas:**
  ```bash
  cd Proyecto_1/backend
  python -m pytest tests/
  ```

- **Iniciar el Servidor Backend en Vivo:**
  ```bash
  cd Proyecto_1/backend
  python main.py
  ```
  *Documentación interactiva disponible en `http://localhost:8000/docs`.*
