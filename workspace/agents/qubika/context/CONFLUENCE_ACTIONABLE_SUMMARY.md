# CONFLUENCE_ACTIONABLE_SUMMARY

Top 15 hallazgos accionables para la iniciativa **Ruby/dependencias + staging/release**.

> Base documental: export Confluence JSON (`context/raw/confluence-export/confluence-export`).

## Resumen ejecutivo

- Existe material suficiente para ejecutar upgrades por lotes, pero está **fragmentado** entre runbooks técnicos (deploy/migraciones), gestión (workflows/releases) y estado histórico (status syncs).
- El mayor valor inmediato está en combinar: **matriz de versiones + estimaciones + checklist de release + estándar de QA/release tracking**.
- Persisten riesgos transversales: seguridad/auth, observabilidad incompleta y dependencia de infraestructura legacy (VPN/hosts/manualidad operativa).

---

## Top 15 hallazgos accionables

### 1) Hay una base cuantificada para planificar lotes de upgrade Ruby
- **Fuente:** `2808250461` — *Ruby Upgrade - Estimations*.
- **Evidencia:** estimación total reportada de **119–179 días** (sin loyalty-service ni vpos-portal), con estimación por servicio.
- **Riesgo:** ejecutar sin lotes priorizados provoca cola larga y baja visibilidad de valor.
- **Quick win:** dividir en ondas por criticidad y esfuerzo (lote 1, 2, 3).
- **Recomendación:** congelar en Jira un plan de lotes con capacidad semanal real del equipo.

### 2) Existe inventario de versiones real para priorización técnica
- **Fuente:** `3194716248` — *Revisión de Versiones de Ruby en Servicios*.
- **Evidencia:** servicios clasificados en niveles (1/2/3), incluyendo casos legacy (ej. JRuby 1.7.x, Ruby 2.1.10).
- **Riesgo:** incompatibilidades de gems y runtime si se mezcla upgrade de servicios muy dispares en un solo corte.
- **Quick win:** arrancar por servicios clasificación 1 y 2 con menor fricción.
- **Recomendación:** construir “matriz de compatibilidad de gems” por lote antes de abrir PR masivos.

### 3) Hay señal explícita de deuda transversal en Ruby/deps
- **Fuente:** `2785771945` — *Deuda Técnica - 2022/04*.
- **Evidencia:** ítem explícito: “**Actualización de Ruby y dependencias TODOS**”.
- **Riesgo:** mantener deuda horizontal incrementa incidentes y costo de mantenimiento.
- **Quick win:** registrar deuda Ruby/deps como epic permanente con hitos por release.
- **Recomendación:** tratar upgrade Ruby como programa continuo, no esfuerzo one-shot.

### 4) El release de Ruby Commerce ya documenta bloqueos concretos reutilizables
- **Fuente:** `2826960897` — *Commerce Ruby Upgrade - Deploy a producción*.
- **Evidencia:** dependencias marcadas: conectividad externa, otros servidores, migración MySQL 8.0, S4 buckets, datos estáticos.
- **Riesgo:** re-trabajo y caída de release por prerequisitos no resueltos.
- **Quick win:** convertir esos checks en “Go/No-Go” obligatorio para todo release Ruby.
- **Recomendación:** institucionalizar checklist única de prerequisitos de infraestructura.

### 5) El runbook de deploy productivo existe, pero es plantilla genérica
- **Fuente:** `2757492739` — *Deploy a producción*; `2979037185` — *Deploy a producción PIX Service*.
- **Evidencia:** estructura con placeholders para migraciones, inserts y PRs config STG/PROD.
- **Riesgo:** releases con placeholders incompletos o información inconsistente.
- **Quick win:** exigir “Definition of Ready de Release” (sin placeholders abiertos).
- **Recomendación:** agregar validación previa automática (script/checklist firmado por dueño técnico).

### 6) Pipeline Docker/CI está bien explicado y es apto para estandarizar lotes
- **Fuente:** `2261549409` — *Cómo es el flujo de Deploy con Docker?*.
- **Evidencia:** diferencia clara de jobs `tests`/`provide`, filtros de branch y push de imágenes.
- **Riesgo:** comportamiento divergente por desconocimiento de reglas de branch/provide.
- **Quick win:** checklist de branch naming y condiciones de provide por repo.
- **Recomendación:** auditar repos que no respeten flujo y normalizar `.circleci/config.yml`.

### 7) Proceso de desarrollo→deploy está documentado y alinea onboarding con ejecución
- **Fuente:** `2430435329` — *Proceso de Deploy*.
- **Evidencia:** secuencia completa desde setup local hasta merge/deploy.
- **Riesgo:** variaciones entre equipos generan cuellos de QA y release.
- **Quick win:** usar este flujo como “single source” para nuevos lotes Ruby.
- **Recomendación:** enlazarlo formalmente en PR template y definición de done.

### 8) Migraciones Rails tienen estrategia de seguridad ya probada en STG
- **Fuente:** `3009052705` — *Migraciones con Rails y ActiveRecord*.
- **Evidencia:** pruebas en staging contra cluster MySQL (10.100.14.22), uso de `db:prepare` y gema **Strong Migrations**.
- **Riesgo:** migraciones manuales/unsafe en cambios de schema durante upgrade.
- **Quick win:** replicar patrón (Strong Migrations + pipeline) en servicios Rails aplicables.
- **Recomendación:** política de migraciones: “sin validación de seguridad no hay release”.

### 9) Estado de trabajo Ruby mostró bloqueos recurrentes (datos/C4C/info incompleta)
- **Fuente:** `2774630417`, `2775056562`, `2778071079` — *Status Qubika (9/10/14 Nov)*.
- **Evidencia:** bloqueos por C4C, problemas de datos/duplicados, tickets con poca info y dependencia de coordinación.
- **Riesgo:** throughput impredecible y arrastre de tickets entre sprints.
- **Quick win:** triage semanal de bloqueos con dueños y SLA de respuesta.
- **Recomendación:** incorporar columna formal “Bloqueado por dependencia externa” en tablero.

### 10) Workflows Jira propuestos corrigen ambigüedad entre merge/deploy/QA
- **Fuente:** `2994339849` — *Flujos de Trabajo / Workflows*.
- **Evidencia:** columnas específicas: “Para Deployar (mergeado)”, “Deployado STG”, “QA en Progreso”, “Aprobado por QA”.
- **Riesgo:** sin estados estándar no se puede medir lead time de release.
- **Quick win:** aplicar este workflow en tableros de iniciativas Ruby/deps.
- **Recomendación:** gobernar transición de estados con reglas y responsables claros.

### 11) Releases/Versiones en Jira habilitan trazabilidad fina de despliegues
- **Fuente:** `2995027970` — *Releases / Versiones*.
- **Evidencia:** define uso de `Affect Version` y `Fix Version` para planificación y reportes.
- **Riesgo:** despliegues sin versionado formal dificultan auditoría y postmortem.
- **Quick win:** exigir `Fix Version` en todos los tickets de lote Ruby antes de deploy.
- **Recomendación:** generar changelog por versión desde Jira para cada ventana de release.

### 12) Convenciones de branching/protección de ramas están claras
- **Fuente:** `2711453730` — *Git Branching*; `2270068737` — *Configuración de Repositorios*.
- **Evidencia:** default branch `develop` (servicios/portales), `master` (gems), patrones `feature/*` y protecciones.
- **Riesgo:** merges fuera de política generan drift entre repos en un upgrade transversal.
- **Quick win:** checklist de compliance Git por repos del lote antes de iniciar trabajo.
- **Recomendación:** bloquear merge si no cumple reglas mínimas de ramas/protecciones.

### 13) Observabilidad: hay tablero de estado, pero cobertura heterogénea
- **Fuente:** `2556756129` — *Sentry Status*.
- **Evidencia:** matriz por servicio/ambiente con estados de tracking.
- **Riesgo:** upgrades sin telemetría homogénea aumentan MTTR y riesgo en producción.
- **Quick win:** “no-go” de release Ruby para servicios sin Sentry mínimo en STG/PROD.
- **Recomendación:** definir baseline obligatorio de observabilidad por servicio.

### 14) Acceso a observabilidad depende de prerequisitos de red/hosts
- **Fuente:** `2938404958` — *Qué es Sentry y como accedo?*; `2576154645` — *Hosts Configuration*; `2544730189` — *VPN Configuration (DEPRECATED)*.
- **Evidencia:** acceso requiere configuración de hosts + VPN.
- **Riesgo:** fricción operativa en guardias/diagnóstico de incidentes post-release.
- **Quick win:** validación automatizada de conectividad de onboarding técnico.
- **Recomendación:** consolidar guía vigente (evitar dependencia en documentación deprecated).

### 15) Riesgo operativo/seguridad en manejo de datos de staging
- **Fuente:** `2548170757` — *Tutorial dump de base de staging*.
- **Evidencia:** runbook con pasos manuales de export/import de base y credenciales visibles en el contenido exportado.
- **Riesgo:** exposición de secretos + manipulación manual de datos sensibles.
- **Quick win:** retirar secretos de documentación y rotar credenciales asociadas.
- **Recomendación:** mover credenciales a gestor de secretos y usar procedimientos auditables.

---

## Riesgos principales (prioridad semanal)

1. **Compatibilidad técnica cruzada** (runtime/gemas/migraciones) al ejecutar upgrades simultáneos.
2. **Dependencias externas de release** (infra/conectividad/DBA) no cerradas antes de ventana.
3. **Trazabilidad incompleta** si no se estandariza workflow + releases en Jira.
4. **Observabilidad desigual** que reduce capacidad de detectar regresiones post-upgrade.
5. **Operación manual y legacy docs** (VPN/hosts/dumps) elevando riesgo operacional.

## Quick wins (7–10 días)

1. Definir lotes Ruby por clasificación de `3194716248` + esfuerzo `2808250461`.
2. Implementar checklist Go/No-Go unificada derivada de `2826960897` + `2757492739`.
3. Activar estados workflow estándar (`2994339849`) y uso mandatorio de `Fix Version` (`2995027970`).
4. Exigir baseline Sentry para releases (`2556756129`).
5. Sanitizar documentación con secretos y rotar credenciales expuestas (`2548170757`).

## Bloqueos recurrentes detectados

- Dependencia con terceros/sistemas externos (C4C, conectividad).
- Problemas de datos y duplicados en pruebas.
- Tickets con definición insuficiente.
- Coordinación tardía con DBA/infra.

---

## Próximas acciones

1. Armar en Jira un **plan de 3 lotes** (L1/L2/L3) con fecha objetivo y capacidad real.
2. Publicar una **plantilla única de release** (DoR + Go/No-Go + rollback + observabilidad).
3. Ejecutar un **piloto de lote 1** en 1–2 servicios con revisión post-release para ajustar el playbook.
4. Consolidar documentación vigente (marcar claramente deprecated/legacy).
