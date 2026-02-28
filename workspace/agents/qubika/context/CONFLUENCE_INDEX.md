# CONFLUENCE_INDEX

Índice técnico curado de Confluence para ejecución semanal (foco Ruby/dependencias + staging/release).

> Criterio de prioridad: **Alta** = impacta ejecución inmediata o riesgo operativo; **Media** = soporte importante; **Baja** = contexto de referencia.

## 1) Deploy

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2826960897 | Commerce Ruby Upgrade - Deploy a producción | Checklist real de release Ruby (PRs, dependencias de conectividad, migración MySQL 8.0). |
| Alta | 2430435329 | Proceso de Deploy | Flujo end-to-end (branch, PR, CI, merge, deploy) para proyectos dockerizados. |
| Alta | 2261549409 | Cómo es el flujo de Deploy con Docker? | Detalle de pipeline build/provide/deploy y relación con bancard-docker. |
| Alta | 2757492739 | Deploy a producción | Plantilla operativa de pasaje con migraciones, inserts y configuraciones STG/PROD. |
| Media | 2979037185 | Deploy a producción PIX Service | Variante aplicada a PIX (útil para releases con inserts/migraciones). |
| Media | 2995027970 | Releases / Versiones | Marco Jira para versionado y trazabilidad de release (Affect/Fix Version). |
| Media | 2994339849 | Flujos de Trabajo / Workflows | Estandariza estados desde merge hasta deploy STG/PROD. |
| Media | 2548170757 | Tutorial dump de base de staging | Runbook operativo para export/import de datos de staging. |

## 2) Docker

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2261155855 | Cómo levanto un proyecto de Bancard dockerizado? | Base de setup local homogéneo para servicios dockerizados. |
| Alta | 2547220489 | Cómo configuro Docker Compose? | Cambios concretos en Dockerfile, scripts y compose para estandarizar proyectos. |
| Alta | 2261549409 | Cómo es el flujo de Deploy con Docker? | Dependencias de CI/provide en proyectos con DockerHub + bancard-docker. |
| Media | 2260140106 | Setup de Máquina Docker con CentOs | Referencia de setup de entorno legacy. |
| Media | 2422734871 | S4 dockerization | Caso de dockerización de servicio puntual. |
| Baja | 3515908125 | Sentry and Docker Compose Status | Estado combinado de observabilidad y compose. |

## 3) Auth

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2330099727 | Auth Service | Referencia núcleo de autenticación (servicio base). |
| Alta | 2405957977 | Auth Multiservices | Contexto de autenticación transversal entre servicios. |
| Alta | 2719973398 | Auth Public | Iniciativa y alcance para auth público. |
| Alta | 2730229808 | Issue: BAAS authentication and service codes | Issue técnico con impacto en autenticación y códigos de servicio. |
| Media | 2262269958 | Cómo genero un token JWT? (Video tutorial) | Procedimiento de generación de JWT para pruebas/validaciones. |
| Media | 2818015246 | Baas Token Authentication | Variante de autenticación por token para BAAS. |
| Media | 3067117571 | Refactor Reseteo de Password | Cambio funcional con impacto auth + release. |
| Media | 3067314177 | Deploy a producción - Nuevo Flujo Reseteo Password | Evidencia de pasaje productivo de flujo auth. |

## 4) Servicios

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 3194716248 | Revisión de Versiones de Ruby en Servicios | Matriz de versiones Ruby/JRuby y clasificación de riesgo de upgrade. |
| Alta | 2808250461 | Ruby Upgrade - Estimations | Esfuerzo por servicio (mín/máx) y prioridades para ejecución por lotes. |
| Alta | 3009052705 | Migraciones con Rails y ActiveRecord | Estrategia de migraciones seguras (db:prepare + Strong Migrations). |
| Media | 2316894213 | Endpoints a Bloquear en VPOS-SERVICE | Hardening de superficie expuesta en servicio crítico. |
| Media | 2370109459 | S4 Service | Contexto funcional/técnico de S4. |
| Media | 2843508752 | Creación de un nuevo servicio en Ruby on Rails | Guía para bootstrap de nuevos servicios Rails. |
| Media | 2979037185 | Deploy a producción PIX Service | Caso completo de release orientado a servicio puntual. |

## 5) Observabilidad

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2556756129 | Sentry Status | Estado de cobertura de error tracking por servicio/ambiente. |
| Alta | 2938404958 | Qué es Sentry y como accedo? | Dependencias de acceso (hosts + VPN) para operar observabilidad. |
| Alta | 3066069021 | Notas sobre definiciones para logs, vista de detalles y proceso para migraciones DBA | Estándar propuesto de logging e histórico para procesos de migración. |
| Alta | 2785771945 | Deuda Técnica - 2022/04 | Señala explícitamente “Actualizar Ruby y dependencias TODOS” + brechas de auth/sentry. |
| Media | 4313743470 | 📘 Guía de Configuración de Proyectos en Sentry | Guía operativa de alta/configuración en Sentry. |
| Media | 2669051936 | Tasking Vulnerabilidades 2023 | Backlog de seguridad con impacto en releases. |
| Media | 2935488544 | Vulnerabilidades 2024 - Tasking y Estimación | Priorización reciente de mitigaciones. |

## 6) Onboarding

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2261417989 | Onboarding - General | Ruta inicial de onboarding técnico/operativo. |
| Alta | 2789474436 | Bienvenido/a a Bancard! | Puerta de entrada y navegación de documentación. |
| Alta | 2794455126 | Ambientes en Bancard | Define Desarrollo/Staging/Sandbox/Producción y propósito de cada uno. |
| Media | 2261155855 | Cómo levanto un proyecto de Bancard dockerizado? | Base práctica para alta de devs. |
| Media | 2621308929 | Microsoft Teams Setup | Dependencia de comunicación operativa. |
| Media | 2261025149 | IPA Users Setup | Setup de usuarios/entornos complementario. |
| Media | 2576154645 | Hosts Configuration | Requisito previo para acceder a herramientas internas. |
| Baja | 2544730189 | VPN Configuration (DEPRECATED) | Aún citado por otras guías; tratar como legacy. |

## 7) Repos

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2270068737 | Configuración de Repositorios | Estándares de naming, ramas por tipo de repo y branch protection. |
| Alta | 2711453730 | Git Branching | Contrato operativo de ramas (develop/master/feature/provide). |
| Alta | 2995027970 | Releases / Versiones | Gobernanza de releases en Jira y trazabilidad de cambios. |
| Alta | 2994339849 | Flujos de Trabajo / Workflows | Estados de tablero alineados a ciclo real de entrega. |
| Media | 2575237367 | Pull Requests | Template y buenas prácticas de PR. |
| Media | 2269937665 | GitHub Guidelines | Marco general de uso de GitHub. |
| Media | 2994995206 | Sincronización del Tablero con GitHub | Integración Jira↔GitHub para seguimiento de ejecución. |
| Media | 2580971535 | Configuración de Reminders en GitHub | Automatización de seguimiento/revisión. |

## 8) Infraestructura

| Prioridad | ID | Título | Nota de uso |
|---|---:|---|---|
| Alta | 2794455126 | Ambientes en Bancard | Topología por ambiente para planificar despliegues y QA. |
| Alta | 2261188632 | Detalle de Máquinas Virtuales (VMs) de Bancard | Inventario de VMs y dependencia de acceso por VPN. |
| Alta | 2576154645 | Hosts Configuration | Requisito de resolución local para herramientas internas. |
| Media | 2261450763 | Infrastructure | Nodo raíz de información de infraestructura (actualmente con poco contenido exportado). |
| Media | 2855600176 | Redis Cluster | Iniciativa/arquitectura de Redis cluster. |
| Media | 2841903105 | Puertos usados en entorno de desarrollo local | Compatibilidad de puertos y conflictos locales. |
| Baja | 2544730189 | VPN Configuration (DEPRECATED) | Referencia histórica; validar contra alternativa vigente (WARP). |
| Baja | 3657138188 | WARP VPN Configuration | Ruta probable de reemplazo operativo de VPN legacy. |

---

## Próximas acciones

1. Confirmar con TL/PM un **subset “must-read”** de alta prioridad (10–12 páginas) para sprint actual.
2. Etiquetar páginas **legacy/deprecated** y proponer consolidación para reducir ambigüedad operativa.
3. Versionar este índice semanalmente (delta de cambios por ID + fecha de última edición).
