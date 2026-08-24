# Responsabilidad 1 - Acceso, oportunidad y backend

## 1. Objetivo

La Responsabilidad 1 se enfoca en el manejo de lugares, horarios, accesos y ubicaciones dentro de los casos de investigación de Logic Detective.

También incluye las reglas de inferencia necesarias para determinar qué sospechosos tuvieron acceso a un lugar relacionado con el incidente y cuáles realmente tuvieron oportunidad de participar considerando el lugar y el horario.

Además, esta responsabilidad incorpora las consultas del backend para obtener sospechosos, lugares, líneas temporales, accesos y oportunidades mediante la integración entre Python y Prolog.

---

## 2. Archivos implementados

### Prolog

- `app/prolog/acceso_oportunidad.pl`
- `app/prolog/data/acceso_oportunidad_data.pl`

También se agregó la carga de estos archivos en:

- `app/prolog/main.pl`

### Python

- `app/routers/responsabilidad1.py`

También se registró el router en:

- `main.py`

### Pruebas

- `tests/test_responsabilidad1.py`

---

## 3. Datos utilizados en Prolog

Para evitar duplicar información ya existente en el proyecto, se reutilizaron los hechos de personas, lugares, registros de acceso y líneas temporales previamente integrados en la base de conocimiento.

La Responsabilidad 1 agrega la información necesaria para relacionar cada caso con las ubicaciones relevantes del incidente y con su intervalo de tiempo.

Ejemplo:

```prolog
ubicacion_incidente('caso-1', 'Sala 3 - Galeria Principal').

horario_incidente('caso-1', '22:15', '23:45').
```

También se definieron ubicaciones y horarios para los tres casos disponibles en el proyecto.

---

## 4. Conversión y comparación de horarios

Los horarios existentes se encuentran en formato `HH:MM`.

Para poder comparar un registro de acceso contra el intervalo de tiempo de un incidente, se implementó la conversión de la hora a minutos.

```prolog
hora_a_minutos(Hora, Minutos) :-
    atomic_list_concat([Horas, MinutosTexto], ':', Hora),
    atom_number(Horas, H),
    atom_number(MinutosTexto, M),
    Minutos is H * 60 + M.
```

Posteriormente, `hora_en_intervalo/3` permite verificar si una hora se encuentra dentro del intervalo establecido para el incidente.

De esta forma, la oportunidad no depende únicamente de que exista un acceso, sino también del momento en el que ocurrió.

---

## 5. Regla tuvo_acceso/2

La regla:

```prolog
tuvo_acceso(Persona, Caso)
```

determina si un sospechoso posee un registro de acceso en una ubicación relacionada directamente con el incidente.

Para realizar la inferencia se utilizan:

- La persona registrada como sospechosa.
- Los registros de acceso existentes.
- Las ubicaciones relacionadas con el incidente.

No se declara directamente que una persona tuvo acceso. Prolog debe inferirlo a partir de los hechos disponibles.

### Resultados obtenidos

| Caso | Sospechosos con acceso |
|---|---|
| caso-1 | suspect-2 |
| caso-2 | suspect-b3, suspect-b4 |
| caso-3 | suspect-c1 |

---

## 6. Regla tuvo_oportunidad/2

La regla:

```prolog
tuvo_oportunidad(Persona, Caso)
```

agrega una condición temporal al acceso.

Para considerar que un sospechoso tuvo oportunidad deben cumplirse las siguientes condiciones:

1. La persona debe estar registrada como sospechosa.
2. Debe existir un registro de acceso.
3. El acceso debe corresponder a una ubicación relacionada con el incidente.
4. La hora del registro debe encontrarse dentro del intervalo definido para el incidente.

### Resultados obtenidos

| Caso | Sospechosos con oportunidad |
|---|---|
| caso-1 | suspect-2 |
| caso-2 | suspect-b3 |
| caso-3 | suspect-c1 |

---

## 7. Diferencia entre acceso y oportunidad

Una de las pruebas utilizadas para comprobar la diferencia entre ambos conceptos fue `suspect-b4` en `caso-2`.

El sospechoso posee un registro de acceso al servidor a las `20:00`.

Por esta razón:

```prolog
tuvo_acceso('suspect-b4', 'caso-2').
```

devuelve verdadero.

Sin embargo, el intervalo definido para el incidente es:

```text
21:45 - 23:45
```

El acceso ocurrió antes de ese intervalo.

Por esta razón:

```prolog
tuvo_oportunidad('suspect-b4', 'caso-2').
```

devuelve falso.

Esta validación permite diferenciar entre una persona que tenía acceso a una ubicación y una persona cuya presencia también coincide con el momento en el que pudo suceder el incidente.

---

## 8. Integración Python - Prolog

El backend del proyecto utiliza FastAPI y PySwip.

La comunicación con Prolog se realiza mediante el servicio existente:

```text
app/prolog_service.py
```

Este servicio se encarga de cargar:

```text
app/prolog/main.pl
```

`main.pl` funciona como punto de entrada para la base de conocimiento y carga los diferentes archivos Prolog utilizados por el proyecto.

El flujo utilizado es:

```text
FastAPI
   |
   v
PrologService
   |
   v
PySwip
   |
   v
SWI-Prolog
   |
   v
main.pl
   |
   v
Hechos y reglas
```

Durante la preparación del entorno se verificó que la comunicación estuviera utilizando realmente PySwip y SWI-Prolog.

El resultado obtenido fue:

```text
PySwip activo: True
```

También se realizó desde Python una consulta real al predicado `caso/4`, obteniendo correctamente la información almacenada en Prolog.

---

## 9. Backend de Responsabilidad 1

El router correspondiente se encuentra en:

```text
app/routers/responsabilidad1.py
```

Los endpoints utilizan el prefijo:

```text
/api/resp1
```

Python se utiliza para recibir las solicitudes HTTP, ejecutar las consultas mediante `PrologService` y transformar los resultados a una respuesta que pueda ser consumida por la interfaz.

Las decisiones relacionadas con acceso y oportunidad continúan ejecutándose en Prolog.

---

## 10. Endpoints implementados

### Consulta de sospechosos

```http
GET /api/resp1/cases/{case_id}/suspects
```

Obtiene los sospechosos registrados para un caso.

En `caso-1` se comprobó la obtención de los cuatro sospechosos definidos.

---

### Consulta de lugares

```http
GET /api/resp1/cases/{case_id}/places
```

Obtiene los lugares registrados para el caso.

En `caso-1` se obtuvieron correctamente los cinco lugares requeridos.

---

### Consulta de línea temporal

```http
GET /api/resp1/cases/{case_id}/timeline
```

Obtiene los acontecimientos registrados en la línea temporal.

También se comprobó que el campo `suspicious` sea retornado como un valor booleano.

Para `caso-1` se obtuvieron diez acontecimientos.

---

### Consulta de accesos

```http
GET /api/resp1/cases/{case_id}/access
```

Utiliza la regla:

```prolog
tuvo_acceso(Persona, Caso)
```

y devuelve los sospechosos que cumplen la inferencia junto con los registros de acceso relacionados.

---

### Consulta de oportunidades

```http
GET /api/resp1/cases/{case_id}/opportunities
```

Utiliza la regla:

```prolog
tuvo_oportunidad(Persona, Caso)
```

y devuelve únicamente los sospechosos cuyo acceso coincide tanto con una ubicación relacionada como con el intervalo del incidente.

---

## 11. Validación de los tres casos

Se realizaron consultas desde el backend para los tres casos disponibles.

Los resultados obtenidos fueron:

```text
caso-1 | accesos: 1 | oportunidades: 1
caso-2 | accesos: 2 | oportunidades: 1
caso-3 | accesos: 1 | oportunidades: 1
```

Esto permitió comprobar que las reglas podían ser consultadas correctamente desde Python y que los resultados variaban según los hechos existentes para cada investigación.

---

## 12. Manejo de casos inexistentes

Los endpoints validan que el caso solicitado exista antes de realizar el resto de consultas.

Por ejemplo:

```text
/api/resp1/cases/caso-99/suspects
```

devuelve:

```text
HTTP 404
```

con el mensaje:

```text
Caso no encontrado
```

Esto evita ejecutar consultas sobre casos que no están registrados en la base de conocimiento.

---

## 13. Pruebas automatizadas

Se creó el archivo:

```text
tests/test_responsabilidad1.py
```

con diez pruebas específicas para este módulo.

Las pruebas realizadas cubren:

- Acceso positivo en el caso 1.
- Accesos existentes en el caso 2.
- Oportunidad en el caso 2.
- Caso donde existe acceso pero no oportunidad.
- Consulta de sospechosos.
- Consulta de lugares.
- Consulta de línea temporal.
- Consulta de accesos mediante la API.
- Consulta de oportunidades mediante la API.
- Consulta de un caso inexistente.

El resultado obtenido fue:

```text
10 passed
```

---

## 14. Pruebas de regresión

Después de integrar la Responsabilidad 1 también se ejecutó la suite completa de pruebas existentes en el backend.

El resultado fue:

```text
23 passed
```

Esto permitió comprobar que la incorporación de las reglas y endpoints de Responsabilidad 1 no afectó las funcionalidades previamente integradas por otros miembros del grupo.

No se encontraron regresiones durante estas pruebas.

---

## 15. Resultado final de la responsabilidad

La Responsabilidad 1 permite consultar desde el backend la información necesaria para analizar lugares, sospechosos y acontecimientos de una investigación.

También incorpora inferencias para diferenciar entre acceso y oportunidad.

La lógica principal de estas decisiones permanece en Prolog, mientras Python funciona como puente entre la aplicación y el motor lógico mediante PySwip.

La implementación fue comprobada directamente en SWI-Prolog, posteriormente mediante PySwip, mediante los endpoints de FastAPI y finalmente mediante pruebas automatizadas.