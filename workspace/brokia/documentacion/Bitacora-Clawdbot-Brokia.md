# Bitácora inicial de implementación y trazabilidad académica — Clawdbot en Brokia

## 1. Introducción y propósito del registro

Este documento constituye la bitácora inicial del despliegue de automatizaciones asociadas a la tesis de Brokia, con foco en la construcción de trazabilidad técnica y valor académico verificable. Su objetivo es dejar evidencia estructurada de las decisiones de diseño, los componentes implementados, las dependencias operativas y los criterios de gobernanza utilizados en esta primera etapa.

Desde una perspectiva metodológica, la bitácora cumple tres funciones: (a) documentar el estado de avance con granularidad suficiente para auditoría, (b) sostener la reproducibilidad del proceso de investigación aplicada, y (c) facilitar la evaluación crítica de resultados, sesgos y limitaciones. En este marco, no se presenta únicamente un inventario de herramientas, sino una arquitectura funcional orientada a la producción de conocimiento, seguimiento de hitos y control de calidad de información.

La implementación actual integra canales de coordinación, extracción y curación de información, calendarización académica y automatización por tareas programadas. El estado reportado en esta versión es operativo, con componentes en uso y reglas explícitas de costos y priorización, lo cual permite iniciar un ciclo de observación sistemática sobre desempeño, utilidad y sostenibilidad.

## 2. Alcance de la etapa actual

La etapa registrada corresponde al montaje base de un ecosistema de asistencia para tesis, donde Clawdbot actúa como capa de orquestación de flujos de información y notificaciones. El alcance implementado incluye:

- **Briefing y alertas en Slack** como canal principal de consumo y monitoreo.
- **Calendario ORT** con hitos académicos y talleres relevantes para planificación.
- **Cron de automatizaciones** para research, briefings, alertas y sincronización documental.
- **Motor de búsqueda principal con Seax/Searx** y **fallback a Tavily** ante degradación, indisponibilidad o baja cobertura.
- **Curación de newsletters** bajo reglas de relevancia y costo.
- **Reglas de control económico** para evitar sobreconsumo en ejecución automatizada.

Se destaca que esta fase prioriza robustez operativa y trazabilidad por encima de sofisticación algorítmica. Es decir, primero se asegura continuidad de servicio, registro de eventos y criterios de decisión observables, para luego escalar en complejidad analítica.

## 3. Componentes implementados y valor académico

### 3.1. Slack briefing + alerts

La integración con Slack funciona como interfaz de reporte continuo y mecanismo de alerta temprana. El valor académico de este componente radica en la posibilidad de transformar eventos dispersos (nuevas fuentes, cambios de estado, alertas de ejecución) en unidades de seguimiento semiestructuradas, con timestamp y contexto.

En términos de trazabilidad, Slack permite:

- centralización de evidencia operativa;
- reconstrucción de secuencias de decisión;
- identificación de cuellos de botella o fallas recurrentes;
- comparación temporal entre periodos de mayor y menor actividad.

Esto habilita análisis posteriores no sólo sobre “qué produjo el sistema”, sino sobre “cómo y cuándo lo produjo”, aspecto clave para la validez en investigación aplicada.

### 3.2. Calendario ORT (hitos y talleres)

La incorporación del calendario ORT introduce una capa de alineación con el marco institucional de la tesis. Al registrar hitos, entregables y talleres en una estructura temporal compartida, se reduce el riesgo de descoordinación entre producción técnica y exigencias académicas.

Desde el punto de vista metodológico, el calendario cumple una función de **ancla temporal**. Permite evaluar si los outputs automáticos llegan en ventanas útiles para toma de decisiones (por ejemplo, preparación de avances, revisión de bibliografía o ajuste de hipótesis), y no únicamente si “funcionan” en términos técnicos.

### 3.3. Cron de research, briefing, alerts y doc-sync

La programación por cron es el núcleo de repetibilidad del sistema. Al definir frecuencias explícitas para research, briefings, alertas y sincronización documental, se minimiza la dependencia de ejecución manual y se asegura regularidad en la recolección y distribución de información.

Este componente aporta valor académico en tres niveles:

1. **Consistencia temporal:** permite comparar resultados entre ciclos homogéneos.
2. **Reducción de sesgo operativo:** disminuye variabilidad asociada a disponibilidad humana.
3. **Auditabilidad:** cada corrida puede asociarse a una marca temporal y a resultados observables.

Para etapas futuras, conviene consolidar una taxonomía de estados por tarea (éxito, parcial, fallback, error, omitido) para facilitar análisis cuantitativo de fiabilidad.

### 3.4. Search Searx con fallback Tavily

El diseño de búsqueda con proveedor principal y fallback responde a una necesidad de resiliencia informacional. Searx habilita agregación flexible y control de consulta; Tavily actúa como respaldo cuando la cobertura o disponibilidad del motor principal no es suficiente.

Académicamente, este esquema permite discutir calidad de evidencia y trazabilidad de fuentes: no sólo importa el resultado final, sino el **camino de obtención**. La existencia de fallback introduce una variable metodológica (origen alternativo de resultados) que debe quedar explícitamente registrada para evitar inferencias equivocadas sobre comparabilidad entre ciclos.

Se recomienda mantener metadatos mínimos por consulta: motor utilizado, hora, cantidad de resultados útiles y motivo de fallback (si aplica).

### 3.5. Curación de newsletters y reglas de costo

La curación de newsletters opera como filtro de relevancia para evitar ruido informativo y sobrecarga cognitiva. En entornos de tesis, donde el tiempo de lectura crítica es escaso, esta capa resulta especialmente estratégica.

Las reglas de costo, por su parte, cumplen doble función: sostenibilidad económica y disciplina metodológica. Limitar consumo obliga a priorizar consultas y a definir criterios explícitos de pertinencia, reduciendo prácticas exploratorias de bajo rendimiento.

Desde una mirada académica, esta combinación favorece un pipeline más “defendible”: cada elemento incorporado al flujo tiene una justificación de valor esperable frente a su costo de procesamiento.

## 4. Criterios de trazabilidad adoptados

En la implementación inicial se observan criterios que pueden formalizarse como base de gobernanza:

- **Temporalidad explícita:** eventos y entregas con marcas de tiempo.
- **Canal de evidencia único para alertas operativas:** Slack como registro primario de ejecución.
- **Separación entre planificación y ejecución:** calendario (qué/cuándo) vs cron (cómo/cuándo se ejecuta).
- **Resiliencia documentada:** fallback de búsqueda como decisión de continuidad, no como excepción invisible.
- **Racionalidad de costos:** límites y reglas de priorización para sostener el sistema en el tiempo.

Estos criterios son relevantes porque habilitan evaluación longitudinal. En una tesis, la trazabilidad no es un accesorio técnico: es parte del argumento de rigor.

## 5. Riesgos identificados y consideraciones metodológicas

Aunque el estado actual es funcional, se identifican riesgos que conviene monitorear:

1. **Riesgo de deriva de relevancia:** automatizaciones pueden mantener cadencia pero perder pertinencia temática sin recalibración periódica.
2. **Dependencia de canal único de consumo:** centralizar en Slack simplifica, pero puede ocultar eventos si no existen tableros complementarios.
3. **Heterogeneidad de fuentes en fallback:** resultados de motores distintos pueden afectar comparabilidad de síntesis.
4. **Saturación de alertas:** demasiados eventos de baja prioridad reducen atención sobre alertas críticas.
5. **Subregistro de decisiones humanas:** si no se documenta por qué se acepta/descarta evidencia, se debilita la trazabilidad interpretativa.

Para mitigar estos riesgos se sugiere incorporar protocolos breves de revisión semanal, umbrales de alertas y criterios de anotación de decisiones analíticas.

## 6. Conclusión

La infraestructura inicial de Clawdbot para Brokia muestra un avance sólido en términos de operacionalización de la tesis: existe coordinación entre monitoreo, búsqueda, calendarización y sincronización documental; además, se incorporan mecanismos de resiliencia y control de costo desde el comienzo.

El principal aporte de esta etapa no es únicamente “automatizar tareas”, sino construir un marco de trabajo donde cada flujo deja huella, puede ser evaluado y se integra al proceso académico con criterios explícitos. Esta base favorece la reproducibilidad y prepara el terreno para fases posteriores de análisis de impacto (calidad de hallazgos, tiempos de respuesta, utilidad para escritura y toma de decisiones).

En síntesis, la etapa actual cumple con los requisitos mínimos de una infraestructura investigativa trazable y escalable. El siguiente desafío es formalizar métricas y rutinas de validación para convertir la operación cotidiana en evidencia académica acumulable.

## Síntesis Semanal: 2026-02-17 al 2026-02-22

### Decisiones arquitectónicas relevantes

| Fecha | Decisión | Impacto | Estado |
|-------|----------|---------|--------|
| 17/02 | Esquema híbrido documentación (maestro + diario) | Trazabilidad incremental + visión acumulada | Activo |
| 18/02 | Seguridad RAG: límites estrictos + sanitización + 2 perfiles | Reduce riesgo exfiltración y prompt injection | Pendiente validación límites |
| 18/02 | Flujo ingestión Confluence: cheap first pass + refinement | Base de conocimiento QUBIKA estructurada | Operativo |
| 19/02 | Separación canales: Telegram personales / Slack team | Escalabilidad, reduce ruido | En migración |
| 19/02 | Migración modelo default a deepseek-v3.2 | Mejor flexibilidad y performance | Activo |
| 21/02 | Tool Output Compaction MVP (>150 líneas → resumen) | Reducir avg tokens/msg ~51k → <12k | Tests PASS, integrando |
| 21/02 | Split morning briefing: fetch 07:50 + assemble 08:00 | Evita timeouts, separa responsabilidades | Operativo desde 22/02 |

### Hallazgos de investigación con impacto estratégico

- **AI Agents en insurtech (18/02):** 74% ejecutivos reportan ROI primer año; 2026 será año de impacto operacional real con claims como primer dominio automatizado. Apps AI dentro de ChatGPT (Tuio, Insurify) ya perturban mercado de brokers.
- **Tamaño mercado insurtech (22/02):** Proyección USD 739B para 2035 (señal capturada en briefing_sources).
- **Resultados Lemonade Q4 (22/02):** Referencia clave para benchmarking de modelos insurtech.

### Artefactos técnicos generados

- `CONFLUENCE_INDEX.md` — índice técnico por dominio (QUBIKA)
- `CONFLUENCE_ACTIONABLE_SUMMARY.md` — 15 hallazgos accionables Ruby/deps + staging
- `QUBIKA_CONTEXT_PACK_V2.md` — paquete consolidado ejecución semanal
- `CHANNELS.md` — mapeo IDs Telegram/Slack
- `skills/exec-compact/` — wrapper Tool Output Compaction MVP
- `reports/briefing_sources/2026-02-22.md` — primer reporte fetch de fuentes (4.9 KB)

### Incidentes y mitigaciones

| Incidente | Fecha | Mitigación | Estado |
|-----------|-------|------------|--------|
| Fallos masivos cron jobs (context exhaustion) | 19/02 | Reorganización canales, reducción tokens | Parcialmente resuelto |
| Timeout LLM local phi3:mini (backlog groomer) | 22/02 | Fallback operó, items predefinados guardados | Monitorear |
| Errores modelo inválido en jobs Qubika | 22/02 | — | Pendiente corrección |
| Error "delivery target missing" briefing | 22/02 | — | Pendiente diagnóstico |

## Cambios pendientes de revisión humana

- [CRÍTICO] Corregir modelo en jobs `qubika-deadline-check` y `qubika-daily-focus` (modelo inválido `openai-codex/deepseek-v3.2`).
- [CRÍTICO] Diagnosticar y corregir `daily-morning-briefing-telegram` error "cron delivery target is missing".
- [CRÍTICO] Revisar y aprobar medidas de sanitización automática RAG interno.
- Validar redacción final para alineación con estilo del equipo en la entrega académica.
- Confirmar qué evidencia operativa (capturas, IDs de cron, ejemplos de alertas) se incluirá en anexos.
- Revisar criterios de exclusión/inclusión de newsletters para trazabilidad metodológica.
- Evaluar aumento de `LOCAL_LLM_TIMEOUT` o preloading de modelo phi3:mini.
- Aprobar plan `telegram-groups-migration.md` y definir cronograma migración jobs restantes.

## Próximas acciones

- Definir un esquema mínimo de métricas por corrida (éxito, fallback, latencia, utilidad percibida) y consolidarlo en un registro semanal.
- Estandarizar metadatos de búsqueda (motor, motivo de fallback, fuente seleccionada) para mejorar comparabilidad entre ciclos.
- Implementar niveles de prioridad en alertas de Slack para reducir ruido y preservar atención en eventos críticos.
- Establecer una revisión metodológica quincenal de reglas de curación y costo, con ajustes documentados.
- Diseñar una plantilla de “decisión analítica” para registrar por qué se incorpora o descarta evidencia en la tesis.
