# Mission Control — Overview

## Qué es Mission Control

Mission Control es una **capa de orquestación thin** sobre el engine de gestión de workitems (`brokia/workitems/**`). Proporciona:

- API REST para operaciones CRUD sobre workitems
- Sistema de logs estructurados por workitem
- Index incremental O(1) para consultas recientes
- TTL-based stale detection para procesos RUNNING
- Guardrails de seguridad (path traversal, ID validation)
- Observabilidad distribuida (id_validation propagation, stale events)

## Qué problema resuelve

El engine workitems es un sistema de archivos + scripts bash que opera por convención. Mission Control agrega:

1. **Interfaz programática**: REST API sobre filesystem
2. **Observabilidad**: logs estructurados, index de eventos, estado de runs
3. **Seguridad**: validación de inputs, prevención de path traversal
4. **Escalabilidad**: O(1) para queries recientes vs O(n×m) scan completo
5. **Robustez**: TTL detection para procesos huérfanos

## Por qué thin layer

- **Engine inmutable**: El motor workitems es canonico; no se modifica
- **Reversibilidad**: Mission Control puede desactivarse; el engine sigue funcionando
- **Testeabilidad**: La lógica de negocio permanece en scripts testeables
- **Evolución independiente**: API puede cambiar sin afectar datos

## Principios arquitectónicos

| Principio | Aplicación |
|-----------|------------|
| **Additive-only** | Nunca romper contratos API; solo agregar campos |
| **Defense in depth** | Validación en boundary (API) + core (server) + filesystem (safeResolve) |
| **Fail-safe** | Fallbacks automáticos (index ausente → scan; TTL expirado → stale) |
| **Evidence-based** | Cada cambio requiere smoke tests + typecheck |
| **No big-bang** | Cambios incrementales versionados (v1.3.1, v1.3.2, v1.3.3) |

## Stack tecnológico

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind v4
- Filesystem como datastore (no DB externo)
- Scripts bash como engine de negocio

## Alcance vs Out-of-scope

| In-scope | Out-of-scope |
|----------|--------------|
| API REST sobre workitems | Modificar engine workitems |
| Logs estructurados | Base de datos relacional |
| Indexación incremental | Cache distribuida |
| Guardrails de seguridad | Autenticación/Autorización (fase actual) |
| TTL/stale detection | Orquestación de clusters |

## Relación con la tesis

Mission Control es el **caso de estudio** para el marco multiagente de desarrollo asistido por IA. No es solo software; es la demostración empírica de:

- Cómo un orquestador humano + agentes especializados pueden construir software robusto
- Cómo documentar decisiones técnicas con rigor académico
- Cómo mantener trazabilidad de riesgos y mitigaciones
