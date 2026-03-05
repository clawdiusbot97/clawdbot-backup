# Brokia + Decision Core — Documento Unificado (v2.2)

**Fecha:** 2026-03-04  
**Versión:** v2.2  
**Idioma:** Español  
**Objetivo:** documento defendible como tesis de emprendimiento y útil como base técnica (arquitectura modular + MVP realista).

---

## Resumen ejecutivo (10–12 líneas)
Brokia es un **asistente conversacional por WhatsApp** para corredores de seguros automotor que guía al cliente, ayuda a estructurar la información y acompaña al corredor sin reemplazarlo. El dolor central del negocio es sistémico: decisiones operativas críticas (cobertura, deducible, vigencia, selección de póliza, documentación) se toman en conversaciones (texto, audios, llamadas) y hoy se traducen a operación mediante memoria humana y copy/paste.

La propuesta combina dos capas: (1) **Brokia (Insurance Pack)**, enfocado en el flujo de cotización–propuesta–aceptación y la atención diaria; y (2) **Decision Core**, un motor reusable que convierte conversaciones en **Decision Objects** trazables, emite **Decision Events** y dispara ejecución de procesos con un **Process Runner** simple.

En el MVP no prometemos integraciones con múltiples aseguradoras ni cotización automática universal. Validamos el patrón: **Conversation → Decision Objects → Decision Events → Process Execution**, con trazabilidad operativa (Evidence + Timeline + Diff) y una **Decision Inbox** mínima para que el corredor intervenga solo cuando es necesario (human-in-the-loop, materialidad).

---

## 1) Problema, oportunidad y propuesta de valor

### 1.1 Problema (real, recurrente)
En la operación de corredores de seguros, el canal dominante es WhatsApp (texto + audios) y, cuando hay urgencia, llamadas. Allí se toman decisiones que luego impactan en emisión, cambios, renovaciones y siniestros.

Hoy ocurre:
- Las decisiones quedan **dispersas** en chats/audios, sin estructura.
- No existe una **versión vigente** clara (“lo último que acordamos”).
- Los cambios aparecen **por goteo** (endosos, ajustes de condiciones).
- La operación depende de **memoria humana** y copy/paste hacia portales y notas.
- Se generan **reprocesos, errores, reclamos** y mala trazabilidad.

El patrón a reemplazar:
- **Conversation → memoria humana → operación**

Por:
- **Conversation → Decision Objects → Decision Events → Process Execution**

### 1.2 Oportunidad
- WhatsApp es el **system of conversation** del corredor.
- El corredor necesita un **system of record** para decisiones operativas (estado vigente + evidencia + seguimiento), sin cambiar su forma de trabajar.
- Si se logra trazabilidad operativa y reducción de reprocesos en un vertical concreto (auto), el motor es transferible a otros rubros.

### 1.3 Propuesta de valor
Para el corredor:
- Menos tiempo en persecución de datos y re-trabajo.
- Menos errores por malentendidos (cobertura/deducible/vigencia).
- Evidencia recuperable en minutos (mejor defensa ante reclamos).
- Control operativo: decisiones confirmadas generan tareas/seguimiento.

Para el cliente:
- Proceso más claro y guiado.
- Menos fricción para cotizar y elegir.

---

## Experiencia del cliente con Brokia
El cliente no “usa una plataforma”: **habla por WhatsApp como siempre**, pero siente una experiencia más rápida y clara.

Qué ve el cliente:
- Un asistente que hace **preguntas paso a paso** (sin pedir todo junto).
- Explicaciones simples de conceptos de seguro (cobertura, deducible, vigencia).
- Confirmaciones puntuales cuando algo es importante (“para evitar errores”).
- Propuestas presentadas de forma clara (resumen + opciones).

Qué NO cambia:
- El canal sigue siendo WhatsApp.
- El corredor sigue siendo el asesor responsable.

**Ejemplo corto de conversación (cliente)**
- Cliente: “Hola, quiero asegurar un Onix 2018. ¿Cuánto me sale?”
- Brokia: “Dale. Para cotizar rápido: ¿el auto es para uso particular o trabajo?”
- Cliente: “Particular.”
- Brokia: “Perfecto. ¿Circula más por ciudad o ruta? (1 opción)?”
- Cliente: “Ciudad.”
- Cliente: “¿Qué es deducible?”
- Brokia: “Es el monto que pagás vos en un siniestro antes de que cubra el seguro. Ejemplo: deducible 20.000 significa que los primeros 20.000 los cubrís vos y el resto la aseguradora. Si querés, decime si preferís cuota más baja (deducible más alto) o más tranquilidad (deducible más bajo).”

En paralelo, el corredor recibe el caso estructurado (y puede intervenir en decisiones materiales).

---

## Rol del corredor (human-in-the-loop)
Brokia **no reemplaza al corredor**: lo descomprime operativamente para que pueda volver a enfocarse en asesorar.

Qué automatiza el sistema:
- relevamiento guiado y ordenamiento de información,
- detección de faltantes/ambigüedades,
- armado de borradores (propuesta, checklist),
- recordatorios y seguimiento básico.

Qué mantiene el corredor bajo control:
- decisiones **materiales** (elección de póliza, cobertura, deducible, precio, aceptación final),
- correcciones relevantes cuando la extracción automática no es confiable,
- criterio de asesoramiento (trade-offs, explicación y recomendación).

Beneficios del human-in-the-loop:
- reduce carga operativa sin perder confianza del cliente,
- mantiene responsabilidad profesional del corredor,
- mejora trazabilidad (se registra quién confirmó y qué evidencia lo respalda).

---

## Política de Autonomía Conversacional
Brokia opera con un modelo híbrido **IA + humano**. La IA puede responder y avanzar en lo simple, pero escala al corredor cuando hay impacto real.

### Autopilot (IA responde automáticamente)
Aplica a interacciones de **baja materialidad**:
- relevamiento de datos (preguntas paso a paso),
- recordatorios y seguimiento de documentos,
- explicaciones básicas (qué es deducible, qué significa cobertura),
- estado del proceso (“estamos armando la propuesta”).

Objetivo: reducir fricción y tiempos de respuesta, sin pedirle al corredor que esté “online” para todo.

### Copilot (intervención del corredor)
Aplica a decisiones **materiales**:
- elección de póliza,
- cambios de cobertura,
- deducibles,
- precio,
- aceptación final.

En Copilot, la IA:
- detecta la decisión en la conversación,
- crea/actualiza el Decision Object,
- genera un borrador o alerta,
- solicita confirmación del corredor en la **Decision Inbox**.

### Cómo se implementa esto con Decision Core
La distinción Autopilot/Copilot se implementa sin “magia” mediante:
- `materiality_flag` o `severity` en el Decision Object,
- Decision Events (`decision.needs_info`, `decision.confirmed`, etc.),
- y la **Decision Inbox** como punto de control humano para decisiones materiales.

**Ejemplo operativo (simple):**
- Cliente: “¿Qué significa deducible?” → **Autopilot** responde.
- Cliente: “Vamos con la opción B.” → se detecta `PolicySelection` → **Copilot**: el corredor confirma en Inbox (o valida que la opción B es la propuesta vigente) → luego se confirma y dispara el proceso.

---

## UX Conversacional en WhatsApp (mensajes interactivos)
Brokia aprovecha primitives nativas de WhatsApp (inspiración: **CRMs conversacionales y herramientas de mensajería**) para **reducir ambigüedad** y hacer el flujo más rápido sin “volverse CRM”. El objetivo es guiar al cliente y estandarizar confirmaciones.

### A) Primitives utilizadas
- **Quick Reply Buttons (botones):** respuestas de 1 tap para opciones frecuentes.
- **List Messages (listas):** selección de una opción dentro de una lista (menos texto libre).
- **Carruseles:** presentar 2–3 propuestas comparables con acción “Elegir”.
- **Flows (formularios en chat):** *opcional (post-MVP).* El MVP funciona sin Flows; se incluyen como mejora futura si aportan velocidad sin aumentar complejidad.

### B) Conexión con el Decision Core
- **Botones/Listas → QuoteRequest y confirmaciones:**
  - reducen variabilidad del input,
  - facilitan completar campos del `QuoteRequest.payload`,
  - y generan evidencia más “limpia” para `PolicySelection`.
- **Carruseles → QuoteProposal:**
  - presentan opciones comparables,
  - y permiten “Elegir” una opción de forma estándar.
- **Flows → captura rápida de datos (post-MVP):**
  - puede acelerar relevamiento,
  - pero se deja fuera si introduce fricción técnica o de implementación.

En todos los casos, cada interacción queda registrada como **EvidenceItem** y, cuando corresponde, actualiza la versión del **DecisionObject**.

### C) Ejemplos mini (cómo se vería en WhatsApp)

**1) Botones — Uso del vehículo**
- Brokia: “¿Uso del vehículo?”
- Botones: `[Particular] [Trabajo] [Mixto]`

**2) Lista — Tipo de cobertura**
- Brokia: “Elegí tipo de cobertura”
- Lista:
  - “Terceros”
  - “Terceros + incendio”
  - “Total / Todo riesgo”

**3) Carrusel — Propuesta con 2 opciones**
- Tarjeta A: “Opción A — $X/mes — Deducible $Y — Resumen cobertura” → botón `[Elegir A]`
- Tarjeta B: “Opción B — $X/mes — Deducible $Y — Resumen cobertura” → botón `[Elegir B]`

**4) Confirmación final — Aceptación**
- Brokia: “Para emitir, confirmame: ¿aceptás la Opción B con deducible $Y y vigencia desde DD/MM?”
- Botón: `[ACEPTO]` (o texto estandarizado “ACEPTO”)

### D) Cierre (beneficios)
- **Beneficio UX:** menos fricción y menos ida-vuelta por ambigüedad; respuestas más rápidas.
- **Beneficio técnico:** menos errores de extracción (menos texto libre) y mejor trazabilidad (evidencia estandarizada y versionado consistente).

---

## 2) Alcance MVP (qué SÍ y qué NO)

### 2.1 Qué SÍ (MVP 6 meses)
- **1 flujo end-to-end completo:** Cotización → Propuesta → Aceptación.
- WhatsApp como canal principal (texto + audio con transcripción).
- **Decision Core** con:
  - Decision Objects versionados,
  - Evidence Store,
  - Decision Events,
  - Process Runner simple (WHEN event THEN steps).
- **Decision Inbox web mínima** para control humano (materialidad, faltantes, confirmaciones).
- Trazabilidad operativa: Evidence + Timeline + Diff.
- Cotización en modo realista (ver Sección 4.3): **carga manual del corredor** + orden/plantillas del sistema.

### 2.2 Qué NO (explícito)
- Integraciones reales con múltiples aseguradoras y cotización automática universal.
- Marketplace de plugins o editor visual avanzado de workflows.
- Automatización autónoma de decisiones materiales sin human-in-the-loop.
- Multicanal completo (Teams/Slack) como entrada primaria en MVP.

---

## 3) Arquitectura conceptual (2 capas)

### 3.1 Capa A — Decision Core (reusable)
Motor genérico que transforma conversación en decisiones trazables y ejecuta procesos simples.

### 3.2 Capa B — Insurance Pack (Brokia)
Paquete vertical que define:
- tipos de decisiones del dominio seguros,
- schemas/validaciones,
- reglas de materialidad,
- prompts de extracción,
- procesos (event → steps) del corredor.

**Objetivo de diseño:** modularidad suficiente para reutilizar el core, sin sobre-ingeniería.

---

## 4) Modelo de datos conceptual (mínimo viable)

### 4.1 Decision Core — Entidades

**DecisionObject**
- `id` (uuid)
- `type` (string)
- `state` (`draft | needs_info | confirmed | executed | canceled`)
- `payload` (JSON)
- `version` (int)
- `actor` (`client | broker | system`) *(quién originó/confirmó el cambio)*
- `materiality_flag` (bool) o `severity` (`low|material`)
- `case_id` (string) *(agrupa por cliente/póliza/cotización/siniestro)*
- `created_at`, `updated_at`

**EvidenceItem**
- `id`
- `channel` (`whatsapp`)
- `external_ref` (`message_id`, `audio_id`, etc.)
- `timestamp`
- `raw_text` (si aplica)
- `attachments` (urls/ids)
- `transcript` (si es audio)
- `decision_object_id`
- `decision_version` *(a qué versión respalda)*

**DecisionEvent**
- `id`
- `type` (`decision.detected | decision.needs_info | decision.confirmed | decision.executed | decision.overdue`)
- `decision_object_id`
- `decision_version`
- `case_id`
- `timestamp`
- `metadata` (JSON)

**ProcessRun**
- `id`
- `trigger_event_id`
- `status` (`running|completed|failed|canceled`)
- `steps[]` (lista persistida)
- `created_at`, `updated_at`

**ProcessStepExecution**
- `process_run_id`
- `step_type` (`create_task | notify | generate_doc | request_approval | update_status`)
- `status` (`pending|running|done|failed`)
- `result_ref` (link a tarea/notificación/doc generado)
- `error` (si aplica)

### 4.2 Insurance Pack — Entidades mínimas de contexto (opcionales)
Para el MVP, el core puede operar con `case_id`. Si se agrega contexto:
- **Client**: `id`, `name`, `phone`
- **Vehicle**: `plate`, `year`, `model` (mínimo)
- **PolicyContext** (si existiera): `policy_number` (si aplica)

---

## 5) Sección 1 — Producto (Brokia)

### 5.1 Qué es Brokia (producto)
Brokia es un **asistente conversacional por WhatsApp** (texto + audio) que:
- guía al cliente con preguntas dinámicas (relevamiento),
- explica opciones en lenguaje simple,
- acompaña al corredor reduciendo carga operativa,
- mejora trazabilidad operativa sin obligar a cambiar el canal.

**Human-in-the-loop:** Brokia no reemplaza al corredor. Las decisiones **materiales** se confirman explícitamente y quedan registradas.

### 5.2 Diferenciación (3 bullets)
- **Vs cotizadores tradicionales:** Brokia no es solo “precio”; captura decisiones y evidencia en el canal real (WhatsApp) y mantiene estado vigente/versionado.
- **Vs CRMs genéricos:** el CRM organiza contactos/pipeline; Brokia gobierna decisiones operativas y su trazabilidad (qué se acordó, cuándo y con qué evidencia).
- **Vs chatbots FAQ:** Brokia no es un bot de preguntas frecuentes; estructura decisiones reales, detecta faltantes/ambigüedad y crea seguimiento operativo.

---

## 6) Sección 2 — Decision Core (genérico y reusable)

### 6.1 Componentes mínimos (4)

#### (1) Decision Objects
- `type` (string)
- `state` (draft/needs_info/confirmed/executed/canceled)
- `payload` (JSON)
- `version` (int)
- `actor` (client/broker/system)
- `timestamps`
- `materiality_flag` o `severity`

#### (2) Evidence Store
- `channel` (whatsapp)
- `message_id/external_ref`
- `timestamp`
- `raw_text`
- `attachments`
- `transcript` (audio)
- link a Decision Object + versión

#### (3) Decision Events
- `decision.detected`
- `decision.needs_info`
- `decision.confirmed`
- `decision.executed`
- `decision.overdue`

**Rol:** puente entre “registro” (Decision Store) y “acción” (Process Runner). Permite automatizar sin depender de que alguien “se acuerde”.

#### (4) Process Runner (simple)
- Reglas: `WHEN event THEN steps`
- Steps (MVP): `create_task`, `notify`, `generate_doc`, `request_approval`, `update_status`
- Persistencia: estado por step (para trazabilidad y reintentos controlados)

### 6.2 Cómo se vuelve plug-and-play en MVP (packs)
Sin UI avanzada, se logra “configurabilidad mínima” con **packs** (carpetas/paquetes) que registran:
- decision types + schemas/validaciones,
- prompts de extracción,
- reglas de materialidad,
- procesos (event → steps).

Ejemplo conceptual:
- `packs/insurance_auto/decision_types/*.json`
- `packs/insurance_auto/materiality_rules.yml`
- `packs/insurance_auto/processes/*.yml`

---

## 7) Sección 3 — Insurance Pack (vertical seguros)

### 7.1 Decision types del MVP (concretos)

#### 1) QuoteRequest
- **Propósito:** relevamiento estructurado para pedir cotización.
- **Payload mínimo:**
  - `client_name`, `client_phone`
  - `vehicle_year`, `vehicle_model`, `plate?`
  - `usage` (particular/comercial)
  - `zone` (si aplica)
  - `drivers` (lista simple)
  - `desired_coverage` (si existe)
- **Materialidad:** cambios en `vehicle`, `usage`, `drivers`, `desired_coverage` → material.
- **Evento que dispara:** al completar campos críticos → `decision.confirmed` (QuoteRequest confirmado por corredor/sistema) para iniciar armado de propuesta.

#### 2) QuoteProposal
- **Propósito:** propuesta presentada al cliente (opciones y explicación).
- **Payload mínimo:**
  - `options[]` (lista) con: `name`, `premium`, `coverage_summary`, `deductible`, `notes`
  - `valid_until` (fecha)
  - `assumptions` (texto)
- **Materialidad:** cambios en precio/cobertura/deducible/validez → material.
- **Evento que dispara:** `decision.confirmed` cuando el corredor publica/envía la propuesta final.

#### 3) PolicySelection
- **Propósito:** el cliente elige una opción.
- **Payload mínimo:**
  - `selected_option_id` o `selected_name`
  - `client_confirmation_text` (snapshot del “vamos con X”)
- **Materialidad:** selección/cambio de opción → material.
- **Evento que dispara:** `decision.confirmed` al recibir confirmación explícita del cliente.

#### 4) PolicyAcceptance
- **Propósito:** aceptación formal operativa (equivalente a “ok, emitir”).
- **Payload mínimo:**
  - `acceptance_text_snapshot` (ej. “ACEPTO”) + timestamp
  - `accepted_terms_ref` (referencia a propuesta)
- **Materialidad:** siempre material (activa ejecución).
- **Evento que dispara:** `decision.confirmed` → inicia proceso de emisión (tareas internas).

#### 5) ChangeRequest (futuro o básico)
- **Propósito:** cambios postventa (endosos). En MVP puede quedar “básico” o fuera.
- **Estado recomendado:** **fuera del flujo principal MVP**, o limitado a “capturar request + tarea” sin automatizar.

### 7.2 Cotizaciones en MVP (realista)
Se consideran dos opciones:
- **Opción A (simuladas/precargadas):** útil para demo, pero débil para piloto real.
- **Opción B (recomendada para tesis): carga manual del corredor**, con Brokia estructurando:
  - el QuoteRequest,
  - el template de propuesta (PDF/imagen/tabla),
  - y la trazabilidad (qué se ofreció y qué se aceptó).

**Recomendación:** Opción B. Es defendible, ejecutable y prueba el núcleo (decisiones + trazabilidad + procesos) sin prometer integraciones complejas.

---

## 8) Sección 4 — Flujo MVP end-to-end (obligatorio)

### Flujo: Cotización → Propuesta → Aceptación

> Caso: cliente nuevo pide seguro para auto.

#### Paso 1) Mensaje inicial del cliente (ejemplo)
**WhatsApp (cliente):** “Hola, quiero asegurar un Onix 2018. ¿Cuánto me sale?”
- **Se guarda:** EvidenceItem (mensaje).
- **Decisión:** se crea `QuoteRequest` en `draft`.
- **Evento:** `decision.detected`.
- **Tarea:** ninguna todavía.

#### Paso 2) Preguntas de relevamiento (zona, uso, conductores, etc.)
**Brokia (asistente) pregunta** (con tono simple, 1–2 preguntas por vez):
- “¿El auto es para uso particular o para trabajo?”
- “¿En qué zona circula principalmente?”
- “¿Hay conductores menores de 25?”
- “¿Tenés matrícula y año/modelo confirmados?”

> Idealmente, estas preguntas se apoyan en botones/listas de WhatsApp para reducir ambigüedad (sin cambiar el alcance del flujo).

- **Se guarda:** EvidenceItems (respuestas, audios transcritos si aplica).
- **Decisión:** se actualiza `QuoteRequest.payload` y `version++`.
- **Evento:** si faltan campos críticos → `decision.needs_info`.

#### Paso 3) Creación/confirmación de QuoteRequest (Decision Object)
Cuando el QuoteRequest tiene campos mínimos:
- **Se guarda:** `QuoteRequest` pasa a `confirmed`.
- **Evento:** `decision.confirmed` (QuoteRequest).
- **Proceso:** Process Runner crea tarea “Armar propuesta” para el corredor (`create_task`).

#### Paso 4) Generación de QuoteProposal (PDF/imagen/tabla)
**Corredor** carga opciones (manual) y Brokia genera una propuesta clara (ej. PDF simple o imagen).
- **Se guarda:** `QuoteProposal` en `draft` → `confirmed` al enviarse.
- **Evidencia:** archivo generado + mensaje enviado al cliente.
- **Evento:** `decision.confirmed` (QuoteProposal).
- **Proceso:** `notify` al corredor / registrar estado “Propuesta enviada”.

#### Paso 5) PolicySelection por parte del cliente
**WhatsApp (cliente):** “Vamos con la opción B.”
- **Se guarda:** `PolicySelection` con snapshot del texto.
- **Evidencia:** mensaje (idealmente selección con botón/lista).
- **Evento:** `decision.confirmed` (PolicySelection).
- **Proceso:** crear tarea “Preparar emisión” + checklist mínima de documentación.

#### Paso 6) PolicyAcceptance (“ACEPTO” + snapshot)
**WhatsApp (cliente):** “ACEPTO. Emití.”
- **Se guarda:** `PolicyAcceptance` confirmado.
- **Evidencia:** snapshot + timestamp (idealmente botón “ACEPTO” o texto estandarizado).
- **Evento:** `decision.confirmed` (PolicyAcceptance).

#### Paso 7) Event `decision.confirmed`
- Este evento es el disparador “operativo”: ya no es conversación, es decisión confirmada.

#### Paso 8) Process Runner — pasos
Regla ejemplo:
- `WHEN PolicyAcceptance.confirmed THEN [create_task, notify, update_status, generate_doc]`

Steps:
1) `create_task`: “Emitir póliza (manual en portal) + completar doc”.
2) `notify`: notificación interna (correo o push) al corredor/junior.
3) `update_status`: caso pasa a “En emisión”.
4) `generate_doc`: “Resumen interno de lo aceptado” (para trazabilidad; no contrato).


### Decision Timeline ejemplo (6–10 items)
1) `decision.detected` → QuoteRequest v1 (draft) — evidencia: msg inicial.
2) `decision.needs_info` → QuoteRequest v2 — evidencia: respuesta uso/zona.
3) `decision.confirmed` → QuoteRequest v3 — evidencia: confirmación campos mínimos.
4) `decision.confirmed` → QuoteProposal v1 — evidencia: PDF enviado.
5) `decision.confirmed` → PolicySelection v1 — evidencia: “Vamos con B”.
6) `decision.confirmed` → PolicyAcceptance v1 — evidencia: “ACEPTO”.
7) ProcessRun started — “Emisión” steps pending.
8) Step done — `create_task` + `update_status`.

---

## 9) Sección 5 — Decision Inbox (corredor)
UI web mínima (no reemplaza WhatsApp): es un centro de control para intervenir solo cuando hace falta.

**Vistas mínimas**
- **Lista (Inbox):** decisiones detectadas por caso, con estado y prioridad.
- **Detalle:** payload estructurado + campos faltantes + evidencia + botones.

**Acciones (botones)**
- Completar datos (edición de campos críticos)
- Confirmar / Rechazar (decisiones materiales)
- Marcar como ejecutado (cuando se completó un proceso manual)

**Filtros**
- por cliente / caso / estado

**Acceso**
- abrir Timeline del caso (sin leer chat completo)

---

## 10) Trazabilidad (Evidence + Timeline + Diff)
**Objetivo:** recuperar “qué se decidió” sin releer conversaciones completas.

- **Evidence:** mensajes y audios transcritos, enlazados a una decisión y versión.
- **Timeline:** secuencia cronológica de decisiones, confirmaciones y ejecución.
- **Diff:** comparación entre versiones (qué cambió, cuándo, quién lo confirmó).

Esto habilita:
- resolución rápida de dudas/reclamos,
- continuidad en handoffs,
- y evaluación objetiva del proceso (mejoras y métricas).

---

## 11) Sección 6 — Arquitectura MVP (simple)

### Diagrama ASCII

```
WhatsApp API
  ↓
Conversation Handler
  ↓
LLM Extraction + Validation
  ↓
Decision Core (DB + Events + Evidence)
  ↓
Process Runner
  ↓
Notificaciones / Tareas
  ↓
Inbox Web
```

**Core (reusable):** Decision Core (DB/Events/Evidence) + Process Runner.  
**Insurance Pack:** prompts de extracción, schemas/validaciones, materialidad, procesos del corredor.

---

## 12) Roadmap (MVP → v1 → v2) — acotado y realista

### MVP (≤ 6 meses)
- 1 flujo completo: Cotización → Propuesta → Aceptación.
- Decision Core operativo + trazabilidad (Evidence/Timeline/Diff).
- Inbox mínima.
- Cotizaciones: carga manual del corredor + templates.

### v1 (post-MVP)
- 1–2 procesos adicionales sobre el mismo core:
  - Renovación (nuevo ciclo con decisiones similares)
  - o Cambio de vehículo / cambio simple (captura + confirmación + tareas)

### v2 (futuro)
- Integraciones reales con aseguradoras (si hay APIs o acuerdos), o automatización parcial donde sea viable.

---

## 13) Riesgos y trade-offs

### 13.1 Riesgos técnicos
- **Extracción con LLM:** falsos positivos/negativos; requiere validación y umbrales.
- **Audio/transcripción:** calidad variable; riesgo de malinterpretar.
- **WhatsApp API:** limitaciones, onboarding, compliance de plantillas.
- **Seguridad y evidencia:** manejo de PII y retención; acceso por roles.

### 13.2 Trade-offs (decisiones de diseño)
- **Generalidad vs velocidad:** un core mínimo acelera; demasiada abstracción mata el MVP.
- **Automatización vs human-in-the-loop:** lo material requiere confirmación humana para evitar errores.
- **Simulación vs integraciones reales:** el MVP valida el patrón con carga manual; integraciones se dejan para v2.

---

## 14) Métricas de éxito (operativas y de validación)

**Operativas (eficiencia)**
- Tiempo promedio por cotización (min) desde primer mensaje hasta propuesta enviada.
- Tiempo desde selección/aceptación hasta “tarea de emisión creada” (min).

**Calidad**
- % de decisiones confirmadas sin corrección grande del corredor.
- # de reprocesos por malentendido (por mes) en cobertura/deducible/vigencia.

**Trazabilidad**
- Tiempo para reconstruir historial de un caso (min) antes vs después.
- % de casos donde se puede mostrar evidencia de una decisión en <2 min.

**Valor percibido**
- NPS o score cualitativo del corredor piloto.

---

## 15) Supuestos explícitos
- WhatsApp seguirá siendo el canal dominante para el corredor piloto.
- El corredor acepta una UI mínima (Inbox) siempre que reduzca retrabajo y no cambie el flujo.
- La cotización automática multi-aseguradora no es necesaria para validar el núcleo.
- La trazabilidad operativa es un “dolor pagable” (WTP) si reduce reclamos/tiempo.
- Human-in-the-loop es requisito: no se automatizan decisiones materiales sin confirmación.

---

**Archivo sugerido:** este documento está listo para pegar en Google Doc o repositorio como base del MVP y del diseño modular Brokia + Decision Core.
