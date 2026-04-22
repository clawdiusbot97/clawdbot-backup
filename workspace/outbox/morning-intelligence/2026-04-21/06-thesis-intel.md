# Thesis Intel — 2026-04-21

## TL;DR
- Document AI: extraction quality needs evals + auditability.
- Voice agents: production constraints are streaming/latency + safety/consent.
- Secure RAG: redaction, audit logs, and data residency are table stakes.

## Hallazgos (6)
1) docTR (OCR baseline) — https://github.com/mindee/doctr
2) LayoutLMv3 (layout-aware doc understanding) — https://arxiv.org/abs/2204.08387
3) Unstructured (document ETL primitives) — https://github.com/Unstructured-IO/unstructured
4) LlamaIndex ingestion patterns for RAG — https://docs.llamaindex.ai/
5) Whisper (ASR anchor for voice flows) — https://github.com/openai/whisper
6) OWASP LLM Top 10 (secure AI checklist) — https://owasp.org/www-project-top-10-for-large-language-model-applications/

## Ideas accionables para Brokia
- Build an extraction eval suite (golden PDFs + scoring) before scaling.
- Make intermediate JSON + provenance mandatory for every extraction run.
- Prototype voice claim intake: ASR → PII redaction → structured summary → follow-ups.
