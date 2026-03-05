# Brokia — Workspace

## Propósito del proyecto
Brokia es un proyecto de tesis/producto orientado al **dominio de seguros automotores**, con foco en **formular, validar y medir** un núcleo de problema relevante antes de consolidar alcance de implementación.

El objetivo de esta carpeta es mantener **documentación persistente y trazable** sobre:
- hipótesis de problema,
- decisiones,
- evidencia (entrevistas/mediciones),
- métricas,
- y artefactos de soporte.

## Estructura de carpetas
- `problem-analysis/` — análisis de núcleos de problema, comparativos, formulaciones académicas, riesgos.
- `interviews/` — guías, plantillas, transcripciones, notas y evidencia de entrevistas.
- `decisions/` — decisiones explícitas (qué se elige, qué se descarta) con fecha, versión y fundamento.
- `metrics/` — definiciones operativas de métricas, líneas base, planillas, resultados y criterios de éxito.

## Convención de versionado
- **v0.x (exploratorio):** hipótesis y formulaciones en exploración; puede haber iteraciones frecuentes.
- **v1.x (validado):** hipótesis con evidencia suficiente (entrevistas/mediciones) y criterios de validación cumplidos.

## Regla operativa
- Toda **hipótesis** y toda **decisión** relevante debe persistirse por escrito en el workspace.
- No se asume que una conversación es almacenamiento: si es importante para la tesis, se documenta.

## Definición de “núcleo de problema”
Por “núcleo de problema” se entiende una formulación **delimitada, medible y segmentada** del dolor principal que se desea estudiar, tal que:
- define actores,
- define síntomas observables,
- propone métricas concretas,
- y permite validación empírica (línea base y post‑medición).

## Estado actual
**Fase actual:** validación de problema.
- Se prioriza: delimitación rigurosa del problema, hipótesis testeables, métricas y evidencia.
- Se evita: diseñar soluciones amplias o sobre‑definir alcance antes del cierre del Gate 1.
