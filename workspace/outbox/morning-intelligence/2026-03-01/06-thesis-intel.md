# Thesis Intel — 2026-03-01

## TL;DR (3 bullets)
- Insurtech: los *AI agents* se están empaquetando como módulos de proceso (IDP/quotes/servicing) más que como “chat”: el diferencial es integración + gobernanza.
- Secure RAG: acceso por documento/chunk + auditoría “replayable” se vuelve requisito base en escenarios enterprise y regulados.
- Compliance: el mejor camino es “thin layer” (overlay) sobre legacy: extracción + validación + logs + human-in-the-loop.

## Hallazgos (7)
1) CoverGo lanza AI agents para automatización en seguros (IDP + quotation + servicing)
   - Por qué importa: valida el patrón de producto “agent-as-process-module” con foco en underwriting/claims/servicing.
   - Links: https://covergo.com/news/ai-agents-for-insurance-automation/
   - Idea Brokia: diseñar 2 agentes acotados: (a) IDP para submissions (15 campos + completitud), (b) Quote assistant con comparativa + checklist de faltantes.

2) Broker/market barometers indican fuerte foco en intake + extracción como el primer ROI
   - Por qué importa: refuerza que el primer wedge es intake/triage, no “copiloto generalista”.
   - Links: https://www.guidewire.com/about/press-center/london-market-tech-barometer-2026
   - Idea Brokia: medir KPIs de intake: tiempo a primera respuesta, % submissions completas, % STP (straight-through) con revisión.

3) Enterprise controls para RAG: permisos en retrieval + trazabilidad end-to-end (query→retrieve→generate)
   - Por qué importa: sin ABAC/tenant isolation + audit trail, un RAG multi-tenant tiende a filtrar datos.
   - Links: https://intrinsecsecurity.com/blog/research/ai-governance/rag-in-the-real-world-enterprise-controls/
   - Idea Brokia: implementar logging obligatorio: usuario→docs/chunks recuperados→respuesta→bloqueos por policy (y export a SIEM).

4) Seguridad en AI agents: monitoreo de tool-use + baselines y detección de desviaciones
   - Por qué importa: el riesgo no es solo “hallucination”, sino agentes que acceden/hacen cosas fuera del scope.
   - Links: https://fast.io/resources/ai-agent-cybersecurity-monitoring/
   - Idea Brokia: “agent firewall” interno: allowlist de herramientas + rate limits + alertas por picos de acceso.

5) Compliance teams usando agentes para filings/auditorías (patrón de automatización regulatoria)
   - Por qué importa: muestra adopción pragmática donde la salida final es un artefacto auditable, no una conversación.
   - Links: https://www.stack-ai.com/insights/how-compliance-teams-use-ai-agents-to-automate-regulatory-filings-and-audit-reports
   - Idea Brokia: generar “audit packets” por caso: inputs, extracción, reglas aplicadas, fuentes y decisiones (listo para revisión).

6) Deloitte: agentes personales y GenAI presionan el modelo tradicional de intermediación
   - Por qué importa: amenaza/oportunidad: brokers que ganan serán los que integren automatización + servicio always-on.
   - Links: https://www.deloitte.com/uk/en/Industries/insurance/blogs/ai-launches-challenge-insurance-and-wealth-models.html
   - Idea Brokia: posicionar Brokia como “operating system” del corredor: intake + seguimiento + renovación, con handoff humano.

7) IA y riesgo de manipulación/synthetic media: necesidad de controles y verificación
   - Por qué importa: voice/document fraud va a pegar directo en seguros (claims/submissions).
   - Links: https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026
   - Idea Brokia: checklist antifraude: señales de inconsistencias documentales + verificación secundaria para casos sospechosos.

## Ideas accionables para Brokia (4)
- Mini-evals propios: 30–50 documentos → extracción de 15 campos → métricas + taxonomy de errores.
- Secure RAG por diseño: chunk-level ACL + ABAC multi-tenant + logs inmutables.
- Agent ops: allowlist de tools + monitoreo de desviaciones + rate limits.
- “Audit packet” por caso: trazabilidad completa para compliance y revisión humana.
