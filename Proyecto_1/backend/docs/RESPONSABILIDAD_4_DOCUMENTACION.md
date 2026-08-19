# Documentación Responsabilidad 4: Contradicciones, Declaraciones y Pruebas Automatizadas

## Descripción General
Esta sección documenta la implementación completa de la **Responsabilidad 4** para el proyecto **Logic Detective**. 
Se encarga del registro de declaraciones y testimonios en Prolog, inferencia de contradicciones contra evidencias físicas o digitales, detección de mentiras/información falsa, inferencia de posibles cómplices y el desarrollo del suite de pruebas automatizadas en Python.

---

## 1. Módulo Prolog (`declaraciones_contradicciones.pl`)

### Predicados de Hechos
- `declaracion(Caso, Persona, Afirmacion, HoraInicio, HoraFin, LugarAfirmado)`: Registra testimonios de sospechosos o testigos.
- `registro_ubicacion_real(Caso, Persona, Hora, LugarReal, Fuente)`: Registra ubicaciones objetivas (cámaras, logs digitales, recibos).
- `relacion_previa(Caso, Persona1, Persona2, TipoRelacion)`: Registra alianzas o contactos previos entre involucrados.

### Reglas de Inferencia Lógica
1. `contradice_evidencia(Caso, Persona, Evidencia, Detalle)`:
   Infiere si la ubicación afirmada por una persona en su declaración no coincide con el registro real respaldado por una evidencia física/digital.
2. `contradice_declaracion_testigo(Caso, PersonaMentirosa, Testigo, Detalle)`:
   Infiere cuando un testigo desmiente la ubicación o coartada manifestada por otro sospechoso.
3. `dio_informacion_falsa(Caso, Persona, Razon)`:
   Determina si un sospechoso mintió en el expediente basándose en contradicciones con evidencias o testimonios desmentidos.
4. `posibles_complices(Caso, SospechosoPrincipal, Complice, Razon)`:
   Infiere cómplices del sospechoso principal considerando relaciones previas (mercado negro, dinero, acuerdos).

---

## 2. API Backend (`app/routers/contradicciones.py` y `app/prolog_service.py`)

Se conectó el motor lógic Prolog con Python utilizando `PySwip` a través de endpoints REST en FastAPI:

- **`GET /api/casos/{caso_id}/declaraciones`**: Obtiene las declaraciones filtradas por caso y opcionalmente por persona.
- **`GET /api/casos/{caso_id}/contradicciones`**: Ejecuta las consultas lógicas `contradice_evidencia/4` y retorna la lista detallada de discrepancias.
- **`GET /api/casos/{caso_id}/informacion-falsa`**: Identifica los sospechosos que proporcionaron información falsa según Prolog.
- **`GET /api/casos/{caso_id}/complices`**: Infiere y retorna los posibles cómplices de un sospechoso principal.

---

## 3. Pruebas Automatizadas (Pytest)

Se implementaron 13 pruebas automatizadas cubriendo casos de prueba positivos y negativos:

### Casos Positivos
- **Caso 1**: Elena Rios (`suspect-2`) desmentida por cámaras en el museo (`ev-1`).
- **Caso 1**: Carmen Lozano (`suspect-4`) desmentida por recibo en farmacia (`ev-2`).
- **Caso 1**: Carmen Lozano inferida como cómplice de Elena Rios por relación en mercado negro.
- **Caso 2**: Viktor Sorokin (`suspect-b3`) desmentido por cámaras en el aparcamiento (`ev-b4`).

### Casos Negativos
- **Caso 1**: Marco Villanueva (`suspect-1`) con coartada limpia no genera contradicciones falsas.
- **Caso Inexistente**: Consultar `caso-invalido-999` retorna lista vacía sin arrojar excepciones.
- **Sospechoso Sin Cómplices**: Buscar cómplices para `suspect-3` retorna lista vacía.

### Resultado de Ejecución de Pruebas
```text
tests/test_api_contradicciones.py ......                                 [ 46%]
tests/test_contradicciones_prolog.py .......                             [100%]

============================= 13 passed in 1.38s ==============================
```
