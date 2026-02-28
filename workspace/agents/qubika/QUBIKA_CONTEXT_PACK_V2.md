# QUBIKA_CONTEXT_PACK_V2

Contexto consolidado para ejecutar upgrades de Ruby/dependencias por lotes en Bancard, usando evidencia de Confluence exportado.

---

## 1) Alcance y objetivo operativo

Este pack prioriza:
- Upgrade de Ruby/JRuby y dependencias.
- Estabilización de pipeline STG → PROD.
- Estandarización de release management y observabilidad.

### Fuentes base clave
- `2808250461` — **Ruby Upgrade - Estimations**.
- `3194716248` — **Revisión de Versiones de Ruby en Servicios**.
- `2826960897` — **Commerce Ruby Upgrade - Deploy a producción**.
- `2757492739` — **Deploy a producción**.
- `2261549409` — **Cómo es el flujo de Deploy con Docker?**.
- `3009052705` — **Migraciones con Rails y ActiveRecord**.
- `2994339849` — **Flujos de Trabajo / Workflows**.
- `2995027970` — **Releases / Versiones**.
- `2556756129` — **Sentry Status**.
- `2785771945` — **Deuda Técnica - 2022/04**.

---

## 2) Situación actual (síntesis técnica)

### 2.1 Capacidad de planificación ya disponible
- Existe estimación consolidada por servicio en `2808250461`.
- Se reporta una banda total de **119–179 días** (excluyendo loyalty-service y vpos-portal).

### 2.2 Priorización técnica disponible
- `3194716248` ya clasifica servicios por estado de runtime (clases 1/2/3).
- Hay servicios en runtime legacy (ej. JRuby 1.7.x; Ruby 2.1.10-slim) que elevan riesgo de compatibilidad.

### 2.3 Riesgos transversales declarados
- `2785771945` explicita deuda en actualización Ruby/deps para todos los proyectos.
- El histórico de status (`2774630417`, `2775056562`, `2778071079`) muestra bloqueos por datos, dependencias externas y definición incompleta.

### 2.4 Base de release ya validada
- `2826960897` aporta checklist real de release Ruby con dependencias de conectividad, DB y configuración.
- `2757492739` y `2979037185` aportan plantilla reusable de pasaje productivo.

---

## 3) Arquitectura de ejecución por lotes (práctica semanal)

## Lote 0 (preparación, 1 semana)

**Objetivo:** dejar base común y gobernanza.

### Entregables
1. Matriz viva de servicios (runtime, dependencia crítica, dueño técnico), iniciada desde `3194716248`.
2. Plantilla única de release (basada en `2826960897` + `2757492739`).
3. Workflow Jira unificado (`2994339849`) y uso mandatorio de Fix Version (`2995027970`).
4. Baseline de observabilidad por servicio (`2556756129`).

### Criterio de salida Lote 0
- Todos los servicios candidato tienen: dueño, estado runtime, checklist release, estado Sentry y Fix Version policy.

---

## Lote 1 (baja fricción)

**Candidatos:** servicios con clasificación favorable (1/2) y menor complejidad de dependencias según `3194716248` + `2808250461`.

### Plan de ejecución
1. Congelar alcance por servicio (runtime target + gems críticas).
2. Abrir PRs de upgrade + PR de configuración si aplica.
3. Validar pipeline Docker/CI según `2261549409`.
4. Deploy a STG con checklist (migraciones, conectividad, datos estáticos, observabilidad).
5. Cierre con QA + release tags/versiones en Jira.

### Gate de salida
- Sin errores críticos en STG.
- Sentry operativo en STG/PROD para servicios del lote.
- Tickets del lote con Fix Version definida.

---

## Lote 2 (media fricción)

**Candidatos:** servicios con compatibilidad parcial y/o dependencias externas relevantes.

### Enfoque
- Programar ventana con Infra/DBA antes de implementación.
- Probar migraciones con estrategia de `3009052705` (si aplica Rails).
- Ejecutar canary funcional y validación de datos crítica.

### Gate de salida
- Cero bloqueos abiertos de conectividad/infra.
- Rollback plan documentado por servicio.

---

## Lote 3 (alta fricción / legacy)

**Candidatos:** servicios clasificación 3 o con alta deuda de runtime/gemas.

### Enfoque
- Discovery técnico previo (POC de compatibilidad).
- Aislar refactors inevitables de cambios de versión.
- Definir si conviene upgrade incremental o estrategia de reemplazo.

### Gate de salida
- Documento de decisión técnica por servicio (seguir/postergar/reemplazar).

---

## 4) Playbook mínimo de release (STG/PROD)

Checklist reutilizable extraído de `2826960897`, `2757492739`, `2979037185`:

1. **Scope**
   - Feature branch y repos involucrados.
2. **Dependencias externas**
   - Servicios externos.
   - Conectividad con otros servidores.
3. **DB**
   - Migraciones requeridas.
   - Coordinación DBA.
   - Validación de cluster objetivo (ej. MySQL 8.0 cuando aplique).
4. **Storage/estáticos**
   - Buckets S4 y carga de assets/datos.
5. **Configuración**
   - PR config STG.
   - PR config PROD.
6. **Código**
   - PRs a develop/master por repositorio.
7. **Observabilidad**
   - Sentry habilitado y monitoreo post-release.
8. **Trazabilidad**
   - Tickets con Fix Version.
   - Estado workflow consistente (mergeado/deployado/QA/aprobado).

---

## 5) Dependencias de entorno para ejecución

### Entornos y objetivo
- `2794455126` define claramente Desarrollo, Staging, Sandbox y Producción.

### Acceso operativo
- `2576154645` Hosts configuration.
- `2938404958` acceso a Sentry depende de hosts + VPN.
- `2544730189` está marcado como deprecated (tratar como legacy y validar reemplazo vigente).

### Riesgo operativo detectado
- `2548170757` contiene procedimiento manual de dumps y exposición de credenciales en el export.
- Acción recomendada: sanear documentación y mover secretos a mecanismo seguro.

---

## 6) Modelo de gobernanza semanal

## Cadencia propuesta
- **Lunes:** planificación de lote y validación de bloqueos.
- **Miércoles:** checkpoint técnico (compatibilidad, migraciones, QA STG).
- **Viernes:** decisión de release y postmortem corto de lote.

## Métricas mínimas
1. Servicios completados por lote.
2. Lead time ticket “en progreso → aprobado QA”.
3. Tasa de rollback/hotfix post-release.
4. Cobertura Sentry operativa por servicio.
5. Bloqueos externos abiertos/cerrados por semana.

---

## 7) Riesgos y mitigaciones (directo a decisión técnica)

1. **Riesgo:** incompatibilidad runtime/gemas en servicios legacy.
   - **Mitigación:** discovery + POC en lote 3.
2. **Riesgo:** dependencia infra/DBA no cerrada.
   - **Mitigación:** Go/No-Go obligatorio antes de ventana de release.
3. **Riesgo:** baja trazabilidad de despliegues.
   - **Mitigación:** workflow único + Fix Version mandatoria.
4. **Riesgo:** observabilidad insuficiente.
   - **Mitigación:** baseline Sentry previa a deploy.
5. **Riesgo:** prácticas manuales con secretos.
   - **Mitigación:** saneamiento documental + rotación + secret manager.

---

## 8) Backlog técnico recomendado (primeras 3 semanas)

### Semana 1
- Cerrar Lote 0 (gobernanza + plantilla release + baseline observabilidad).
- Definir servicios de Lote 1 con dueños y capacidad.

### Semana 2
- Ejecutar Lote 1 en STG.
- QA con workflow estandarizado.

### Semana 3
- Release controlado de Lote 1 a PROD.
- Ajustes de playbook con learnings.
- Inicio de discovery de Lote 2.

---

## 9) Anexos de referencia rápida

- **Estimación y priorización:** `2808250461`, `3194716248`.
- **Runbooks deploy:** `2826960897`, `2757492739`, `2979037185`, `2261549409`.
- **Gestión release/workflow:** `2994339849`, `2995027970`.
- **Observabilidad/deuda:** `2556756129`, `2938404958`, `2785771945`.
- **Entorno/acceso:** `2794455126`, `2576154645`, `2544730189`.

---

## Próximas acciones

1. Aprobar formalmente el esquema de lotes (0/1/2/3) y dueños por servicio.
2. Publicar plantilla única de release y hacerla obligatoria para todas las iniciativas Ruby/deps.
3. Ejecutar un piloto de Lote 1 con reporte de métricas al cierre de la primera semana.
4. Depurar documentación legacy/deprecated y remediar exposición de secretos documentados.
