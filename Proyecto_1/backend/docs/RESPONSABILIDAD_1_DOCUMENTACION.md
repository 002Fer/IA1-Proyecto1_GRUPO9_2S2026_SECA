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

La Responsabilidad 1 agrega la información necesaria para relacionar cada caso con la ubicación principal del incidente y con su intervalo de tiempo.

Ejemplo:

```prolog
ubicacion_incidente('caso-1', 'Sala 3 - Galeria Principal').

horario_incidente('caso-1', '22:15', '23:45').