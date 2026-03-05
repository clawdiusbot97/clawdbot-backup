# Thesis Intel — 2026-03-03

## TL;DR
- El “PDF → Markdown/JSON” sigue siendo el cuello de botella práctico para RAG y workflows de brokers: vale más el pipeline + evaluación que “un modelo”.
- Voice agents: la ventaja competitiva está en latencia end-to-end + turn-taking + observabilidad (no sólo calidad de voz).
- Insurtech/enterprise: el discurso se mueve a “agentic workflows” con guardrails (compliance, logs, permisos en retrieval) como diferenciador.

## Hallazgos (6)
1) Marker (OSS) como baseline práctico para PDF→Markdown/JSON — https://github.com/datalab-to/marker
2) OpenDataLoader Bench para evaluar parsing PDF en RAG — https://github.com/opendataloader-project/opendataloader-bench
3) OmniDocBench (paper) como referencia de benchmarking multi-documento — https://arxiv.org/html/2412.07626v1
4) Voice agents: ingeniería de latencia (observabilidad + streaming) — https://cresta.com/blog/engineering-for-real-time-voice-agent-latency
5) Microsoft: “agentic AI” en seguros (tendencias/casos) — https://www.microsoft.com/en-us/industry/blog/financial-services/2026/02/18/from-bottlenecks-to-breakthroughs-how-agentic-ai-is-reshaping-insurance/
6) Audio watermarking / deepfake detection como capa de confianza — https://www.usenix.org/conference/usenixsecurity25/presentation/zong | https://www.resemble.ai/audio-watermarking-trends-innovations/

## Ideas accionables para Brokia (4)
- Banco de pruebas de documentos (anonimizados) + evaluator automático (tablas/campos/reading order).
- SLOs para voice agents (TTFA, turn-taking, tasa de barge-in) + dashboard mínimo.
- “Compliance by design”: logs de decisiones + permisos en retrieval + redacción de PII como requisitos de MVP.
- Módulo anti-fraude: watermarking/telemetría + detección de audio sintético en procesos sensibles.