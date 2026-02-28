# Brokia Context Pack v1

## 1) Misión del proyecto
Brokia busca mejorar la operación de un broker de seguros (foco inicial: autos) con automatización práctica y trazabilidad de decisiones, evitando sobre-ingeniería.

## 2) Estado actual
- Etapa: validación-first (antes de cerrar MVP final)
- Objetivo inmediato: mapear proceso real + tiempos + cuellos de botella
- Prioridad: ejecución pragmática, no teoría

## 3) Equipo y roles
- Manu: producto/tecnología/arquitectura
- Rodrigo: legal + sistemas
- Juan Manuel: conocimiento operativo del broker (~10 años)

## 4) Hipótesis clave
1. La mayor palanca está en acelerar cotización multi-aseguradora.
2. Estandarizar captura de datos desde mensajería reduce retrabajo.
3. Trazabilidad explícita de decisiones mejora calidad operativa y auditoría.
4. Extracción de datos desde fotos/documentos del vehículo puede reducir fricción (factibilidad a validar).

## 5) No negociables (guardrails)
- No scope creep sin evidencia.
- Todo experimento debe tener criterio de éxito explícito.
- Mantener experiencia simple para operador y cliente.
- Registrar decisiones relevantes (qué, por qué, impacto).

## 6) Flujo objetivo de alto nivel (MVP)
1. Ingreso de lead/consulta (canal mensajería)
2. Captura estructurada de datos
3. Preparación de solicitud de cotización
4. Comparación de opciones
5. Recomendación/decisión con justificación
6. Seguimiento y cierre

## 7) Métricas base sugeridas
- Tiempo total desde consulta a propuesta
- Tiempo por etapa (captura, cotización, comparación)
- % casos con retrabajo
- % casos con datos incompletos
- Tasa de cierre
- Tiempo de respuesta al cliente

## 8) Backlog estratégico inicial
- Mapa actual de proceso real (as-is)
- Lista de fricciones por etapa
- Dataset mínimo de campos obligatorios
- Plantillas de mensajes/solicitud
- Registro de decisiones (decision log)
- Prototipo de soporte IA para resumen/recomendación trazable

## 9) Política de decisiones
Cuando se proponga una mejora, documentar:
- Problema concreto
- Opciones evaluadas
- Decisión elegida y motivo
- Riesgo principal
- Siguiente experimento

## 10) Cómo debe trabajar el subagente brokia
- Entregar siempre: hipótesis -> plan corto -> output accionable
- Salidas preferidas: checklist, plan semanal, experimento, matriz decisión
- Explicitar supuestos
- Mantener respuestas cortas y ejecutables
- Cerrar con 1–3 next actions
